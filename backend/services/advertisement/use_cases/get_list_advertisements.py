from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.advertisement import Advertisement, LikedAdvertisement
from models.user import User


class GetListAdvertisementsUseCase:
    async def get_list_advertisements(
        self,
        skip: int,
        limit: int,
        db: AsyncSession,
        current_user: Optional[User] = None,
        category_id: Optional[int] = None,
        subcategory_id: Optional[int] = None,
        urgent_only: bool = False,
    ) -> list[Advertisement]:

        stmt = select(Advertisement).where(Advertisement.is_active == True)
        if urgent_only:
            stmt = stmt.where(Advertisement.is_urgent == True)
        if category_id is not None:
            stmt = stmt.where(Advertisement.category_id == category_id)
        if subcategory_id is not None:
            stmt = stmt.where(Advertisement.subcategory_id == subcategory_id)
        stmt = stmt.order_by(Advertisement.id.desc()).offset(skip).limit(limit)

        result = await db.execute(stmt)
        advertisements = list(result.scalars().all())

        if current_user and advertisements:
            ids = [ad.id for ad in advertisements]
            liked_result = await db.execute(
                select(LikedAdvertisement.advertisement_id).where(
                    LikedAdvertisement.user_id == current_user.id,
                    LikedAdvertisement.advertisement_id.in_(ids),
                )
            )
            liked_ids = set(liked_result.scalars().all())
            for ad in advertisements:
                ad.is_liked = ad.id in liked_ids
        else:
            for ad in advertisements:
                ad.is_liked = False

        return advertisements

    async def get_my_advertisements(
        self,
        skip: int,
        limit: int,
        db: AsyncSession,
        current_user: User,
    ) -> list[Advertisement]:
        result = await db.execute(
            select(Advertisement)
            .where(Advertisement.owner_id == current_user.id)
            .order_by(Advertisement.id.desc())
            .offset(skip)
            .limit(limit)
        )
        advertisements = list(result.scalars().all())

        if advertisements:
            ids = [ad.id for ad in advertisements]
            liked_result = await db.execute(
                select(LikedAdvertisement.advertisement_id).where(
                    LikedAdvertisement.user_id == current_user.id,
                    LikedAdvertisement.advertisement_id.in_(ids),
                )
            )
            liked_ids = set(liked_result.scalars().all())
            for ad in advertisements:
                ad.is_liked = ad.id in liked_ids

        return advertisements

    async def get_my_liked_advertisements(
        self,
        skip: int,
        limit: int,
        db: AsyncSession,
        current_user: User,
    ) -> list[Advertisement]:
        result = await db.execute(
            select(Advertisement)
            .join(LikedAdvertisement, LikedAdvertisement.advertisement_id == Advertisement.id)
            .where(LikedAdvertisement.user_id == current_user.id)
            .order_by(Advertisement.id.desc())
            .offset(skip)
            .limit(limit)
        )
        advertisements = list(result.scalars().all())
        for ad in advertisements:
            ad.is_liked = True

        return advertisements
