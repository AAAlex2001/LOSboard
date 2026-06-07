"""update pricing-tech-tour body with tour-guide advertising content

Revision ID: 0018_pricing_tech_tour_body
Revises: 0017_pricing_tech_mobile_body
Create Date: 2026-06-07 21:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0018_pricing_tech_tour_body"
down_revision: Union[str, None] = "0017_pricing_tech_mobile_body"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


NEW_BODY = """\
<h2>ТОП баннер 970×90</h2>
<p>[BANNER 970x90 Large Leaderboard]</p>
<blockquote>
<p><strong>Размещение:</strong></p>
<p>В шапке сайта Тур-гид LOS на всех страницах.</p>
</blockquote>
<blockquote>
<p><strong>Особенности:</strong></p>
<p>Виден сразу при заходе на сайт.<br>Подходит для имиджевой рекламы туристических объектов.<br>Высокий охват — все посетители Тур-гида.</p>
</blockquote>
<h2>Боковой баннер 300×600</h2>
<p>[BANNER 300x600 Half Page]</p>
<blockquote>
<p><strong>Размещение:</strong></p>
<p>В боковой колонке на страницах каталога и статей.</p>
</blockquote>
<blockquote>
<p><strong>Особенности:</strong></p>
<p>Постоянная видимость при прокрутке.<br>Большая площадь привлекает внимание.<br>Подходит для отелей, ресторанов, развлекательных объектов.</p>
</blockquote>
<h2>Малый баннер 300×250</h2>
<p>[BANNER 300x250 Medium Rectangle]</p>
<blockquote>
<p><strong>Размещение:</strong></p>
<p>Между блоками описаний достопримечательностей и в подвале страниц.</p>
</blockquote>
<blockquote>
<p><strong>Особенности:</strong></p>
<p>Стандартный универсальный формат.<br>Высокая кликабельность благодаря тематическому окружению.<br>Подходит для конкретных предложений и акций.</p>
</blockquote>
"""


OLD_BODY = """\
<h2>Реклама на сайте Тур-гид LOS</h2>
<blockquote>
<p><strong>Сайт:</strong></p>
<p>landofsoul-apsny.ru и мобильное приложение.</p>
</blockquote>
<blockquote>
<p><strong>Размещение:</strong></p>
<p>Объявления об объектах (рестораны, отели и т.п.) и разделах услуг сроком на год.</p>
</blockquote>
"""


def upgrade() -> None:
    conn = op.get_bind()
    conn.execute(
        sa.text("UPDATE content_pages SET body = :body WHERE slug = :slug"),
        {"body": NEW_BODY, "slug": "pricing-tech-tour"},
    )


def downgrade() -> None:
    conn = op.get_bind()
    conn.execute(
        sa.text("UPDATE content_pages SET body = :body WHERE slug = :slug"),
        {"body": OLD_BODY, "slug": "pricing-tech-tour"},
    )
