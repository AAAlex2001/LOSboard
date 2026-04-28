from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.advertisement import Advertisement
from models.user import User
from fastapi import HTTPException


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