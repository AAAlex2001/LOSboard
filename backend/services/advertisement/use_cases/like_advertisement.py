from fastapi import HTTPException
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from models.advertisement import Advertisement, LikedAdvertisement
from models.user import User


class LikeAdvertisementUseCase:
    """Toggle like for an advertisement by the current user."""

    async def toggle_like(
        self,
        advertisement_id: int,
        db: AsyncSession,
        current_user: User,
    ) -> Advertisement:
        ad_result = await db.execute(
            select(Advertisement).where(Advertisement.id == advertisement_id)
        )
        advertisement = ad_result.scalar_one_or_none()
        if not advertisement:
            raise HTTPException(status_code=404, detail="Advertisement not found")

        existing = await db.execute(
            select(LikedAdvertisement).where(
                LikedAdvertisement.user_id == current_user.id,
                LikedAdvertisement.advertisement_id == advertisement_id,
            )
        )
        liked = existing.scalar_one_or_none()

        if liked:
            await db.execute(
                delete(LikedAdvertisement).where(
                    LikedAdvertisement.user_id == current_user.id,
                    LikedAdvertisement.advertisement_id == advertisement_id,
                )
            )
            advertisement.is_liked = False
        else:
            db.add(
                LikedAdvertisement(
                    user_id=current_user.id,
                    advertisement_id=advertisement_id,
                )
            )
            advertisement.is_liked = True

        await db.commit()
        return advertisement
