from typing import Optional

from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.advertisement import Advertisement, LikedAdvertisement
from models.user import User


class GetAdvertisementUseCase:

    async def get_advertisement(
        self,
        advertisement_id: int,
        db: AsyncSession,
        current_user: Optional[User] = None,
    ) -> Advertisement:
        result = await db.execute(
            select(Advertisement)
            .options(selectinload(Advertisement.owner))
            .where(Advertisement.id == advertisement_id)
        )
        advertisement = result.scalar_one_or_none()

        if advertisement is None:
            raise HTTPException(status_code=404, detail="Advertisement not found")

        # likes count
        likes_result = await db.execute(
            select(func.count(LikedAdvertisement.id)).where(
                LikedAdvertisement.advertisement_id == advertisement_id
            )
        )
        advertisement.likes_count = int(likes_result.scalar() or 0)

        # is_liked для текущего юзера
        if current_user:
            liked = await db.execute(
                select(LikedAdvertisement).where(
                    LikedAdvertisement.user_id == current_user.id,
                    LikedAdvertisement.advertisement_id == advertisement_id,
                )
            )
            advertisement.is_liked = liked.scalar_one_or_none() is not None
        else:
            advertisement.is_liked = False

        # seller info
        if advertisement.owner:
            advertisement.seller_name = advertisement.owner.name
            advertisement.seller_phone = advertisement.owner.phone_number
        else:
            advertisement.seller_name = None
            advertisement.seller_phone = None

        return advertisement
