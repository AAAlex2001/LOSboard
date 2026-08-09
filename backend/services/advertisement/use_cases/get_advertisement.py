from typing import Optional

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.advertisement import (
    Advertisement,
    LikedAdvertisement,
    MODERATION_APPROVED,
    ViewedAdvertisement,
)
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
            raise HTTPException(status_code=404, detail="Объявление не найдено")

        if advertisement.moderation_status != MODERATION_APPROVED:
            is_owner = current_user is not None and current_user.id == advertisement.owner_id
            is_staff = current_user is not None and current_user.is_staff
            if not (is_owner or is_staff):
                raise HTTPException(status_code=404, detail="Объявление не найдено")

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

        if advertisement.owner:
            advertisement.seller_name = advertisement.owner.name
            is_owner = (
                current_user is not None
                and current_user.id == advertisement.owner_id
            )
            is_staff = current_user is not None and current_user.is_staff
            advertisement.seller_phone = (
                advertisement.contact_phone or advertisement.owner.phone_number
                if current_user is not None
                else None
            )
        else:
            advertisement.seller_name = None
            advertisement.seller_phone = None

        return advertisement
