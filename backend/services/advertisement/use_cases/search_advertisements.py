from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.advertisement import Advertisement


class SearchAdvertisementsUseCase:
    """Поиск активных объявлений по подстроке в названии или описании."""

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
            .where(Advertisement.is_active == True)  # noqa: E712
            .where(
                or_(
                    Advertisement.title.ilike(pattern),
                    Advertisement.description.ilike(pattern),
                )
            )
            .order_by(Advertisement.id.desc())
            .limit(limit)
        )

        result = await db.execute(stmt)
        return list(result.scalars().all())
