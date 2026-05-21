"""initial schema

Revision ID: 0001_initial_schema
Revises:
Create Date: 2026-05-21 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "0001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("password", sa.String(), nullable=False),
        sa.Column("phone_number", sa.String(), nullable=True),
        sa.Column("avatar_url", sa.String(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=True, server_default=sa.true()),
    )
    op.create_index("ix_users_id", "users", ["id"])
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "categories",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False, unique=True),
        sa.Column("slug", sa.String(), nullable=False, unique=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=True, server_default=sa.true()),
    )
    op.create_index("ix_categories_id", "categories", ["id"])

    op.create_table(
        "subcategories",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("slug", sa.String(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=True, server_default=sa.true()),
        sa.Column("category_id", sa.Integer(), sa.ForeignKey("categories.id"), nullable=False),
    )
    op.create_index("ix_subcategories_id", "subcategories", ["id"])

    op.create_table(
        "advertisements",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("description", sa.String(), nullable=True),
        sa.Column("price", sa.Integer(), nullable=False),
        sa.Column("location", sa.String(), nullable=False),
        sa.Column(
            "photo_urls",
            postgresql.ARRAY(sa.String()),
            nullable=False,
            server_default="{}",
        ),
        sa.Column("is_active", sa.Boolean(), nullable=True, server_default=sa.true()),
        sa.Column(
            "created_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column("likes_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("views_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("owner_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("category_id", sa.Integer(), sa.ForeignKey("categories.id"), nullable=False),
        sa.Column("subcategory_id", sa.Integer(), sa.ForeignKey("subcategories.id"), nullable=False),
    )
    op.create_index("ix_advertisements_id", "advertisements", ["id"])

    op.create_table(
        "liked_advertisements",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column(
            "advertisement_id",
            sa.Integer(),
            sa.ForeignKey("advertisements.id"),
            nullable=False,
        ),
        sa.UniqueConstraint("user_id", "advertisement_id", name="uix_user_advertisement"),
    )
    op.create_index("ix_liked_advertisements_id", "liked_advertisements", ["id"])

    op.create_table(
        "viewed_advertisements",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column(
            "advertisement_id",
            sa.Integer(),
            sa.ForeignKey("advertisements.id"),
            nullable=False,
        ),
        sa.Column(
            "viewed_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.UniqueConstraint(
            "user_id", "advertisement_id", name="uix_user_viewed_advertisement"
        ),
    )
    op.create_index("ix_viewed_advertisements_id", "viewed_advertisements", ["id"])

    op.create_table(
        "conversations",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "advertisement_id",
            sa.Integer(),
            sa.ForeignKey("advertisements.id"),
            nullable=False,
        ),
        sa.Column("buyer_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("seller_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column(
            "last_message_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.UniqueConstraint("advertisement_id", "buyer_id", name="uix_conversation_ad_buyer"),
    )
    op.create_index("ix_conversations_id", "conversations", ["id"])
    op.create_index(
        "ix_conversations_buyer_last", "conversations", ["buyer_id", "last_message_at"]
    )
    op.create_index(
        "ix_conversations_seller_last",
        "conversations",
        ["seller_id", "last_message_at"],
    )

    op.create_table(
        "messages",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "conversation_id",
            sa.Integer(),
            sa.ForeignKey("conversations.id"),
            nullable=False,
        ),
        sa.Column("sender_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("text", sa.String(), nullable=False, server_default=""),
        sa.Column(
            "created_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column("is_read", sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.create_index("ix_messages_id", "messages", ["id"])
    op.create_index(
        "ix_messages_conversation_created",
        "messages",
        ["conversation_id", "created_at"],
    )

    op.create_table(
        "message_attachments",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "message_id",
            sa.Integer(),
            sa.ForeignKey("messages.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("url", sa.String(), nullable=False),
        sa.Column("filename", sa.String(), nullable=False),
        sa.Column("kind", sa.String(), nullable=False),
        sa.Column("mime_type", sa.String(), nullable=False),
        sa.Column("size_bytes", sa.Integer(), nullable=False),
    )
    op.create_index("ix_message_attachments_id", "message_attachments", ["id"])
    op.create_index(
        "ix_message_attachments_message", "message_attachments", ["message_id"]
    )


def downgrade() -> None:
    op.drop_table("message_attachments")
    op.drop_table("messages")
    op.drop_table("conversations")
    op.drop_table("viewed_advertisements")
    op.drop_table("liked_advertisements")
    op.drop_table("advertisements")
    op.drop_table("subcategories")
    op.drop_table("categories")
    op.drop_table("users")
