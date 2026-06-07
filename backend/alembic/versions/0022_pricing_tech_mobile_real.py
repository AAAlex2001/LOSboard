"""Replace pricing-tech-mobile accordion bodies with real Figma text

Revision ID: 0022_pricing_tech_mobile_real
Revises: 0021_pricing_tech_social_real
Create Date: 2026-06-07 23:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0022_pricing_tech_mobile_real"
down_revision: Union[str, None] = "0021_pricing_tech_social_real"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


NEW_BODY = """\
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


def upgrade() -> None:
    conn = op.get_bind()
    conn.execute(
        sa.text("UPDATE content_pages SET body = :body WHERE slug = :slug"),
        {"body": NEW_BODY, "slug": "pricing-tech-mobile"},
    )


def downgrade() -> None:
    # Downgrade just leaves placeholder content
    pass
