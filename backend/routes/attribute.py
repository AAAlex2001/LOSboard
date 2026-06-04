from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.attribute import Attribute
from schemas.attribute import AttributeResponse


router = APIRouter(prefix="/attributes", tags=["attributes"])


@router.get("/", response_model=list[AttributeResponse])
async def get_attributes(
    category_id: Optional[int] = Query(None),
    subcategory_id: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """Атрибуты для (под)категории: глобальные + по категории + по подкатегории.

    Логика: возвращаем все атрибуты у которых scope матчится — то есть
    либо без category_id/subcategory_id (глобальные), либо category_id совпадает,
    либо subcategory_id совпадает.
    """
    conditions = [
        (Attribute.category_id.is_(None) & Attribute.subcategory_id.is_(None)),
    ]
    if category_id is not None:
        conditions.append(Attribute.category_id == category_id)
    if subcategory_id is not None:
        conditions.append(Attribute.subcategory_id == subcategory_id)

    result = await db.execute(
        select(Attribute)
        .where(or_(*conditions))
        .order_by(Attribute.sort_order.asc(), Attribute.id.asc())
    )
    return result.scalars().all()
