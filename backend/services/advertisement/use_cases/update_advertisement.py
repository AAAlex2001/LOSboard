from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.advertisement import Advertisement
from models.user import User
from fastapi import HTTPException
from schemas.advertisement import AdvertisementUpdate

from services.advertisement.attribute_helpers import replace_attribute_values
from services.seo.indexnow import submit_advertisement


class UpdateAdvertisementUseCase:

    async def update_advertisement(
        self,
        advertisement_id: int,
        request: AdvertisementUpdate,
        db: AsyncSession,
        current_user: User,
    ) -> Advertisement:

        if not current_user:
            raise HTTPException(status_code=401, detail="Требуется авторизация")

        result = await db.execute(
            select(Advertisement).where(Advertisement.id == advertisement_id)
        )

        advertisement = result.scalar_one_or_none()

        if advertisement is None:
            raise HTTPException(status_code=404, detail="Объявление не найдено")

        if advertisement.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Нельзя редактировать чужое объявление")

        update_data = request.model_dump(exclude_unset=True)
        attributes = update_data.pop("attributes", None)

        for field, value in update_data.items():
            setattr(advertisement, field, value)

        await db.flush()

        if attributes is not None:
            await replace_attribute_values(
                db=db,
                advertisement_id=advertisement.id,
                category_id=advertisement.category_id,
                subcategory_id=advertisement.subcategory_id,
                payload=request.attributes or [],
            )
            await db.flush()

        await db.refresh(advertisement)

        submit_advertisement(advertisement.id, advertisement.title)

        return advertisement