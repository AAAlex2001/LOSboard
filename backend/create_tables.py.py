import asyncio

from database import engine, Base

from models.user import User
from models.advertisement import Advertisement


async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    print("Таблицы созданы")


asyncio.run(create_tables())