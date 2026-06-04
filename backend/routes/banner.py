from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy import and_, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.banner import Banner
from schemas.banner import BannerResponse


router = APIRouter(prefix="/banners", tags=["banners"])


@router.get("/", response_model=list[BannerResponse])
async def get_active_banners(db: AsyncSession = Depends(get_db)):
    now = datetime.utcnow()
    result = await db.execute(
        select(Banner)
        .where(
            Banner.is_active == True,
            or_(Banner.starts_at.is_(None), Banner.starts_at <= now),
            or_(Banner.ends_at.is_(None), Banner.ends_at >= now),
        )
        .order_by(Banner.sort_order.asc(), Banner.id.asc())
    )
    return result.scalars().all()
