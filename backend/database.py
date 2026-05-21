import os
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from dotenv import find_dotenv, load_dotenv
from sqlalchemy.orm import declarative_base


Base = declarative_base()

load_dotenv(find_dotenv())

DATABASE_URL = os.environ["DATABASE_URL"]


ECHO_SQL = os.environ["ECHO_SQL"].lower() == "true"
DB_POOL_SIZE = int(os.environ["DB_POOL_SIZE"])
DB_MAX_OVERFLOW = int(os.environ["DB_MAX_OVERFLOW"])
DB_POOL_TIMEOUT = int(os.environ["DB_POOL_TIMEOUT"])
DB_POOL_RECYCLE = int(os.environ["DB_POOL_RECYCLE"])
DB_COMMAND_TIMEOUT = int(os.environ["DB_COMMAND_TIMEOUT"])

engine = create_async_engine(
    DATABASE_URL,
    echo=ECHO_SQL,
    future=True,
    pool_size=DB_POOL_SIZE,
    max_overflow=DB_MAX_OVERFLOW,
    pool_timeout=DB_POOL_TIMEOUT,
    pool_recycle=DB_POOL_RECYCLE,
    pool_pre_ping=True,
    pool_use_lifo=True,
    connect_args={"command_timeout": DB_COMMAND_TIMEOUT},
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency для получения сессии базы данных
    Используется в FastAPI через Depends(get_db)
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

