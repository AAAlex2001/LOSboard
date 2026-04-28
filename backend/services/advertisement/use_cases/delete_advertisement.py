from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.advertisement import Advertisement
from models.user import User
from fastapi import HTTPException


class DeleteAdvertisementUseCase:

    async def delete_advertisement(
        self,
        advertisement_id: int,
        db: AsyncSession,
        current_user: User,
    ) -> None:

        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")

        result = await db.execute(
            select(Advertisement).where(Advertisement.id == advertisement_id)
        )

        advertisement = result.scalar_one_or_none()

        if advertisement is None:
            raise HTTPException(status_code=404, detail="Advertisement not found")

        if advertisement.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Forbidden: You do not have permission to delete this advertisement")

        await db.delete(advertisement)
        await db.flush()