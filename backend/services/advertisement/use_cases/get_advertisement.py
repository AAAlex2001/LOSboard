from typing import Optional

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.advertisement import Advertisement, LikedAdvertisement, ViewedAdvertisement
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

        # likes_count и views_count хранятся в самой таблице — отдаём как есть.
        # is_liked и is_viewed — только для авторизованного юзера.
        if current_user:
            liked = await db.execute(
                select(LikedAdvertisement.id).where(
                    LikedAdvertisement.user_id == current_user.id,
                    LikedAdvertisement.advertisement_id == advertisement_id,
                )
            )
            advertisement.is_liked = liked.scalar_one_or_none() is not None

            viewed = await db.execute(
                select(ViewedAdvertisement.id).where(
                    ViewedAdvertisement.user_id == current_user.id,
                    ViewedAdvertisement.advertisement_id == advertisement_id,
                )
            )
            advertisement.is_viewed = viewed.scalar_one_or_none() is not None
        else:
            advertisement.is_liked = False
            advertisement.is_viewed = False

        # seller info
        if advertisement.owner:
            advertisement.seller_name = advertisement.owner.name
            advertisement.seller_phone = advertisement.owner.phone_number
        else:
            advertisement.seller_name = None
            advertisement.seller_phone = None

        return advertisement
