"""Убрать инертные mockup-маркеры [CARD]/[BANNER] из секции тура pricing-tech

Revision ID: 0049_clean_tour_mockups
Revises: 0048_reseed_tour_tab
Create Date: 2026-07-15 00:00:00.000000

"""
import re
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "0049_clean_tour_mockups"
down_revision: Union[str, None] = "0048_reseed_tour_tab"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


MOCKUP_RE = re.compile(
    r"<p\b[^>]*>\s*(?:<br\s*/?>)?\s*\[\s*(?:CARD|BANNER)\s[^\]]*\]\s*(?:<br\s*/?>)?\s*</p>",
    re.IGNORECASE,
)


def upgrade() -> None:
    """Удалить mockup-маркеры только внутри секции «Реклама на сайте Тур-гид LOS»."""
    conn = op.get_bind()
    row = conn.execute(
        sa.text("SELECT body FROM content_pages WHERE slug = 'pricing-tech'")
    ).first()
    if not row:
        return
    body = row[0]
    match = re.search(r"<h1[^>]*>\s*Реклама на сайте Тур-гид LOS", body)
    if not match:
        return
    head = body[: match.start()]
    tail = MOCKUP_RE.sub("", body[match.start():])
    new_body = head + tail
    if new_body == body:
        return
    conn.execute(
        sa.text(
            "UPDATE content_pages SET body = :b, updated_at = now() "
            "WHERE slug = 'pricing-tech'"
        ),
        {"b": new_body},
    )


def downgrade() -> None:
    """Откат не выполняется."""
    pass
