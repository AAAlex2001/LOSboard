from fastapi import HTTPException
from models.advertisement import Advertisement
from models.user import User
from schemas.advertisement import AdvertisementCreate
from sqlalchemy.ext.asyncio import AsyncSession
from models.category import Category, Subcategory
from sqlalchemy import select

from services.advertisement.attribute_helpers import replace_attribute_values
from services.seo.indexnow import submit_advertisement


class CreateAdvertisementUseCase:

    async def create_advertisement(
        self,
        request: AdvertisementCreate,
        db: AsyncSession,
        current_user: User,
    ) -> Advertisement:

        if not current_user:
            raise HTTPException(status_code=401, detail="Требуется авторизация")
        
        category_result = await db.execute(
            select(Category).where(Category.id == request.category_id),
            Category.is_active == True
        )

        category = category_result.scalar_one_or_none()

        if not category:
            raise HTTPException(status_code=400, detail="Категория не найдена или неактивна")

        subcategory_result = await db.execute(
            select(Subcategory).where(
                Subcategory.id == request.subcategory_id,
                Subcategory.category_id == request.category_id,
                Subcategory.is_active == True
            )
        )    

        subcategory = subcategory_result.scalar_one_or_none()

        if not subcategory:
            raise HTTPException(status_code=400, detail="Подкатегория не найдена или неактивна")

        if subcategory.category_id != category.id:
            raise HTTPException(status_code=400, detail="Подкатегория не относится к выбранной категории")

        new_advertisement = Advertisement(
            title=request.title,
            description=request.description,
            price=request.price,
            category_id=request.category_id,
            subcategory_id=request.subcategory_id,
            location=request.location,
            photo_urls=list(request.photo_urls or []),
            is_active=request.is_active,
            is_urgent=request.is_urgent,
            owner_id=current_user.id,
        )

        db.add(new_advertisement)
        await db.flush()
        await db.refresh(new_advertisement)

        await replace_attribute_values(
            db=db,
            advertisement_id=new_advertisement.id,
            category_id=new_advertisement.category_id,
            subcategory_id=new_advertisement.subcategory_id,
            payload=request.attributes,
        )
        await db.flush()

        submit_advertisement(new_advertisement.id, new_advertisement.title)

        return new_advertisement
