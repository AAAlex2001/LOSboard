"""Add «Транспорт» category with subcategories

Revision ID: 0036_add_transport_category
Revises: 0035_split_contacts_blocks
Create Date: 2026-06-09 11:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0036_add_transport_category"
down_revision: Union[str, None] = "0035_split_contacts_blocks"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


CATEGORY_NAME = "Транспорт"
CATEGORY_SLUG = "transport"

SUBCATEGORIES = [
    "Легковые автомобили",
    "Грузовые автомобили",
    "Скутеры и электросамокаты",
    "Мотоциклы и мототехника",
    "Автобусы, микроавтобусы",
    "Сельхозтехника",
    "Авиационный транспорт",
    "Спецтехника",
    "Водный транспорт",
    "Другие виды транспорта",
]


def slugify_name(name: str, category_slug: str, index: int) -> str:
    base = name.lower().replace(" ", "-").replace(",", "").replace("/", "-")
    return f"{category_slug}-{index}-{base}"[:90]


def upgrade() -> None:
    conn = op.get_bind()

    existing = conn.execute(
        sa.text("SELECT id FROM categories WHERE slug = :slug"),
        {"slug": CATEGORY_SLUG},
    ).first()
    if existing:
        return

    max_order = conn.execute(
        sa.text("SELECT COALESCE(MAX(sort_order), -1) FROM categories")
    ).scalar() or -1
    next_order = max_order + 1

    inserted = conn.execute(
        sa.text(
            "INSERT INTO categories (name, slug, sort_order, is_active) "
            "VALUES (:name, :slug, :sort_order, true) "
            "RETURNING id"
        ),
        {"name": CATEGORY_NAME, "slug": CATEGORY_SLUG, "sort_order": next_order},
    )
    category_id = inserted.scalar_one()

    rows = [
        {
            "name": name,
            "slug": slugify_name(name, CATEGORY_SLUG, idx),
            "sort_order": idx,
            "is_active": True,
            "category_id": category_id,
        }
        for idx, name in enumerate(SUBCATEGORIES)
    ]
    conn.execute(
        sa.text(
            "INSERT INTO subcategories (name, slug, sort_order, is_active, category_id) "
            "VALUES (:name, :slug, :sort_order, :is_active, :category_id)"
        ),
        rows,
    )


def downgrade() -> None:
    conn = op.get_bind()
    conn.execute(
        sa.text(
            "DELETE FROM subcategories "
            "WHERE category_id IN (SELECT id FROM categories WHERE slug = :slug)"
        ),
        {"slug": CATEGORY_SLUG},
    )
    conn.execute(
        sa.text("DELETE FROM categories WHERE slug = :slug"),
        {"slug": CATEGORY_SLUG},
    )
