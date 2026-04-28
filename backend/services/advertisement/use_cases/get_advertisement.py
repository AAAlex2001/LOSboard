from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.advertisement import Advertisement
from models.user import User


class GetAdvertisementUseCase:

    async def get_advertisement(
        self,
        advertisement_id: int,
        db: AsyncSession,
        current_user: User,
    ) -> Advertisement:

        if current_user is None:
            raise HTTPException(status_code=401, detail="Not authenticated")

        result = await db.execute(
            select(Advertisement).where(Advertisement.id == advertisement_id)
        )

        advertisement = result.scalar_one_or_none()

        if advertisement is None:
            raise HTTPException(status_code=404, detail="Advertisement not found")

        return advertisement