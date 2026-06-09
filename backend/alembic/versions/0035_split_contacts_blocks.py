"""Split contacts page into separate editable blocks

Revision ID: 0035_split_contacts_blocks
Revises: 0034_promo_card_highlight
Create Date: 2026-06-09 10:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0035_split_contacts_blocks"
down_revision: Union[str, None] = "0034_promo_card_highlight"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


CONTACTS_INTRO = ""

CONTACTS_DATA = """\
<h2>Контактные данные «LOS»</h2>
<p><strong>Связь с оператором через колл-центр по телефону:</strong><br>
<a href="tel:+79407361475">+7 940 736-14-75</a></p>
<p><strong>Связь со специалистом через Чат Бот в Telegram канале:</strong><br>
<a href="tel:+79409707577">+7 940 970-75-77</a></p>
<p><strong>Электронная почта:</strong><br>
<a href="mailto:landofsoulweb@yandex.com">landofsoulweb@yandex.com</a></p>
"""

CONTACTS_HOURS = """\
<h2>График работы офиса «LOS»</h2>
<p><strong>Понедельник–суббота:</strong> с 9:00 до 18:00</p>
<p><strong>Воскресенье:</strong> выходной</p>
"""


NEW_BLOCKS = [
    ("contacts-data", "Контакты — контактные данные", CONTACTS_DATA),
    ("contacts-hours", "Контакты — график работы", CONTACTS_HOURS),
]


def upgrade() -> None:
    conn = op.get_bind()

    conn.execute(
        sa.text("UPDATE content_pages SET body = :body WHERE slug = 'contacts'"),
        {"body": CONTACTS_INTRO},
    )

    for slug, title, body in NEW_BLOCKS:
        conn.execute(
            sa.text(
                "INSERT INTO content_pages (slug, title, body, is_published) "
                "VALUES (:slug, :title, :body, true) "
                "ON CONFLICT (slug) DO UPDATE SET body = EXCLUDED.body"
            ),
            {"slug": slug, "title": title, "body": body},
        )


def downgrade() -> None:
    conn = op.get_bind()
    conn.execute(
        sa.text("DELETE FROM content_pages WHERE slug IN ('contacts-data', 'contacts-hours')")
    )
