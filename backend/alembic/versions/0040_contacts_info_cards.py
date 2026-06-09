"""Rewrite contacts body using INFO-card markers (per design)

Revision ID: 0040_contacts_info_cards
Revises: 0039_advertisements_deleted_at
Create Date: 2026-06-09 13:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0040_contacts_info_cards"
down_revision: Union[str, None] = "0039_advertisements_deleted_at"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


CONTACTS_BODY = """\
<h2>Контактные данные «LOS»</h2>
<p>[INFO Связь с оператором через колл-центр по телефону:]</p>
<p><a href="tel:+79407361475">+7 940 736-14-75</a></p>
<p>[/INFO]</p>
<p>[INFO Связь со специалистом через Чат Бот в Telegram канале:]</p>
<p><a href="tel:+79409707577">+7 940 970-75-77</a></p>
<p>[/INFO]</p>
<p>[INFO Электронная почта:]</p>
<p><a href="mailto:landofsoulweb@yandex.com">landofsoulweb@yandex.com</a></p>
<p>[/INFO]</p>
<h2>График работы офиса «LOS»</h2>
<p>[INFO Понедельник — суббота:]</p>
<p>с 9:00 до 18:00</p>
<p>[/INFO]</p>
<p>[INFO Воскресенье:]</p>
<p>выходной</p>
<p>[/INFO]</p>
"""


def upgrade() -> None:
    conn = op.get_bind()
    conn.execute(
        sa.text("UPDATE content_pages SET body = :body WHERE slug = 'contacts'"),
        {"body": CONTACTS_BODY},
    )


def downgrade() -> None:
    pass
