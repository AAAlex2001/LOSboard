"""add user admin flag

Revision ID: 0006_add_user_is_admin
Revises: 0005_add_urgent_advertisements
Create Date: 2026-05-22 00:00:01.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0006_add_user_is_admin"
down_revision: Union[str, None] = "0005_add_urgent_advertisements"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("is_admin", sa.Boolean(), nullable=False, server_default=sa.false()),
    )


def downgrade() -> None:
    op.drop_column("users", "is_admin")
