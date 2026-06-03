"""admin roles, moderation, complaints

Revision ID: 0007_admin_moderation
Revises: 0006_add_user_is_admin
Create Date: 2026-05-22 00:00:02.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0007_admin_moderation"
down_revision: Union[str, None] = "0006_add_user_is_admin"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("role", sa.String(), nullable=False, server_default="user"),
    )
    op.add_column("users", sa.Column("banned_until", sa.DateTime(), nullable=True))
    op.add_column(
        "users",
        sa.Column(
            "created_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("now()"),
        ),
    )
    op.execute("UPDATE users SET role = 'admin' WHERE is_admin = true")
    op.drop_column("users", "is_admin")

    op.add_column(
        "advertisements",
        sa.Column(
            "moderation_status",
            sa.String(),
            nullable=False,
            server_default="pending",
        ),
    )
    op.add_column(
        "advertisements", sa.Column("moderation_reason", sa.String(), nullable=True)
    )
    op.add_column(
        "advertisements", sa.Column("moderated_at", sa.DateTime(), nullable=True)
    )
    op.add_column(
        "advertisements",
        sa.Column(
            "moderated_by_id",
            sa.Integer(),
            sa.ForeignKey("users.id"),
            nullable=True,
        ),
    )
    op.create_index(
        "ix_advertisements_moderation_status",
        "advertisements",
        ["moderation_status"],
    )
    op.execute("UPDATE advertisements SET moderation_status = 'approved'")

    op.create_table(
        "complaints",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column(
            "advertisement_id",
            sa.Integer(),
            sa.ForeignKey("advertisements.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "reporter_id",
            sa.Integer(),
            sa.ForeignKey("users.id"),
            nullable=False,
        ),
        sa.Column("reason", sa.String(), nullable=False),
        sa.Column("comment", sa.String(), nullable=True),
        sa.Column(
            "status", sa.String(), nullable=False, server_default="open"
        ),
        sa.Column(
            "created_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column("resolved_at", sa.DateTime(), nullable=True),
        sa.Column(
            "resolved_by_id",
            sa.Integer(),
            sa.ForeignKey("users.id"),
            nullable=True,
        ),
    )
    op.create_index(
        "ix_complaints_status_created", "complaints", ["status", "created_at"]
    )


def downgrade() -> None:
    op.drop_index("ix_complaints_status_created", table_name="complaints")
    op.drop_table("complaints")

    op.drop_index("ix_advertisements_moderation_status", table_name="advertisements")
    op.drop_column("advertisements", "moderated_by_id")
    op.drop_column("advertisements", "moderated_at")
    op.drop_column("advertisements", "moderation_reason")
    op.drop_column("advertisements", "moderation_status")

    op.add_column(
        "users",
        sa.Column(
            "is_admin",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )
    op.execute("UPDATE users SET is_admin = true WHERE role = 'admin'")
    op.drop_column("users", "created_at")
    op.drop_column("users", "banned_until")
    op.drop_column("users", "role")
