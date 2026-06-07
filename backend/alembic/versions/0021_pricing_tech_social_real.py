"""Replace pricing-tech-social accordion bodies with real Figma text

Revision ID: 0021_pricing_tech_social_real
Revises: 0020_pricing_tech_board_real
Create Date: 2026-06-07 23:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0021_pricing_tech_social_real"
down_revision: Union[str, None] = "0020_pricing_tech_board_real"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


NEW_BODY = """\
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


def upgrade() -> None:
    conn = op.get_bind()
    conn.execute(
        sa.text("UPDATE content_pages SET body = :body WHERE slug = :slug"),
        {"body": NEW_BODY, "slug": "pricing-tech-social"},
    )


def downgrade() -> None:
    # Downgrade just leaves placeholder content
    pass
