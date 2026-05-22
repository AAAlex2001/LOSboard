"""add urgent advertisements

Revision ID: 0005_add_urgent_advertisements
Revises: 0004_perf_indexes
Create Date: 2026-05-22 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0005_add_urgent_advertisements"
down_revision: Union[str, None] = "0004_perf_indexes"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "advertisements",
        sa.Column("is_urgent", sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.create_index(
        "ix_advertisements_is_urgent", "advertisements", ["is_urgent"]
    )


def downgrade() -> None:
    op.drop_index("ix_advertisements_is_urgent", table_name="advertisements")
    op.drop_column("advertisements", "is_urgent")
