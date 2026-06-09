from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.advertisement import Advertisement
from schemas.advertisement import AdvertisementSitemapItem


class GetSitemapAdsUseCase:
    async def list_ids(
        self,
        db: AsyncSession,
        limit: int = 50000,
    ) -> list[AdvertisementSitemapItem]:
        result = await db.execute(
            select(
                Advertisement.id,
                Advertisement.title,
                Advertisement.created_at,
            )
            .where(
                Advertisement.is_active == True,  # noqa: E712
                Advertisement.deleted_at.is_(None),
            )
            .order_by(Advertisement.id.desc())
            .limit(limit)
        )
        return [
            AdvertisementSitemapItem(
                id=row.id, title=row.title, created_at=row.created_at
            )
            for row in result.all()
        ]
