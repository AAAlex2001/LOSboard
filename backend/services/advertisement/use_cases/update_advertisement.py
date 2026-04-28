from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.advertisement import Advertisement
from models.user import User
from fastapi import HTTPException
from schemas.advertisement import AdvertisementUpdate


class UpdateAdvertisementUseCase:

    async def update_advertisement(
        self,
        advertisement_id: int,
        request: AdvertisementUpdate,
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

        update_data = request.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(advertisement, field, value)

        await db.flush()
        await db.refresh(advertisement)

        return advertisement