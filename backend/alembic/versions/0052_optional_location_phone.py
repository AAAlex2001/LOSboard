"""Make advertisement location optional and add a per-ad contact phone.

Revision ID: 0052_optional_location_phone
Revises: 0051_reseed_mobile_app_ads
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0052_optional_location_phone"
down_revision: Union[str, None] = "0051_reseed_mobile_app_ads"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "advertisements", "location", existing_type=sa.String(), nullable=True
    )
    op.add_column(
        "advertisements", sa.Column("contact_phone", sa.String(32), nullable=True)
    )


def downgrade() -> None:
    op.execute(
        sa.text("UPDATE advertisements SET location = '' WHERE location IS NULL")
    )
    op.drop_column("advertisements", "contact_phone")
    op.alter_column(
        "advertisements", "location", existing_type=sa.String(), nullable=False
    )
