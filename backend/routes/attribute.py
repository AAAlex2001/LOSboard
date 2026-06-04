from typing import Any, Optional

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
) -> list[Attribute]:
    """Возвращает атрибуты, подходящие под scope (категория/подкатегория/глобально).

    Атрибут с пустыми category_id и subcategory_id — глобальный, виден всегда.
    Атрибут с category_id — виден всем подкатегориям этой категории.
    Атрибут с subcategory_id — виден только в этой подкатегории.
    """
    conditions: list[Any] = [
        Attribute.category_id.is_(None) & Attribute.subcategory_id.is_(None),
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
    return list(result.scalars().all())
