"""наполнить слоты заглушек для баннеров в ленте «Все объявления»

Revision ID: 0047_feed_banner_slots
Revises: 0046_banner_size_slots
Create Date: 2026-06-19 13:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0047_feed_banner_slots"
down_revision: Union[str, None] = "0046_banner_size_slots"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()

    feed_count = conn.execute(
        sa.text("SELECT count(*) FROM banners WHERE placement = 'feed'")
    ).scalar_one()

    if feed_count == 0:
        conn.execute(
            sa.text(
                "INSERT INTO banners "
                "(title, placement, size, sort_order, is_active, created_at) "
                "VALUES (:t, 'feed', 'leaderboard', 1, true, now())"
            ),
            {"t": "Баннер в ленте 970×90"},
        )
        conn.execute(
            sa.text(
                "INSERT INTO banners "
                "(title, placement, size, sort_order, is_active, created_at) "
                "VALUES (:t, 'feed', 'wide', 2, true, now())"
            ),
            {"t": "Баннер в ленте 800×200"},
        )


def downgrade() -> None:
    pass
