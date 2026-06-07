"""advertising page body, promo banner and accordion content

Revision ID: 0014_advertising_cms_content
Revises: 0013_update_cms_bodies
Create Date: 2026-06-07 16:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0014_advertising_cms_content"
down_revision: Union[str, None] = "0013_update_cms_bodies"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


PRICING_BODY = """\
<p>Размещайте рекламу на сайте, в мобильном приложении и соцсетях и привлекайте клиентов уже сегодня</p>
<p>Баннерная реклама на сайтах LOS отображается в десктопной версии сайтов. В мобильной версии доступны отдельные рекламные форматы и размещения.</p>
<h2>Реклама на сайте «Доска объявлений LOS» (сайт №1):</h2>
<blockquote>
<p><strong>Карусель (400×218)</strong></p>
<p>Неделя: 800 руб.<br>Месяц: 3 150 руб.<br>3 месяца: 9 000 руб.<br>6 месяцев: 17 500 руб.</p>
</blockquote>
<blockquote>
<p><strong>ТОП баннер (970×90)</strong></p>
<p>Неделя: 750 руб.<br>Месяц: 2 850 руб.<br>3 месяца: 8 500 руб.<br>6 месяцев: 16 500 руб.</p>
</blockquote>
<blockquote>
<p><strong>Баннер в ленте (800×200)</strong></p>
<p>Неделя: 700 руб.<br>Месяц: 2 850 руб.<br>3 месяца: 7 900 руб.<br>6 месяцев: 15 500 руб.</p>
</blockquote>
<blockquote>
<p><strong>Боковой баннер (300×600)</strong></p>
<p>Неделя: 550 руб.<br>Месяц: 2 100 руб.<br>3 месяца: 6 200 руб.<br>6 месяцев: 12 000 руб.</p>
</blockquote>
<blockquote>
<p><strong>Малый баннер (300×250)</strong></p>
<p>Неделя: 500 руб.<br>Месяц: 1 900 руб.<br>3 месяца: 5 650 руб.<br>6 месяцев: 11 000 руб.</p>
</blockquote>
<blockquote>
<p><strong>Продвижение баннеров в ТОП (занятие первых позиций)</strong></p>
<p>+10% от тарифа</p>
</blockquote>
<h2>Реклама на сайте Тур-гид LOS (сайт № 2) (<a href="https://landofsoul-apsny.ru">https://landofsoul-apsny.ru</a>) и в его мобильном приложении:</h2>
<blockquote>
<p><strong>Размещение объявлений об объектах (рестораны, отели и т.п.) или о различных сферах услуг сроком на 1 год со дня публикации.</strong></p>
<p>15 000 руб.</p>
</blockquote>
<blockquote>
<p><strong>Реклама в мобильном приложении LOS на стартовом экране:</strong></p>
<p>1 500 руб. за две недели показа</p>
</blockquote>
<h2>Реклама в соцсетях LOS, размещение постов и сторис</h2>
<hr>
<blockquote>
<p><strong>Для юридического лица:</strong></p>
<p>Пост: 800 руб.<br>Stories: 500 руб.</p>
</blockquote>
<blockquote>
<p><strong>Для физического лица:</strong></p>
<p>Пост: 500 руб.<br>Stories: 300 руб.</p>
</blockquote>
<ol>
<li>Пост - Ваше рекламное объявление размещается в ленте (Instagram, Telegram, Facebook).</li>
<li>Stories - Ваше рекламное объявление размещается на 24 часа с момента его публикации (Instagram, Telegram, Facebook).</li>
</ol>
<h2>Акции и оплата</h2>
<ol>
<li>Разовая скидка 20% предоставляется при первичном размещении вашего объявления. Скидка не распространяется на последующие объявления и на размещение объявлений об объектах (рестораны, отели и т.п.) или о различных сферах услуг сроком на 1 год со дня публикации на основном сайте LOS № 2 (<a href="https://landofsoul-apsny.ru">https://landofsoul-apsny.ru</a>).</li>
<li>Оплата осуществляется только безналичным способом через онлайн-банк (р/с в Амра-Банке Абхазии).</li>
</ol>
"""


PRICING_PROMO_BODY = """\
<p>Получите 20% скидку на первое размещение постов и сторис ваших объявлений в наших социальных сетях!</p>
"""


PRICING_TECH_BODY = """\
<h2>Реклама на сайте LOS</h2>
<p>Технические характеристики и рекомендации для рекламы на сайте.</p>
<h2>Реклама в соцсетях LOS</h2>
<p>Технические характеристики и рекомендации для рекламы в соцсетях.</p>
<h2>Реклама в мобильном приложении LOS</h2>
<p>Технические характеристики и рекомендации для рекламы в мобильном приложении.</p>
<h2>Реклама на сайте Тур-гид LOS</h2>
<p>Технические характеристики и рекомендации для рекламы на сайте Тур-гид.</p>
"""


NEW_PAGES = [
    ("pricing-promo", "Промо-баннер на странице рекламы", PRICING_PROMO_BODY),
    ("pricing-tech", "Технические характеристики рекламы", PRICING_TECH_BODY),
]


def upgrade() -> None:
    conn = op.get_bind()
    conn.execute(
        sa.text("UPDATE content_pages SET body = :body WHERE slug = :slug"),
        {"body": PRICING_BODY, "slug": "pricing"},
    )

    pages_table = sa.table(
        "content_pages",
        sa.column("slug", sa.String()),
        sa.column("title", sa.String()),
        sa.column("body", sa.Text()),
        sa.column("is_published", sa.Boolean()),
    )
    op.bulk_insert(
        pages_table,
        [
            {"slug": slug, "title": title, "body": body, "is_published": True}
            for slug, title, body in NEW_PAGES
        ],
    )


def downgrade() -> None:
    slugs = ", ".join(f"'{slug}'" for slug, _, _ in NEW_PAGES)
    op.execute(f"DELETE FROM content_pages WHERE slug IN ({slugs})")
