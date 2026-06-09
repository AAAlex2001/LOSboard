"""Сделать промо-карточку «Продвижение в ТОП» сиреневой через маркер [INFO!]

Revision ID: 0034_promo_card_highlight
Revises: 0033_pricing_info_cards
Create Date: 2026-06-09 02:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0034_promo_card_highlight"
down_revision: Union[str, None] = "0033_pricing_info_cards"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


PLAIN = "[INFO Продвижение баннеров в ТОП (занятие первых позиций)]"
HIGHLIGHTED = "[INFO! Продвижение баннеров в ТОП (занятие первых позиций)]"


def upgrade() -> None:
    conn = op.get_bind()
    conn.execute(
        sa.text(
            "UPDATE content_pages SET body = REPLACE(body, :plain, :hl), "
            "updated_at = now() WHERE slug = 'pricing'"
        ),
        {"plain": PLAIN, "hl": HIGHLIGHTED},
    )


def downgrade() -> None:
    conn = op.get_bind()
    conn.execute(
        sa.text(
            "UPDATE content_pages SET body = REPLACE(body, :hl, :plain) "
            "WHERE slug = 'pricing'"
        ),
        {"plain": PLAIN, "hl": HIGHLIGHTED},
    )
