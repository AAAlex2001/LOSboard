"""make banner image_url nullable

Revision ID: 0027_banner_image_nullable
Revises: 0026_banner_video_url
Create Date: 2026-06-08 02:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0027_banner_image_nullable"
down_revision: Union[str, None] = "0026_banner_video_url"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column("banners", "image_url", existing_type=sa.String(), nullable=True)


def downgrade() -> None:
    op.alter_column("banners", "image_url", existing_type=sa.String(), nullable=False)
