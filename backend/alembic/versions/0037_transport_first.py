"""Move «Транспорт» to the top of the categories list

Revision ID: 0037_transport_first
Revises: 0036_add_transport_category
Create Date: 2026-06-09 11:30:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0037_transport_first"
down_revision: Union[str, None] = "0036_add_transport_category"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


TRANSPORT_SLUG = "transport"


def upgrade() -> None:
    conn = op.get_bind()

    current_orders = conn.execute(
        sa.text(
            "SELECT id, slug, sort_order FROM categories "
            "ORDER BY sort_order ASC, id ASC"
        )
    ).all()

    new_order = 0
    transport_id = None
    for row in current_orders:
        if row.slug == TRANSPORT_SLUG:
            transport_id = row.id
            continue
        conn.execute(
            sa.text("UPDATE categories SET sort_order = :order WHERE id = :id"),
            {"order": new_order + 1, "id": row.id},
        )
        new_order += 1

    if transport_id is not None:
        conn.execute(
            sa.text("UPDATE categories SET sort_order = 0 WHERE id = :id"),
            {"id": transport_id},
        )


def downgrade() -> None:
    conn = op.get_bind()
    rows = conn.execute(
        sa.text(
            "SELECT id FROM categories ORDER BY sort_order ASC, id ASC"
        )
    ).all()
    for idx, row in enumerate(rows):
        conn.execute(
            sa.text("UPDATE categories SET sort_order = :order WHERE id = :id"),
            {"order": idx, "id": row.id},
        )
