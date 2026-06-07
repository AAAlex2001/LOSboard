"""update pricing-tech-mobile body with mobile app advertising content

Revision ID: 0017_update_pricing_tech_mobile
Revises: 0016_update_pricing_tech_social
Create Date: 2026-06-07 20:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0017_update_pricing_tech_mobile"
down_revision: Union[str, None] = "0016_update_pricing_tech_social"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


NEW_BODY = """\
<h2>Стартовый экран</h2>
<p>[PHONE 1080x1920 Стартовый экран]</p>
<blockquote>
<p><strong>Размещение:</strong></p>
<p>Полноэкранное изображение при запуске приложения.</p>
</blockquote>
<blockquote>
<p><strong>Особенности:</strong></p>
<p>Показывается каждому пользователю при открытии приложения.<br>Максимальное внимание благодаря полноэкранному формату.<br>Период показа — две недели от даты публикации.<br>Подходит для имиджевой рекламы и анонсов мероприятий.</p>
</blockquote>
<h2>Баннер в приложении</h2>
<p>[BANNER 800x200 In-app banner]</p>
<blockquote>
<p><strong>Размещение:</strong></p>
<p>Сверху или снизу экрана с лентой объявлений.</p>
</blockquote>
<blockquote>
<p><strong>Особенности:</strong></p>
<p>Ротация баннеров каждые 10 секунд.<br>Всегда виден поверх списка карточек.<br>Подходит для постоянного присутствия бренда.</p>
</blockquote>
<h2>Карточки рекламы в ленте</h2>
<p>[CARD 350x114 Компактная]</p>
<p>[CARD 350x226 Стандартная]</p>
<p>[CARD 350x287 Широкая]</p>
<p>[HINT Полноширинный баннер, соотношение 16:9 или 4:1]</p>
<blockquote>
<p><strong>Размещение:</strong></p>
<p>Между обычными объявлениями в ленте.</p>
</blockquote>
<blockquote>
<p><strong>Особенности:</strong></p>
<p>Три размера в зависимости от формата объявления.<br>Естественно вписывается в скролл ленты.<br>Высокий процент кликов.</p>
</blockquote>
"""


OLD_BODY = """\
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


def upgrade() -> None:
    conn = op.get_bind()
    conn.execute(
        sa.text("UPDATE content_pages SET body = :body WHERE slug = :slug"),
        {"body": NEW_BODY, "slug": "pricing-tech-mobile"},
    )


def downgrade() -> None:
    conn = op.get_bind()
    conn.execute(
        sa.text("UPDATE content_pages SET body = :body WHERE slug = :slug"),
        {"body": OLD_BODY, "slug": "pricing-tech-mobile"},
    )
