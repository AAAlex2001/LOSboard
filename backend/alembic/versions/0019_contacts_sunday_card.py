"""wrap contacts sunday line in its own blockquote card

Revision ID: 0019_contacts_sunday_card
Revises: 0018_pricing_tech_tour_body
Create Date: 2026-06-07 22:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0019_contacts_sunday_card"
down_revision: Union[str, None] = "0018_pricing_tech_tour_body"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


NEW_BODY = """\
<h2>Контактные данные «LOS»</h2>
<blockquote>
<p><strong>Связь с оператором через колл-центр по телефону:</strong></p>
<p>+7 940 736-14-75</p>
<p><strong>Связь со специалистом через Чат Бот в Telegram канале:</strong></p>
<p>+7 940 970-75-77</p>
</blockquote>
<blockquote>
<p><strong>Электронная почта:</strong></p>
<p>landofsoulweb@yandex.com</p>
</blockquote>
<h2>График работы офиса «LOS»</h2>
<blockquote>
<p><strong>Понедельник–суббота</strong></p>
<p>с 9:00 до 18:00</p>
</blockquote>
<blockquote>
<p>Воскресенье — выходной</p>
</blockquote>
"""


OLD_BODY = """\
<h2>Контактные данные «LOS»</h2>
<blockquote>
<p><strong>Связь с оператором через колл-центр по телефону:</strong></p>
<p>+7 940 736-14-75</p>
<p><strong>Связь со специалистом через Чат Бот в Telegram канале:</strong></p>
<p>+7 940 970-75-77</p>
</blockquote>
<blockquote>
<p><strong>Электронная почта:</strong></p>
<p>landofsoulweb@yandex.com</p>
</blockquote>
<h2>График работы офиса «LOS»</h2>
<blockquote>
<p><strong>Понедельник–суббота</strong></p>
<p>с 9:00 до 18:00</p>
</blockquote>
<p>Воскресенье — выходной</p>
"""


def upgrade() -> None:
    conn = op.get_bind()
    conn.execute(
        sa.text("UPDATE content_pages SET body = :body WHERE slug = :slug"),
        {"body": NEW_BODY, "slug": "contacts"},
    )


def downgrade() -> None:
    conn = op.get_bind()
    conn.execute(
        sa.text("UPDATE content_pages SET body = :body WHERE slug = :slug"),
        {"body": OLD_BODY, "slug": "contacts"},
    )
