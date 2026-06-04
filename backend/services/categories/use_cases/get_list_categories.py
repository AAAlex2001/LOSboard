from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from models.category import Category


class GetListCategoriesUseCase:
    """Список активных категорий с предзагруженными подкатегориями — один запрос."""

    async def get_list_categories(self, db: AsyncSession) -> list[Category]:
        result = await db.execute(
            select(Category)
            .options(selectinload(Category.subcategories))
            .where(Category.is_active.is_(True))
            .order_by(Category.sort_order)
        )
        return list(result.scalars().all())
