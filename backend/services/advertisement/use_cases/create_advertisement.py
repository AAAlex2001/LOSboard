from fastapi import HTTPException
from models.advertisement import Advertisement
from models.user import User
from schemas.advertisement import AdvertisementCreate
from sqlalchemy.ext.asyncio import AsyncSession


class CreateAdvertisementUseCase:

    async def create_advertisement(
        self,
        request: AdvertisementCreate,
        db: AsyncSession,
        current_user: User,
    ) -> Advertisement:

        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")

        new_advertisement = Advertisement(
            title=request.title,
            description=request.description,
            price=request.price,
            category=request.category,
            subcategory=request.subcategory,
            location=request.location,
            photo_url=request.photo_url,
            is_active=request.is_active,
            owner_id=current_user.id,
        )

        db.add(new_advertisement)
        await db.flush()
        await db.refresh(new_advertisement)
        return new_advertisement