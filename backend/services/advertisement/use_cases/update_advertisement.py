from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.advertisement import Advertisement
from models.user import User
from fastapi import HTTPException


class UpdateAdvertisementUseCase:

    async def update_advertisement(
        self,
        advertisement_id: int,
        request: Advertisement,
        db: AsyncSession,
        current_user: User,
    ) -> Advertisement:

        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")

        result = await db.execute(
            select(Advertisement).where(Advertisement.id == advertisement_id)
        )

        advertisement = result.scalar_one_or_none()

        if advertisement is None:
            raise HTTPException(status_code=404, detail="Advertisement not found")

        if advertisement.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Forbidden: You do not have permission to update this advertisement")

        advertisement.title = request.title
        advertisement.description = request.description
        advertisement.price = request.price
        advertisement.category = request.category
        advertisement.subcategory = request.subcategory
        advertisement.location = request.location
        advertisement.photo_url = request.photo_url
        advertisement.is_active = request.is_active

        await db.flush()
        await db.refresh(advertisement)

        return advertisement