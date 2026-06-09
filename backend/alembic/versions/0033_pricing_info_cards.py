"""Преобразовать info-карточки pricing из blockquote в Quill-safe маркеры [INFO]

Revision ID: 0033_pricing_info_cards
Revises: 0032_info_card_markers
Create Date: 2026-06-09 01:00:00.000000

"""
import re
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0033_pricing_info_cards"
down_revision: Union[str, None] = "0032_info_card_markers"
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


_BLOCKQUOTE_RE = re.compile(
    r"<blockquote\b[^>]*>\s*<p[^>]*>([\s\S]*?)</p>([\s\S]*?)</blockquote>",
    re.IGNORECASE,
)


def _to_info_markers(body: str) -> str:
    """Quill вырезает blockquote — заменяем каждую info-карточку на текстовые маркеры [INFO]."""
    def repl(match: "re.Match[str]") -> str:
        label = re.sub(r"<[^>]+>", "", match.group(1)).strip().rstrip(":").strip()
        inner = match.group(2).strip()
        return f"<p>[INFO {label}]</p>{inner}<p>[/INFO]</p>"
    return _BLOCKQUOTE_RE.sub(repl, body)


def upgrade() -> None:
    conn = op.get_bind()
    conn.execute(
        sa.text("UPDATE content_pages SET body = :b, updated_at = now() WHERE slug = 'pricing'"),
        {"b": _to_info_markers(PRICING_BODY)},
    )


def downgrade() -> None:
    pass
