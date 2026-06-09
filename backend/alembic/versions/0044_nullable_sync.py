"""Sync is_active NOT NULL for users, advertisements, categories

Revision ID: 0044_nullable_sync
Revises: 0043_contacts_sublabel
Create Date: 2026-06-09 16:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0044_nullable_sync"
down_revision: Union[str, None] = "0043_contacts_sublabel"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


TABLES = ("users", "advertisements", "categories")


def upgrade() -> None:
    for table in TABLES:
        op.execute(
            sa.text(f"UPDATE {table} SET is_active = true WHERE is_active IS NULL")
        )
        op.alter_column(
            table,
            "is_active",
            existing_type=sa.Boolean(),
            nullable=False,
            server_default=sa.true(),
        )


def downgrade() -> None:
    for table in TABLES:
        op.alter_column(
            table,
            "is_active",
            existing_type=sa.Boolean(),
            nullable=True,
            server_default=sa.true(),
        )
