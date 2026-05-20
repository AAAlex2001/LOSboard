from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.category import Category, Subcategory


CATEGORIES_DATA = [
    {
        "name": "Недвижимость",
        "slug": "realty",
        "subcategories": [
            "Квартиры",
            "Дома, дачи, коттеджи",
            "Комнаты",
            "Земельные участки",
            "Коммерческая недвижимость",
            "Гаражи и машиноместа",
            "Новостройки / от застройщиков",
        ],
    },
    {
        "name": "Работа",
        "slug": "jobs",
        "subcategories": [
            "Вакансии",
            "Резюме",
            "Подработка",
            "Удалённая работа",
            "Работа без опыта",
            "Работа за границей",
        ],
    },
    {
        "name": "Услуги",
        "slug": "services",
        "subcategories": [
            "Ремонт и строительство",
            "Уборка и клининг",
            "Перевозки и доставка",
            "Красота и здоровье",
            "Обучение и репетиторство",
            "IT и дизайн",
            "Фото и видео",
            "Юридические услуги",
            "Прочие услуги",
        ],
    },
    {
        "name": "Личные вещи",
        "slug": "personal",
        "subcategories": [
            "Одежда",
            "Обувь",
            "Аксессуары",
            "Детские вещи",
            "Товары для детей",
            "Украшения",
            "Сумки и чемоданы",
        ],
    },
    {
        "name": "Красота и здоровье",
        "slug": "beauty",
        "subcategories": [
            "Косметика",
            "Парфюмерия",
            "Уход за собой",
            "Медицинские товары",
            "Спорт и здоровье",
        ],
    },
    {
        "name": "Всё для дома и дачи",
        "slug": "home",
        "subcategories": [
            "Мебель",
            "Бытовая техника",
            "Текстиль",
            "Посуда",
            "Декор и интерьер",
            "Сад и огород",
            "Инструменты",
        ],
    },
    {
        "name": "Запчасти и аксессуары",
        "slug": "parts",
        "subcategories": [
            "Автозапчасти",
            "Мото-запчасти",
            "Шины и диски",
            "Аксессуары",
            "Масла и расходники",
        ],
    },
    {
        "name": "Электроника",
        "slug": "electronics",
        "subcategories": [
            "Телефоны",
            "Ноутбуки и компьютеры",
            "ТВ и аудио",
            "Фото и видео техника",
            "Игровые приставки",
            "Аксессуары",
        ],
    },
    {
        "name": "Хобби и спорт",
        "slug": "hobby",
        "subcategories": [
            "Спортивные товары",
            "Велосипеды",
            "Туризм и отдых",
            "Охота и рыбалка",
            "Музыкальные инструменты",
            "Коллекционирование",
        ],
    },
    {
        "name": "Животные",
        "slug": "animals",
        "subcategories": [
            "Сельскохозяйственные животные",
            "Собаки",
            "Кошки",
            "Птицы",
            "Рыбы",
            "Грызуны",
            "Товары для животных",
            "Услуги для животных",
        ],
    },
    {
        "name": "Бизнес и оборудование",
        "slug": "business",
        "subcategories": [
            "Оборудование",
            "Готовый бизнес",
            "Франшизы",
            "Торговое оборудование",
            "Производственное оборудование",
        ],
    },
]


def _slugify(name: str, category_slug: str, index: int) -> str:
    base = name.lower().replace(" ", "-").replace(",", "").replace("/", "-")
    return f"{category_slug}-{index}-{base}"[:90]


async def seed_categories(session: AsyncSession) -> None:
    existing = await session.execute(select(Category.id).limit(1))
    if existing.scalar_one_or_none() is not None:
        return

    for cat_order, cat_data in enumerate(CATEGORIES_DATA):
        category = Category(
            name=cat_data["name"],
            slug=cat_data["slug"],
            sort_order=cat_order,
            is_active=True,
        )
        session.add(category)
        await session.flush()

        for sub_order, sub_name in enumerate(cat_data["subcategories"]):
            subcategory = Subcategory(
                name=sub_name,
                slug=_slugify(sub_name, cat_data["slug"], sub_order),
                sort_order=sub_order,
                is_active=True,
                category_id=category.id,
            )
            session.add(subcategory)

    await session.commit()
