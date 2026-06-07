"""добавить поле age_label в banners

Revision ID: 0028_banner_age_label
Revises: 0027_banner_image_nullable
Create Date: 2026-06-08 03:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0028_banner_age_label"
down_revision: Union[str, None] = "0027_banner_image_nullable"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "banners",
        sa.Column("age_label", sa.String(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("banners", "age_label")
