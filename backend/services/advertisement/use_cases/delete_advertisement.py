from datetime import datetime

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
            raise HTTPException(status_code=401, detail="Требуется авторизация")

        result = await db.execute(
            select(Advertisement).where(Advertisement.id == advertisement_id)
        )

        advertisement = result.scalar_one_or_none()

        if advertisement is None:
            raise HTTPException(status_code=404, detail="Объявление не найдено")

        if advertisement.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Нельзя удалить чужое объявление")

        if advertisement.deleted_at is not None:
            raise HTTPException(status_code=404, detail="Объявление уже удалено")

        advertisement.is_active = False
        advertisement.deleted_at = datetime.utcnow()
        await db.flush()
