import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
import uvicorn

from routes.auth import router as auth_router
from routes.advertisement import router as advertisement_router
from routes.category import router as category_router
from routes.upload import router as upload_router
from routes.chat import router as chat_router
from routes.content import router as content_router
from routes.banner import router as banner_router
from routes.attribute import router as attribute_router
from services.rate_limit import limiter
from admin import setup_admin


app = FastAPI(title="LOSboard API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

CORS_ORIGINS = [
    origin.strip()
    for origin in os.environ["CORS_ORIGINS"].split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_admin(app)

app.include_router(auth_router)
app.include_router(advertisement_router)
app.include_router(category_router)
app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(content_router)
app.include_router(banner_router)
app.include_router(attribute_router)

UPLOADS_DIR = Path(__file__).resolve().parent / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/static/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")


@app.get("/")
async def root():
    return {"message": "API is running"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
