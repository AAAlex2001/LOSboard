"""Поля подтверждения email у пользователей

Revision ID: 0050_email_verification
Revises: 0052_optional_location_phone
Create Date: 2026-08-10 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0050_email_verification"
down_revision: Union[str, None] = "0052_optional_location_phone"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Добавить поля подтверждения email; существующих пользователей считать подтверждёнными."""
    op.add_column(
        "users",
        sa.Column(
            "email_verified",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )
    op.add_column(
        "users",
        sa.Column("email_verification_code_hash", sa.String(), nullable=True),
    )
    op.add_column(
        "users",
        sa.Column("email_verification_expires_at", sa.DateTime(), nullable=True),
    )
    op.add_column(
        "users",
        sa.Column("email_verification_sent_at", sa.DateTime(), nullable=True),
    )
    # Уже зарегистрированные аккаунты не должны блокироваться подтверждением.
    op.execute("UPDATE users SET email_verified = true")


def downgrade() -> None:
    """Убрать поля подтверждения email."""
    op.drop_column("users", "email_verification_sent_at")
    op.drop_column("users", "email_verification_expires_at")
    op.drop_column("users", "email_verification_code_hash")
    op.drop_column("users", "email_verified")
