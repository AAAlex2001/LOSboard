"""добавить поле size в banners и наполнить слоты заглушками

Revision ID: 0046_banner_size_slots
Revises: 0045_feed_index
Create Date: 2026-06-19 12:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0046_banner_size_slots"
down_revision: Union[str, None] = "0045_feed_index"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


MAIN_TOP_TARGET = 9


def upgrade() -> None:
    op.add_column(
        "banners",
        sa.Column("size", sa.String(), nullable=False, server_default="rectangle"),
    )

    conn = op.get_bind()

    main_top = conn.execute(
        sa.text(
            "SELECT count(*) AS cnt, coalesce(max(sort_order), 0) AS max_order "
            "FROM banners WHERE placement = 'main_top'"
        )
    ).one()

    missing = MAIN_TOP_TARGET - main_top.cnt
    if missing > 0:
        order = main_top.max_order
        for index in range(missing):
            order += 1
            number = main_top.cnt + index + 1
            conn.execute(
                sa.text(
                    "INSERT INTO banners "
                    "(title, placement, size, sort_order, is_active, created_at) "
                    "VALUES (:t, 'main_top', 'rectangle', :o, true, now())"
                ),
                {"t": f"Слот рекламы {number}", "o": order},
            )

    sidebar_count = conn.execute(
        sa.text("SELECT count(*) FROM banners WHERE placement = 'sidebar'")
    ).scalar_one()

    if sidebar_count == 0:
        conn.execute(
            sa.text(
                "INSERT INTO banners "
                "(title, placement, size, sort_order, is_active, created_at) "
                "VALUES (:t, 'sidebar', 'rectangle', 1, true, now())"
            ),
            {"t": "Боковой баннер 300×250"},
        )
        conn.execute(
            sa.text(
                "INSERT INTO banners "
                "(title, placement, size, sort_order, is_active, created_at) "
                "VALUES (:t, 'sidebar', 'halfpage', 2, true, now())"
            ),
            {"t": "Боковой баннер 300×600"},
        )


def downgrade() -> None:
    op.drop_column("banners", "size")
