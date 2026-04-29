import asyncio
from sqlalchemy import text

from database import engine, Base

from models.user import User
from models.category import Category, Subcategory
from models.advertisement import Advertisement


async def reset_advertisements_table():
    async with engine.begin() as conn:
        print("Удаляю старую таблицу advertisements...")

        await conn.execute(
            text("DROP TABLE IF EXISTS advertisements CASCADE")
        )

        print("Создаю таблицу advertisements заново...")

        await conn.run_sync(
            Advertisement.__table__.create
        )

        print("Готово. Таблица advertisements пересоздана.")


asyncio.run(reset_advertisements_table())