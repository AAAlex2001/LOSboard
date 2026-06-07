"""update pricing-tech-social body with stories and posts content

Revision ID: 0016_update_pricing_tech_social
Revises: 0015_advertising_accordion_content
Create Date: 2026-06-07 19:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0016_update_pricing_tech_social"
down_revision: Union[str, None] = "0015_advertising_accordion_content"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


NEW_BODY = """\
<h2>Stories</h2>
<p>[NOTE Размеры макетов для Stories уменьшены визуально для лучшего восприятия]</p>
<p>[PHONE 1080x1920 Stories]</p>
<blockquote>
<p><strong>Формат:</strong></p>
<p>Вертикальное изображение или видео на 24 часа.</p>
</blockquote>
<blockquote>
<p><strong>Площадки:</strong></p>
<p>Instagram, Telegram, Facebook.</p>
</blockquote>
<h2>Посты и Reels</h2>
<p>[NOTE Размеры макетов для постов и Reels уменьшены визуально для лучшего восприятия]</p>
<p>[BANNER 1080x1350 Post]</p>
<p>[PHONE 1080x1920 Reels]</p>
<blockquote>
<p><strong>Формат:</strong></p>
<p>Квадратное или вертикальное изображение/видео в ленте.</p>
</blockquote>
<blockquote>
<p><strong>Площадки:</strong></p>
<p>Instagram, Telegram, Facebook.</p>
</blockquote>
"""


OLD_BODY = """\
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


def upgrade() -> None:
    conn = op.get_bind()
    conn.execute(
        sa.text("UPDATE content_pages SET body = :body WHERE slug = :slug"),
        {"body": NEW_BODY, "slug": "pricing-tech-social"},
    )


def downgrade() -> None:
    conn = op.get_bind()
    conn.execute(
        sa.text("UPDATE content_pages SET body = :body WHERE slug = :slug"),
        {"body": OLD_BODY, "slug": "pricing-tech-social"},
    )
