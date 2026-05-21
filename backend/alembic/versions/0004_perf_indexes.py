"""add foreign-key + search performance indexes

Revision ID: 0004_perf_indexes
Revises: 0003_user_token_version
Create Date: 2026-05-21 00:00:03.000000

"""
from typing import Sequence, Union

from alembic import op


revision: str = "0004_perf_indexes"
down_revision: Union[str, None] = "0003_user_token_version"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_index(
        "ix_advertisements_owner_id", "advertisements", ["owner_id"]
    )
    op.create_index(
        "ix_advertisements_category_id", "advertisements", ["category_id"]
    )
    op.create_index(
        "ix_advertisements_subcategory_id", "advertisements", ["subcategory_id"]
    )

    op.create_index(
        "ix_subcategories_category_id", "subcategories", ["category_id"]
    )

    op.create_index(
        "ix_liked_advertisements_advertisement_id",
        "liked_advertisements",
        ["advertisement_id"],
    )
    op.create_index(
        "ix_viewed_advertisements_advertisement_id",
        "viewed_advertisements",
        ["advertisement_id"],
    )

    op.create_index(
        "ix_conversations_advertisement_id",
        "conversations",
        ["advertisement_id"],
    )
    op.create_index(
        "ix_messages_sender_id", "messages", ["sender_id"]
    )

    op.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm")
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_advertisements_title_trgm "
        "ON advertisements USING GIN (title gin_trgm_ops)"
    )


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_advertisements_title_trgm")
    op.drop_index("ix_messages_sender_id", table_name="messages")
    op.drop_index(
        "ix_conversations_advertisement_id", table_name="conversations"
    )
    op.drop_index(
        "ix_viewed_advertisements_advertisement_id",
        table_name="viewed_advertisements",
    )
    op.drop_index(
        "ix_liked_advertisements_advertisement_id",
        table_name="liked_advertisements",
    )
    op.drop_index(
        "ix_subcategories_category_id", table_name="subcategories"
    )
    op.drop_index(
        "ix_advertisements_subcategory_id", table_name="advertisements"
    )
    op.drop_index(
        "ix_advertisements_category_id", table_name="advertisements"
    )
    op.drop_index(
        "ix_advertisements_owner_id", table_name="advertisements"
    )
