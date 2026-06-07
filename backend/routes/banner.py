from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.banner import Banner
from schemas.banner import BannerResponse


router = APIRouter(prefix="/banners", tags=["banners"])


@router.get("/", response_model=list[BannerResponse])
async def get_active_banners(
    placement: Optional[str] = Query(
        None,
        description="Фильтр по месту размещения: 'main_top' или 'sidebar'.",
    ),
    db: AsyncSession = Depends(get_db),
) -> list[Banner]:
    """Активные баннеры в порядке `sort_order`.

    Поля `starts_at` / `ends_at` хранятся для админа, но не фильтруют выдачу:
    показ контролирует тогл «Показывать на сайте». Если позже потребуется
    автоматическое расписание — добавим cron/scheduler.

    Параметр `placement` опционален. Если задан — выдаются только баннеры
    с этим размещением; иначе возвращаются все активные баннеры (обратная
    совместимость со старыми клиентами).
    """
    stmt = select(Banner).where(Banner.is_active.is_(True))
    if placement is not None:
        stmt = stmt.where(Banner.placement == placement)
    stmt = stmt.order_by(Banner.sort_order.asc(), Banner.id.asc())
    result = await db.execute(stmt)
    return list(result.scalars().all())
