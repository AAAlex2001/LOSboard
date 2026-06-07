"""rename pricing tech accordion titles

Revision ID: 0025_pricing_tech_titles
Revises: 0024_banner_placement
Create Date: 2026-06-08 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0025_pricing_tech_titles"
down_revision: Union[str, None] = "0024_banner_placement"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


NEW_TITLES = [
    ("pricing-tech-board", "Реклама на сайте LOS"),
    ("pricing-tech-social", "Реклама в соцсетях LOS"),
    ("pricing-tech-mobile", "Реклама в мобильном приложении LOS"),
    ("pricing-tech-tour", "Реклама на сайте Тур-гид LOS"),
]

OLD_TITLES = [
    ("pricing-tech-board", "Реклама на сайте LOS — характеристики"),
    ("pricing-tech-social", "Реклама в соцсетях LOS — характеристики"),
    ("pricing-tech-mobile", "Реклама в мобильном приложении LOS — характеристики"),
    ("pricing-tech-tour", "Реклама на сайте Тур-гид LOS — характеристики"),
]


def upgrade() -> None:
    conn = op.get_bind()
    for slug, title in NEW_TITLES:
        conn.execute(
            sa.text("UPDATE content_pages SET title = :title WHERE slug = :slug"),
            {"title": title, "slug": slug},
        )


def downgrade() -> None:
    conn = op.get_bind()
    for slug, title in OLD_TITLES:
        conn.execute(
            sa.text("UPDATE content_pages SET title = :title WHERE slug = :slug"),
            {"title": title, "slug": slug},
        )
