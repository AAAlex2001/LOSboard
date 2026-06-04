"""ad placeholder labels in site settings

Revision ID: 0012_ad_labels
Revises: 0011_site_settings
Create Date: 2026-06-04 16:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0012_ad_labels"
down_revision: Union[str, None] = "0011_site_settings"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "site_settings",
        sa.Column(
            "ad_age_label",
            sa.String(),
            nullable=False,
            server_default="Реклама 0+",
        ),
    )
    op.add_column(
        "site_settings",
        sa.Column(
            "ad_site_label",
            sa.String(),
            nullable=False,
            server_default="Ваш сайт",
        ),
    )
    op.add_column(
        "site_settings",
        sa.Column(
            "ad_placeholder_text",
            sa.String(),
            nullable=False,
            server_default="Рекламный баннер сдается",
        ),
    )


def downgrade() -> None:
    op.drop_column("site_settings", "ad_placeholder_text")
    op.drop_column("site_settings", "ad_site_label")
    op.drop_column("site_settings", "ad_age_label")
