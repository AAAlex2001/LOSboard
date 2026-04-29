from typing import List
from models.category import Category
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload


class GetListCategoriesUseCase:


    #нужно чтобы вместе с категориями отдавались и их подкатегории, чтобы не делать лишних запросов к БД при отображении категорий на фронте
    async def get_list_categories(
        self,
        db: AsyncSession,
    ) -> List[Category]:

        result = await db.execute(
            select(Category).options(
                selectinload(Category.subcategories))
                .where(Category.is_active == True)
                .order_by(Category.sort_order)
        )

        categories = result.scalars().all()

        return categories
    