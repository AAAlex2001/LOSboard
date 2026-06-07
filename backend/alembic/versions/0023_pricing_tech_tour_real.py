"""Replace pricing-tech-tour accordion bodies with real Figma text

Revision ID: 0023_pricing_tech_tour_real
Revises: 0022_pricing_tech_mobile_real
Create Date: 2026-06-07 23:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0023_pricing_tech_tour_real"
down_revision: Union[str, None] = "0022_pricing_tech_mobile_real"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


NEW_BODY = """\
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


def upgrade() -> None:
    conn = op.get_bind()
    conn.execute(
        sa.text("UPDATE content_pages SET body = :body WHERE slug = :slug"),
        {"body": NEW_BODY, "slug": "pricing-tech-tour"},
    )


def downgrade() -> None:
    # Downgrade just leaves placeholder content
    pass
