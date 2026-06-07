"""accordion content slugs for /advertising tech specs

Revision ID: 0015_pricing_tech_accordion
Revises: 0014_advertising_cms_content
Create Date: 2026-06-07 18:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0015_pricing_tech_accordion"
down_revision: Union[str, None] = "0014_advertising_cms_content"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


TECH_BOARD_BODY = """\
<h2>ТОП баннер (970×90)</h2>
<p>[BANNER 970x90 Large Leaderboard]</p>
<blockquote>
<p><strong>Размещение:</strong></p>
<p>В верхней части страниц сайта, под шапкой.</p>
</blockquote>
<blockquote>
<p><strong>Особенности:</strong></p>
<p>Максимальная видимость. Подходит для имиджевой рекламы.</p>
</blockquote>
<h2>Баннер в ленте (800×200)</h2>
<p>[BANNER 800x200 Big banner]</p>
<blockquote>
<p><strong>Размещение:</strong></p>
<p>В ленте объявлений между блоками карточек.</p>
</blockquote>
<blockquote>
<p><strong>Особенности:</strong></p>
<p>Высокий охват, естественно вписывается в скролл.</p>
</blockquote>
<h2>Боковой баннер (300×600)</h2>
<p>[BANNER 300x600 Half Page]</p>
<blockquote>
<p><strong>Размещение:</strong></p>
<p>В боковой колонке, виден на всех страницах раздела.</p>
</blockquote>
<blockquote>
<p><strong>Особенности:</strong></p>
<p>Постоянная видимость при прокрутке.</p>
</blockquote>
<h2>Малый баннер (300×250)</h2>
<p>[BANNER 300x250 Medium Rectangle]</p>
<blockquote>
<p><strong>Размещение:</strong></p>
<p>В подвале страниц или между блоками контента.</p>
</blockquote>
<blockquote>
<p><strong>Особенности:</strong></p>
<p>Стандартный универсальный формат.</p>
</blockquote>
<h2>Карусель (400×218)</h2>
<p>[BANNER 400x218 banner img; 3 в ряд, горизонтальный скролл]</p>
<blockquote>
<p><strong>Размещение:</strong></p>
<p>В верхней части главной страницы.</p>
</blockquote>
<blockquote>
<p><strong>Особенности:</strong></p>
<p>Несколько баннеров в горизонтальной карусели с автопрокруткой.</p>
</blockquote>
"""


TECH_SOCIAL_BODY = """\
<h2>Реклама в соцсетях LOS</h2>
<blockquote>
<p><strong>Площадки:</strong></p>
<p>Instagram, Telegram, Facebook.</p>
</blockquote>
<blockquote>
<p><strong>Форматы:</strong></p>
<p>Пост в ленте, Stories на 24 часа.</p>
</blockquote>
"""


TECH_MOBILE_BODY = """\
<h2>Реклама в мобильном приложении LOS</h2>
<blockquote>
<p><strong>Размещение:</strong></p>
<p>На стартовом экране при запуске приложения.</p>
</blockquote>
<blockquote>
<p><strong>Период показа:</strong></p>
<p>Две недели от даты публикации.</p>
</blockquote>
"""


TECH_TOUR_BODY = """\
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


NEW_PAGES = [
    ("pricing-tech-board", "Реклама на сайте LOS — характеристики", TECH_BOARD_BODY),
    ("pricing-tech-social", "Реклама в соцсетях LOS — характеристики", TECH_SOCIAL_BODY),
    ("pricing-tech-mobile", "Реклама в мобильном приложении LOS — характеристики", TECH_MOBILE_BODY),
    ("pricing-tech-tour", "Реклама на сайте Тур-гид LOS — характеристики", TECH_TOUR_BODY),
]


def upgrade() -> None:
    op.execute("DELETE FROM content_pages WHERE slug = 'pricing-tech'")

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

    pages_table = sa.table(
        "content_pages",
        sa.column("slug", sa.String()),
        sa.column("title", sa.String()),
        sa.column("body", sa.Text()),
        sa.column("is_published", sa.Boolean()),
    )
    op.bulk_insert(
        pages_table,
        [{
            "slug": "pricing-tech",
            "title": "Технические характеристики рекламы",
            "body": "<h2>Реклама на сайте LOS</h2><p>Технические характеристики.</p>",
            "is_published": True,
        }],
    )
