from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.banner import Banner
from schemas.banner import BannerResponse


router = APIRouter(prefix="/banners", tags=["banners"])


@router.get("/", response_model=list[BannerResponse])
async def get_active_banners(db: AsyncSession = Depends(get_db)) -> list[Banner]:
    """Активные баннеры в порядке `sort_order`.

    Поля `starts_at` / `ends_at` хранятся для админа, но не фильтруют выдачу:
    показ контролирует тогл «Показывать на сайте». Если позже потребуется
    автоматическое расписание — добавим cron/scheduler.
    """
    result = await db.execute(
        select(Banner)
        .where(Banner.is_active.is_(True))
        .order_by(Banner.sort_order.asc(), Banner.id.asc())
    )
    return list(result.scalars().all())
