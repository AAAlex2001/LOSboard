from fastapi import HTTPException
from models.advertisement import Advertisement
from models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select


class LikeAdvertisementUseCase:

    async def like_advertisement(
        self,
        advertisement_id: int,
        db: AsyncSession,
        current_user: User,
    ) -> Advertisement:

        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        advertisement_result = await db.execute(
            select(Advertisement).where(Advertisement.id == advertisement_id)
        )

        advertisement = advertisement_result.scalar_one_or_none()

        if not advertisement:
            raise HTTPException(status_code=404, detail="Advertisement not found")

        advertisement.is_liked = True
        await db.commit()
        await db.refresh(advertisement)

        return advertisement