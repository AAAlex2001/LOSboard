from typing import Any, List, Sequence

from fastapi import HTTPException
from sqlalchemy import delete, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.attribute import (
    ATTRIBUTE_KIND_BOOLEAN,
    ATTRIBUTE_KIND_NUMBER,
    ATTRIBUTE_KIND_SELECT,
    AdvertisementAttributeValue,
    Attribute,
)
from schemas.attribute import AdvertisementAttributeValuePayload


async def get_scope_attributes(
    db: AsyncSession,
    category_id: int,
    subcategory_id: int,
) -> List[Attribute]:
    result = await db.execute(
        select(Attribute).where(
            or_(
                (Attribute.category_id.is_(None) & Attribute.subcategory_id.is_(None)),
                Attribute.category_id == category_id,
                Attribute.subcategory_id == subcategory_id,
            )
        )
    )
    return list(result.scalars().all())


def validate_attribute_value(attr: Attribute, value: str) -> str:
    value = value.strip()
    if not value:
        raise HTTPException(
            status_code=400,
            detail=f"Поле «{attr.name}» не должно быть пустым",
        )
    if attr.kind == ATTRIBUTE_KIND_NUMBER:
        try:
            float(value.replace(",", "."))
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Поле «{attr.name}» должно быть числом",
            )
    elif attr.kind == ATTRIBUTE_KIND_SELECT:
        options: list[Any] = list(attr.options or [])
        if value not in options:
            raise HTTPException(
                status_code=400,
                detail=f"Недопустимое значение для поля «{attr.name}»",
            )
    elif attr.kind == ATTRIBUTE_KIND_BOOLEAN:
        if value.lower() not in ("true", "false", "1", "0", "да", "нет"):
            raise HTTPException(
                status_code=400,
                detail=f"Поле «{attr.name}» должно быть «да» или «нет»",
            )
    return value


def validate_required_attrs(
    attrs: Sequence[Attribute],
    payload: Sequence[AdvertisementAttributeValuePayload],
) -> None:
    provided_ids = {p.attribute_id for p in payload}
    for attr in attrs:
        if attr.is_required and attr.id not in provided_ids:
            raise HTTPException(
                status_code=400,
                detail=f"Поле «{attr.name}» обязательно к заполнению",
            )


async def replace_attribute_values(
    db: AsyncSession,
    advertisement_id: int,
    category_id: int,
    subcategory_id: int,
    payload: Sequence[AdvertisementAttributeValuePayload],
) -> None:
    attrs = await get_scope_attributes(db, category_id, subcategory_id)
    by_id: dict[int, Attribute] = {int(a.id): a for a in attrs}

    validate_required_attrs(attrs, payload)

    await db.execute(
        delete(AdvertisementAttributeValue).where(
            AdvertisementAttributeValue.advertisement_id == advertisement_id
        )
    )

    for item in payload:
        attr = by_id.get(item.attribute_id)
        if not attr:
            raise HTTPException(
                status_code=400,
                detail="Атрибут не относится к выбранной категории",
            )
        clean = validate_attribute_value(attr, item.value)
        db.add(
            AdvertisementAttributeValue(
                advertisement_id=advertisement_id,
                attribute_id=attr.id,
                value=clean,
            )
        )
