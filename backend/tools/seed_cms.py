"""One-shot CMS seed.

Запуск:
    docker compose exec backend python -m tools.seed_cms

Вставляет дефолтные контент-страницы, если их ещё нет в БД.
**Не перезаписывает** содержимое существующих страниц — все правки
из админки сохраняются. Это правильный способ добавлять новые
блоки/страницы CMS в проде, без миграций alembic с UPDATE'ами.
"""
import asyncio

from sqlalchemy import select

from database import AsyncSessionLocal
from models.content import ContentPage


DEFAULT_PAGES: list[tuple[str, str, str]] = [
    (
        "contacts",
        "Связаться с нами",
        "<p>Контактная информация заполняется через админку.</p>",
    ),
    (
        "pricing",
        "Реклама в «LOS»",
        "<p>Описание тарифов заполняется через админку.</p>",
    ),
    (
        "pricing-promo",
        "Промо-баннер на странице рекламы",
        "<p>Текст промо-баннера заполняется через админку.</p>",
    ),
]


async def main() -> None:
    async with AsyncSessionLocal() as session:
        for slug, title, body in DEFAULT_PAGES:
            result = await session.execute(
                select(ContentPage).where(ContentPage.slug == slug)
            )
            existing = result.scalar_one_or_none()
            if existing:
                continue
            page = ContentPage(slug=slug, title=title, body=body, is_published=True)
            session.add(page)
        await session.commit()


if __name__ == "__main__":
    asyncio.run(main())
