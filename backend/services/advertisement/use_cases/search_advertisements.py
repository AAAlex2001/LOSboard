from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.advertisement import Advertisement, MODERATION_APPROVED


class SearchAdvertisementsUseCase:
    """Поиск активных объявлений по подстроке в названии."""

    async def search(
        self,
        q: str,
        limit: int,
        db: AsyncSession,
    ) -> list[Advertisement]:
        query = q.strip()
        if not query:
            return []

        pattern = f"%{query}%"
        stmt = (
            select(Advertisement)
            .where(Advertisement.is_active.is_(True))
            .where(Advertisement.moderation_status == MODERATION_APPROVED)
            .where(Advertisement.deleted_at.is_(None))
            .where(Advertisement.title.ilike(pattern))
            .order_by(Advertisement.id.desc())
            .limit(limit)
        )

        result = await db.execute(stmt)
        return list(result.scalars().all())
