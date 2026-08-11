"""Поля восстановления пароля у пользователей

Revision ID: 0051_password_reset
Revises: 0050_email_verification
Create Date: 2026-08-10 01:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0051_password_reset"
down_revision: Union[str, None] = "0050_email_verification"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Добавить поля кода восстановления пароля."""
    op.add_column(
        "users",
        sa.Column("password_reset_code_hash", sa.String(), nullable=True),
    )
    op.add_column(
        "users",
        sa.Column("password_reset_expires_at", sa.DateTime(), nullable=True),
    )
    op.add_column(
        "users",
        sa.Column("password_reset_sent_at", sa.DateTime(), nullable=True),
    )


def downgrade() -> None:
    """Убрать поля кода восстановления пароля."""
    op.drop_column("users", "password_reset_sent_at")
    op.drop_column("users", "password_reset_expires_at")
    op.drop_column("users", "password_reset_code_hash")
