"""add video_url field to banners

Revision ID: 0026_banner_video_url
Revises: 0025_pricing_tech_titles
Create Date: 2026-06-08 01:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0026_banner_video_url"
down_revision: Union[str, None] = "0025_pricing_tech_titles"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "banners",
        sa.Column("video_url", sa.String(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("banners", "video_url")
