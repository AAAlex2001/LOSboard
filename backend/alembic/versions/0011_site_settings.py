"""site settings (brand, about, socials)

Revision ID: 0011_site_settings
Revises: 0010_seed_contacts_pricing
Create Date: 2026-06-04 15:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0011_site_settings"
down_revision: Union[str, None] = "0010_seed_contacts_pricing"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


DEFAULTS = {
    "id": 1,
    "brand_title": "Land of Soul Abkhazia",
    "brand_subtitle": "Доска объявлений Республики Абхазия",
    "about_title": "О сервисе",
    "about_text": (
        "Наша доска объявлений — это быстрый способ продать, купить или "
        "обменять. Простое размещение, актуальные предложения и удобный "
        "поиск для Вас!"
    ),
    "socials_title": "Land of Soul в социальных сетях",
    "telegram_url": "",
    "instagram_url": "",
    "facebook_url": "",
    "copyright_line": "Land of soul Abkhazia. Все права защищены. Дизайн: @Amosssik",
}


def upgrade() -> None:
    op.create_table(
        "site_settings",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("brand_title", sa.String(), nullable=False, server_default=""),
        sa.Column("brand_subtitle", sa.String(), nullable=False, server_default=""),
        sa.Column("about_title", sa.String(), nullable=False, server_default=""),
        sa.Column("about_text", sa.String(), nullable=False, server_default=""),
        sa.Column("socials_title", sa.String(), nullable=False, server_default=""),
        sa.Column("telegram_url", sa.String(), nullable=True),
        sa.Column("instagram_url", sa.String(), nullable=True),
        sa.Column("facebook_url", sa.String(), nullable=True),
        sa.Column("copyright_line", sa.String(), nullable=False, server_default=""),
    )

    table = sa.table(
        "site_settings",
        *(sa.column(name) for name in DEFAULTS),
    )
    op.bulk_insert(table, [DEFAULTS])


def downgrade() -> None:
    op.drop_table("site_settings")
