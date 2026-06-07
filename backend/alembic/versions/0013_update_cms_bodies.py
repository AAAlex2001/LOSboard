"""update contacts and pricing bodies to new card design

Revision ID: 0013_update_cms_bodies
Revises: 0012_ad_labels
Create Date: 2026-06-07 12:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0013_update_cms_bodies"
down_revision: Union[str, None] = "0012_ad_labels"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


CONTACTS_BODY_NEW = """\
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


PRICING_BODY_NEW = """\
<p>Размещайте рекламу на сайте, в мобильной версии и соцсетях и привлекайте клиентов уже сегодня.</p>
<h2>Реклама на сайте «Доска объявлений LOS»</h2>
<blockquote>
<p><strong>Карусель (400×218)</strong></p>
<p>Неделя: 800 руб.<br>Месяц: 3 150 руб.<br>3 месяца: 8 100 руб.<br>6 месяцев: 17 500 руб.</p>
</blockquote>
<blockquote>
<p><strong>ТОП баннер (970×90)</strong></p>
<p>Неделя: 750 руб.<br>Месяц: 2 850 руб.<br>3 месяца: 7 900 руб.<br>6 месяцев: 16 500 руб.</p>
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
<p>Неделя: 500 руб.<br>Месяц: 1 650 руб.<br>3 месяца: 5 650 руб.<br>6 месяцев: 11 000 руб.</p>
</blockquote>
<blockquote>
<p><strong>Продвижение баннеров в ТОП (первые позиции)</strong></p>
<p>+10% от тарифа</p>
</blockquote>
<h2>Реклама на сайте Тур-гид LOS</h2>
<p>Сайт <a href="https://landofsoul-apsny.ru/">landofsoul-apsny.ru</a> и мобильное приложение.</p>
<blockquote>
<p><strong>Размещение объявления об объекте (рестораны, отели и т. п.) на год</strong></p>
<p>15 000 руб.</p>
</blockquote>
<blockquote>
<p><strong>Реклама в мобильном приложении на стартовом экране (две недели показа)</strong></p>
<p>1 500 руб.</p>
</blockquote>
<h2>Реклама в соцсетях LOS</h2>
<p><em>Скидка 20% на первое размещение постов и сторис.</em></p>
<blockquote>
<p><strong>Юридическое лицо</strong></p>
<p>Пост — 800 руб.<br>Stories — 500 руб.</p>
</blockquote>
<blockquote>
<p><strong>Физическое лицо</strong></p>
<p>Пост — 500 руб.<br>Stories — 300 руб.</p>
</blockquote>
<p>Пост — публикация в ленте (Instagram, Telegram, Facebook). Stories — публикация на 24 часа.</p>
<h2>Акции и оплата</h2>
<p>Разовая скидка 20% при первичном размещении. Скидка не распространяется на последующие объявления и на годовые размещения объектов на сайте Тур-гид LOS.</p>
<p>Оплата только безналичным способом через онлайн-банк (р/с в Амра-Банке Абхазии).</p>
"""


CONTACTS_BODY_OLD = """\
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


PRICING_BODY_OLD = """\
<p>Размещайте рекламу на сайте, в мобильной версии и соцсетях и привлекайте клиентов уже сегодня.</p>

<h2>Реклама на сайте «Доска объявлений LOS»</h2>
<ul>
  <li><strong>Карусель (400×218)</strong> — Неделя: 800 руб. / Месяц: 3 150 руб. / 3 месяца: 8 100 руб. / 6 месяцев: 17 500 руб.</li>
  <li><strong>ТОП баннер (970×90)</strong> — Неделя: 750 руб. / Месяц: 2 850 руб. / 3 месяца: 7 900 руб. / 6 месяцев: 16 500 руб.</li>
  <li><strong>Баннер в ленте (800×200)</strong> — Неделя: 700 руб. / Месяц: 2 850 руб. / 3 месяца: 7 900 руб. / 6 месяцев: 15 500 руб.</li>
  <li><strong>Боковой баннер (300×600)</strong> — Неделя: 550 руб. / Месяц: 2 100 руб. / 3 месяца: 6 200 руб. / 6 месяцев: 12 000 руб.</li>
  <li><strong>Малый баннер (300×250)</strong> — Неделя: 500 руб. / Месяц: 1 650 руб. / 3 месяца: 5 650 руб. / 6 месяцев: 11 000 руб.</li>
  <li><strong>Продвижение баннеров в ТОП (первые позиции)</strong> — +10% от тарифа</li>
</ul>

<h2>Реклама на сайте Тур-гид LOS</h2>
<p><a href="https://landofsoul-apsny.ru/">landofsoul-apsny.ru</a> и мобильное приложение.</p>
<ul>
  <li><strong>Размещение объявления об объекте (рестораны, отели и т. п.) на год:</strong> 15 000 руб.</li>
  <li><strong>Реклама в мобильном приложении на стартовом экране (две недели показа):</strong> 1 500 руб.</li>
</ul>

<h2>Реклама в соцсетях LOS</h2>
<p><em>Скидка 20% на первое размещение постов и сторис.</em></p>
<ul>
  <li><strong>Юридическое лицо:</strong> Пост — 800 руб., Stories — 500 руб.</li>
  <li><strong>Физическое лицо:</strong> Пост — 500 руб., Stories — 300 руб.</li>
</ul>
<p>Пост — публикация в ленте (Instagram, Telegram, Facebook). Stories — публикация на 24 часа.</p>

<h2>Акции и оплата</h2>
<ol>
  <li>Разовая скидка 20% при первичном размещении. Скидка не распространяется на последующие объявления и на годовые размещения объектов на сайте Тур-гид LOS.</li>
  <li>Оплата только безналичным способом через онлайн-банк (р/с в Амра-Банке Абхазии).</li>
</ol>
"""


def _update_body(slug: str, body: str) -> None:
    conn = op.get_bind()
    conn.execute(
        sa.text("UPDATE content_pages SET body = :body WHERE slug = :slug"),
        {"body": body, "slug": slug},
    )


def upgrade() -> None:
    _update_body("contacts", CONTACTS_BODY_NEW)
    _update_body("pricing", PRICING_BODY_NEW)


def downgrade() -> None:
    _update_body("contacts", CONTACTS_BODY_OLD)
    _update_body("pricing", PRICING_BODY_OLD)
