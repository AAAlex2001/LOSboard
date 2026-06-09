"""Restore contacts as a single content page (revert 0035 split)

Revision ID: 0038_restore_contacts_single
Revises: 0037_transport_first
Create Date: 2026-06-09 12:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0038_restore_contacts_single"
down_revision: Union[str, None] = "0037_transport_first"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


CONTACTS_BODY = """\
<h2>Контактные данные «LOS»</h2>
<p><strong>Связь с оператором через колл-центр по телефону:</strong><br>
<a href="tel:+79407361475">+7 940 736-14-75</a></p>
<p><strong>Связь со специалистом через Чат Бот в Telegram канале:</strong><br>
<a href="tel:+79409707577">+7 940 970-75-77</a></p>
<p><strong>Электронная почта:</strong><br>
<a href="mailto:landofsoulweb@yandex.com">landofsoulweb@yandex.com</a></p>

<h2>График работы офиса «LOS»</h2>
<p><strong>Понедельник–суббота:</strong> с 9:00 до 18:00</p>
<p><strong>Воскресенье:</strong> выходной</p>
"""


def upgrade() -> None:
    conn = op.get_bind()

    conn.execute(
        sa.text("UPDATE content_pages SET body = :body WHERE slug = 'contacts'"),
        {"body": CONTACTS_BODY},
    )

    conn.execute(
        sa.text("DELETE FROM content_pages WHERE slug IN ('contacts-data', 'contacts-hours')")
    )


def downgrade() -> None:
    pass
