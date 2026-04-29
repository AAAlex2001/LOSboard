from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.advertisement import Advertisement
from models.user import User
from fastapi import HTTPException
from .like_advertisement import LikeAdvertisementUseCase


class GetListAdvertisementsUseCase:
    async def get_list_advertisements(
        self,
        skip: int,
        limit: int,
        db: AsyncSession,
        current_user: User,
    ) -> list[Advertisement]:

        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")

        result = await db.execute(
            select(Advertisement).offset(skip).limit(limit)
        )
        advertisements = result.scalars().all()

        return advertisements
    

    async def get_my_advertisements(
        self,
        skip: int,
        limit: int,
        db: AsyncSession,
        current_user: User,
    ) -> list[Advertisement]:

        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")

        result = await db.execute(
            select(Advertisement).where(Advertisement.owner_id == current_user.id).offset(skip).limit(limit)
        )
        advertisements = result.scalars().all()

        like_use_case = LikeAdvertisementUseCase()
        for advertisement in advertisements:
            if advertisement.is_liked:
                await like_use_case.like_advertisement(
                    advertisement_id=advertisement.id,
                    db=db,
                    current_user=current_user,
                )

        return advertisements