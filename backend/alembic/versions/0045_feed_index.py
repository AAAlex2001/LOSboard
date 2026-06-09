"""Partial composite index for the public advertisements feed

Revision ID: 0045_feed_index
Revises: 0044_nullable_sync
Create Date: 2026-06-09 17:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


revision: str = "0045_feed_index"
down_revision: Union[str, None] = "0044_nullable_sync"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


INDEX_NAME = "ix_advertisements_feed"


def upgrade() -> None:
    op.execute(
        f"CREATE INDEX IF NOT EXISTS {INDEX_NAME} "
        "ON advertisements (category_id, subcategory_id, id DESC) "
        "WHERE is_active AND deleted_at IS NULL "
        "AND moderation_status = 'approved'"
    )


def downgrade() -> None:
    op.execute(f"DROP INDEX IF EXISTS {INDEX_NAME}")
