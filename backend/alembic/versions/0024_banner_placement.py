"""добавить поле placement в banners

Revision ID: 0024_banner_placement
Revises: 0023_pricing_tech_tour_real
Create Date: 2026-06-07 23:30:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0024_banner_placement"
down_revision: Union[str, None] = "0023_pricing_tech_tour_real"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "banners",
        sa.Column("placement", sa.String(), nullable=False, server_default="main_top"),
    )
    op.create_index(
        "ix_banners_placement", "banners", ["placement"], unique=False
    )


def downgrade() -> None:
    op.drop_index("ix_banners_placement", table_name="banners")
    op.drop_column("banners", "placement")
