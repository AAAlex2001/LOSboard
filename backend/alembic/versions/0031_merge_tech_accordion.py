"""Объединить 4 страницы тех-характеристик рекламы в одну (pricing-tech)

Revision ID: 0031_merge_tech_accordion
Revises: 0030_reseed_advertising
Create Date: 2026-06-09 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0031_merge_tech_accordion"
down_revision: Union[str, None] = "0030_reseed_advertising"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


BOARD_BODY = """\
<h2>1. Горизонтальный баннер</h2>
<p>[BANNER 970x90 Large Leaderboard]</p>
<blockquote>
<p><strong>Где показывается:</strong></p>
<p>На главной странице в разделе "Все объявления" и в результатах поиска объявлений</p>
</blockquote>
<blockquote>
<p><strong>Рекомендации:</strong></p>
<p><strong>Изображения</strong> — формат JPEG и PNG, рекомендуемый размер — 1800x1332, минимальный размер — 980x666, рекомендуем по бокам изображений не располагать важный контент.<br><strong>Ссылка</strong> — ссылка/пиксель<br><strong>Возрастное ограничение</strong> — опционально, например, 6+</p>
</blockquote>
<h2>2. Баннер в ленте (4:1, адаптивный по ширине)</h2>
<p>[BANNER 800x200 Big banner]</p>
<blockquote>
<p><strong>Где показывается:</strong></p>
<p>На главной странице в разделе "Все объявления" и в результатах поиска объявлений</p>
</blockquote>
<blockquote>
<p><strong>Рекомендации:</strong></p>
<p><strong>Изображения</strong> — формат JPEG и PNG, рекомендуемый размер — 1800x1332, минимальный размер — 980x666, рекомендуем по бокам изображений не располагать важный контент.<br><strong>Ссылка</strong> — ссылка/пиксель<br><strong>Возрастное ограничение</strong> — опционально, например, 6+</p>
</blockquote>
<h2>3. Вертикальный баннер</h2>
<p>[BANNER 300x600 Half Page]</p>
<blockquote>
<p><strong>Где показывается:</strong></p>
<p>На главной странице и в карточке товара в правой колонке</p>
</blockquote>
<blockquote>
<p><strong>Рекомендации:</strong></p>
<p><strong>Изображение</strong> — формат JPEG и PNG, рекомендуемый размер — 720x1440, минимальный размер — 360x720, рекомендуем по бокам изображений не располагать важный контент, максимальный вес — 2 мб<br><strong>Ссылка</strong> — ссылка/пиксель<br><strong>Возрастное ограничение</strong> — опционально, например, 6+</p>
</blockquote>
<h2>4. Малый баннер</h2>
<p>[BANNER 300x250 Medium Rectangle]</p>
<blockquote>
<p><strong>Где показывается:</strong></p>
<p>На главной странице и в карточке товара в правой колонке</p>
</blockquote>
<blockquote>
<p><strong>Рекомендации:</strong></p>
<p><strong>Изображения</strong> — формат JPEG и PNG, рекомендуемый размер — 720x750, минимальный размер — 360x375, рекомендуем по бокам изображений не располагать важный контент, максимальный вес — 2 мб<br><strong>Заголовок</strong> — до 30 символов (включительно)<br><strong>Описание</strong> — до 45 символов (включительно)<br><strong>Ссылка</strong> — ссылка/пиксель<br><strong>Возрастное ограничение</strong> — опционально, например, 6+</p>
</blockquote>
<h2>5. Карусель рекламы (16:9, карточка рекламы в карусели)</h2>
<p>[BANNER 400x218 Banner img; 3 в ряд, горизонтальный скролл]</p>
<blockquote>
<p><strong>Где показывается:</strong></p>
<p>В начале главной страницы Доски объявлений LOS, занимая всю ширину ленты в виде карусели объявлений по 3 объекта</p>
</blockquote>
<blockquote>
<p><strong>Рекомендации:</strong></p>
<p><strong>Изображения</strong> — формат JPEG и PNG, рекомендуемый размер — 1800x1332, минимальный размер — 980x666, рекомендуем по бокам изображений не располагать важный контент.<br><strong>Ссылка</strong> — ссылка/пиксель<br><strong>Возрастное ограничение</strong> — опционально, например, 6+</p>
</blockquote>
"""


SOCIAL_BODY = """\
<h2>1. Stories</h2>
<p>[NOTE Размеры макета для Stories уменьшены визуально для лучшего восприятия]</p>
<p>[PHONE 1080x1920 Stories 9:16]</p>
<blockquote>
<p><strong>Где показывается:</strong></p>
<p>В социальных сетях LOS на Ваш выбор (Инстаграм и прочие)</p>
</blockquote>
<blockquote>
<p><strong>Рекомендации:</strong></p>
<p><strong>Видео</strong> — формат MP4 и MOV, вертикальная ориентация (9:16) 1080x1920 px. Рекомендуемая продолжительность ролика — 5-15 секунд. Вы можете размещать ролики до 20 секунд, но в этом случае показатели досмотра могут быть низкими. Вес файла — 2-5 мб для 15-секундного ролика. Битрейт: Full HD (1080p): 4-6 Мбит/с; HD (720p): 2,5-4 Мбит/с; SD (480p): 1,5-2,5 Мбит/с.<br><strong>Заголовок</strong> — до 30 символов (включительно).<br><strong>Описание</strong> — до 45 символов (включительно).<br><strong>Изображение</strong> — формат JPEG, рекомендуемый размер — 1080x1920 (9:16), рекомендуем по бокам изображений не располагать важный контент, максимальный вес — 2-5 мб. Цветовой профиль — sRGB. Глубина цвета — 8-bit.</p>
</blockquote>
<h2>2. Пост (Фото 4:5, 9:16; Reels 9:16)</h2>
<p>[NOTE Размеры макетов для постов и Reels уменьшены визуально для лучшего восприятия]</p>
<p>[BANNER 1080x1350 Post 4:5]</p>
<p>[PHONE 1080x1920 Reels, post 9:16]</p>
<blockquote>
<p><strong>Где показывается:</strong></p>
<p>В социальных сетях LOS на Ваш выбор (Инстаграм и прочие)</p>
</blockquote>
<blockquote>
<p><strong>Рекомендации:</strong></p>
<p><strong>Видео</strong> — формат MP4 и MOV, вертикальная ориентация (9:16) 1080x1920 рх. Рекомендуемая продолжительность ролика — 5-90 сек. (15-30 секунд самые эффективные). Вес файла — оптимально 150 мб. Частота кадров: 30 fps (макс. 60 fps). Если в видео есть озвучка, к ней должны прилагаться субтитры.<br><strong>Заголовок</strong> — до 30 символов (включительно).<br><strong>Описание</strong> — до 45 символов (включительно).<br><strong>Изображение</strong> — формат JPEG, рекомендуемый размер — 1080x1350 (4:5), 1080x1920 (9:16), рекомендуем по бокам изображений не располагать важный контент, максимальный вес — 30 мб, оптимально 1,5 мб.</p>
</blockquote>
"""


MOBILE_BODY = """\
<h2>1. Баннер (фото или видео)</h2>
<p>[PHONE 402x874 App banner]</p>
<blockquote>
<p><strong>Где показывается:</strong></p>
<p>При входе в приложение</p>
</blockquote>
<blockquote>
<p><strong>Рекомендации:</strong></p>
<p><strong>Видео</strong> — формат MP4 и MOV, вертикальная ориентация (9:16) 720x1280 рх, 1080x1920 рх. Рекомендуемая продолжительность ролика — 5-15 секунд. Вы можете размещать ролики до 20 секунд, но в этом случае показатели досмотра могут быть низкими. С пропуском: кнопка Skip проявляется после 5 сек. Вес файла — 2-5 мб для 15-секундного ролика. Битрейт: Full HD (1080p): 4-6 Мбит/с; HD (720p): 2,5-4 Мбит/с; SD (480p): 1,5-2,5 Мбит/с. СТА-кнопка ("Установить", "Подробнее") располагается внизу экрана.<br><strong>Изображение</strong> — формат JPEG и PNG, рекомендуемый размер — 600x1200, минимальный размер — 300x600, рекомендуем по бокам изображений не располагать важный контент, максимальный вес — 2-5 мб. С пропуском: кнопка Skip проявляется после 5 сек. СТА-кнопка ("Установить", "Подробнее") располагается внизу экрана.<br><strong>Описание</strong> — до 30 символов (включительно)<br><strong>Ссылка</strong> — до 45 символов (включительно)<br><strong>Возрастное ограничение</strong> — опционально, например, 6+</p>
</blockquote>
<h2>2. Баннер в ленте (4:1, адаптивный по ширине)</h2>
<p>[BANNER 800x200 Big banner]</p>
<blockquote>
<p><strong>Где показывается:</strong></p>
<p>На главной странице в разделе "Все объявления" и в результатах поиска объявлений</p>
</blockquote>
<blockquote>
<p><strong>Рекомендации:</strong></p>
<p><strong>Изображения</strong> — формат JPEG и PNG, рекомендуемый размер — 1800x1332, минимальный размер — 980x666, рекомендуем по бокам изображений не располагать важный контент.<br><strong>Ссылка</strong> — ссылка/пиксель<br><strong>Возрастное ограничение</strong> — опционально, например, 6+</p>
</blockquote>
<h2>3. Постоянное размещение объектов (рестораны, отели и т.п.) или сфер услуг без ограничения во времени</h2>
<p>[CARD 350x114 App banner 1]</p>
<p>[CARD 350x226 App banner 2]</p>
<p>[CARD 350x287 App banner 3]</p>
<p>[HINT Полноширинный баннер, соотношение 16:9 или 4:1]</p>
<blockquote>
<p><strong>Где показывается:</strong></p>
<p>В 20 разделах приложения LOS на выбор (зависит от Вашего предложения)</p>
</blockquote>
<blockquote>
<p><strong>Рекомендации:</strong></p>
<p><strong>Изображение</strong> — формат JPEG и PNG, рекомендуемый размер — 600x1200, минимальный размер — 300x600, рекомендуем по бокам изображений не располагать важный контент, максимальный вес — 2 мб<br><strong>Заголовок</strong> — до 30 символов (включительно)<br><strong>Описание</strong> — до 1000 символов (включительно)<br><strong>Возрастное ограничение</strong> — опционально, например, 6+</p>
</blockquote>
"""


TOUR_BODY = """\
<h2>1. Горизонтальный баннер</h2>
<p>[BANNER 970x90 Large Leaderboard]</p>
<blockquote>
<p><strong>Где показывается:</strong></p>
<p>В 20 разделах сайта Тур-гид LOS на выбор (зависит от Вашего предложения)</p>
</blockquote>
<blockquote>
<p><strong>Рекомендации:</strong></p>
<p><strong>Изображения</strong> — формат JPEG и PNG, рекомендуемый размер — 1800x1332, минимальный размер — 980x666, рекомендуем по бокам изображений не располагать важный контент.<br><strong>Ссылка</strong> — ссылка/пиксель<br><strong>Возрастное ограничение</strong> — опционально, например, 6+</p>
</blockquote>
<h2>2. Вертикальный баннер</h2>
<p>[BANNER 300x600 Half Page]</p>
<blockquote>
<p><strong>Где показывается:</strong></p>
<p>В 20 разделах сайта Тур-гид LOS на выбор (зависит от Вашего предложения)</p>
</blockquote>
<blockquote>
<p><strong>Рекомендации:</strong></p>
<p><strong>Изображение</strong> — формат JPEG и PNG, рекомендуемый размер — 720x1440, минимальный размер — 360x720, рекомендуем по бокам изображений не располагать важный контент, максимальный вес — 2 мб<br><strong>Ссылка</strong> — ссылка/пиксель<br><strong>Возрастное ограничение</strong> — опционально, например, 6+</p>
</blockquote>
<h2>3. Малый баннер</h2>
<p>[BANNER 300x250 Medium Rectangle]</p>
<blockquote>
<p><strong>Где показывается:</strong></p>
<p>В 20 разделах сайта Тур-гид LOS на выбор (зависит от Вашего предложения)</p>
</blockquote>
<blockquote>
<p><strong>Рекомендации:</strong></p>
<p><strong>Изображение</strong> — формат JPEG и PNG, рекомендуемый размер — 720x750, минимальный размер — 360x375, рекомендуем по бокам изображений не располагать важный контент, максимальный вес — 2 мб<br><strong>Заголовок</strong> — до 30 символов (включительно)<br><strong>Описание</strong> — до 45 символов (включительно)<br><strong>Ссылка</strong> — ссылка/пиксель<br><strong>Возрастное ограничение</strong> — опционально, например, 6+</p>
</blockquote>
"""


MERGED_SLUG = "pricing-tech"
MERGED_TITLE = "Технические характеристики рекламы"

SECTIONS = [
    ("Реклама на сайте «Доска объявлений LOS»", BOARD_BODY),
    ("Реклама в соцсетях LOS", SOCIAL_BODY),
    ("Реклама в мобильном приложении LOS", MOBILE_BODY),
    ("Реклама на сайте Тур-гид LOS", TOUR_BODY),
]

OLD_SLUGS = [
    "pricing-tech-board",
    "pricing-tech-social",
    "pricing-tech-mobile",
    "pricing-tech-tour",
]


def build_merged_body() -> str:
    """Каждая секция оборачивается H1-заголовком — он служит разделителем аккордеона."""
    parts = []
    for title, body in SECTIONS:
        parts.append(f"<h1>{title}</h1>\n{body}\n")
    return "".join(parts)


def upgrade() -> None:
    conn = op.get_bind()
    merged = build_merged_body()
    existing = conn.execute(
        sa.text("SELECT id FROM content_pages WHERE slug = :s"),
        {"s": MERGED_SLUG},
    ).first()
    if existing:
        conn.execute(
            sa.text(
                "UPDATE content_pages SET title = :t, body = :b, "
                "is_published = true, updated_at = now() WHERE slug = :s"
            ),
            {"t": MERGED_TITLE, "b": merged, "s": MERGED_SLUG},
        )
    else:
        conn.execute(
            sa.text(
                "INSERT INTO content_pages "
                "(slug, title, body, is_published, updated_at) "
                "VALUES (:s, :t, :b, true, now())"
            ),
            {"s": MERGED_SLUG, "t": MERGED_TITLE, "b": merged},
        )
    conn.execute(
        sa.text("DELETE FROM content_pages WHERE slug IN :slugs").bindparams(
            sa.bindparam("slugs", value=OLD_SLUGS, expanding=True)
        )
    )


def downgrade() -> None:
    pass
