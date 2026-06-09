"""Soft-delete advertisements via deleted_at

Revision ID: 0039_advertisements_deleted_at
Revises: 0038_restore_contacts_single
Create Date: 2026-06-09 12:30:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0039_advertisements_deleted_at"
down_revision: Union[str, None] = "0038_restore_contacts_single"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "advertisements",
        sa.Column("deleted_at", sa.DateTime(), nullable=True),
    )
    op.create_index(
        "ix_advertisements_deleted_at",
        "advertisements",
        ["deleted_at"],
    )


def downgrade() -> None:
    op.drop_index("ix_advertisements_deleted_at", table_name="advertisements")
    op.drop_column("advertisements", "deleted_at")
