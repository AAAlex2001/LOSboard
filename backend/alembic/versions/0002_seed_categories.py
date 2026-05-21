"""seed categories and subcategories

Revision ID: 0002_seed_categories
Revises: 0001_initial_schema
Create Date: 2026-05-21 00:00:01.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0002_seed_categories"
down_revision: Union[str, None] = "0001_initial_schema"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


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


def upgrade() -> None:
    conn = op.get_bind()
    categories_table = sa.table(
        "categories",
        sa.column("id", sa.Integer()),
        sa.column("name", sa.String()),
        sa.column("slug", sa.String()),
        sa.column("sort_order", sa.Integer()),
        sa.column("is_active", sa.Boolean()),
    )
    subcategories_table = sa.table(
        "subcategories",
        sa.column("id", sa.Integer()),
        sa.column("name", sa.String()),
        sa.column("slug", sa.String()),
        sa.column("sort_order", sa.Integer()),
        sa.column("is_active", sa.Boolean()),
        sa.column("category_id", sa.Integer()),
    )

    for cat_order, cat_data in enumerate(CATEGORIES_DATA):
        result = conn.execute(
            categories_table.insert()
            .values(
                name=cat_data["name"],
                slug=cat_data["slug"],
                sort_order=cat_order,
                is_active=True,
            )
            .returning(categories_table.c.id)
        )
        category_id = result.scalar_one()

        subcategory_rows = [
            {
                "name": sub_name,
                "slug": _slugify(sub_name, cat_data["slug"], sub_order),
                "sort_order": sub_order,
                "is_active": True,
                "category_id": category_id,
            }
            for sub_order, sub_name in enumerate(cat_data["subcategories"])
        ]
        conn.execute(subcategories_table.insert(), subcategory_rows)


def downgrade() -> None:
    conn = op.get_bind()
    conn.execute(sa.text("DELETE FROM subcategories"))
    conn.execute(sa.text("DELETE FROM categories"))
