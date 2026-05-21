from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from database import engine, Base, AsyncSessionLocal
import models.user
import models.advertisement
import models.category
from routes.auth import router as auth_router
from routes.advertisement import router as advertisement_router
from routes.category import router as category_router
from routes.upload import router as upload_router
from seeds.categories_seed import seed_categories
import uvicorn


async def run_migrations(conn):
    """create_all не альтерит существующие таблицы, поэтому добавляем недостающие колонки руками."""
    await conn.execute(text(
        "ALTER TABLE advertisements "
        "ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT now()"
    ))
    await conn.execute(text(
        "ALTER TABLE advertisements "
        "ADD COLUMN IF NOT EXISTS photo_urls TEXT[] NOT NULL DEFAULT '{}'"
    ))
    # переносим старое single photo_url в массив (если колонка ещё есть)
    await conn.execute(text("""
        DO $$
        BEGIN
            IF EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name = 'advertisements' AND column_name = 'photo_url'
            ) THEN
                UPDATE advertisements
                   SET photo_urls = ARRAY[photo_url]
                 WHERE photo_url IS NOT NULL
                   AND photo_url <> ''
                   AND cardinality(photo_urls) = 0;
                ALTER TABLE advertisements DROP COLUMN photo_url;
            END IF;
        END $$;
    """))


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await run_migrations(conn)

    async with AsyncSessionLocal() as session:
        await seed_categories(session)

    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(advertisement_router)
app.include_router(category_router)
app.include_router(upload_router)

UPLOADS_DIR = Path(__file__).resolve().parent / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/static/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")


@app.get("/")
async def root():
    return {"message": "API is running"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
