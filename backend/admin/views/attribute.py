"""Динамические доп. поля объявлений по категориям."""

from sqladmin import ModelView
from wtforms import SelectField

from admin.views.common import ATTRIBUTE_KIND_CHOICES, AdminOnly
from models.attribute import AdvertisementAttributeValue, Attribute


class AttributeAdmin(AdminOnly, ModelView, model=Attribute):
    """Доп. поля, появляющиеся в форме создания объявления для конкретной категории.

    Пример: в «Автомобили» добавляем «Марка» (выбор из списка), «Год выпуска» (число).
    Когда пользователь выбирает категорию при создании объявления, форма автоматически
    показывает эти поля.
    """

    name = "поле объявления"
    name_plural = "Доп. поля объявлений"
    icon = "fa-solid fa-sliders"
    column_list = [
        Attribute.id,
        Attribute.name,
        Attribute.key,
        Attribute.kind,
        Attribute.is_required,
        Attribute.category,
        Attribute.subcategory,
        Attribute.sort_order,
    ]
    column_searchable_list = [
        Attribute.name,
        Attribute.key,
        "category.name",
        "subcategory.name",
    ]
    column_sortable_list = [
        Attribute.id,
        Attribute.name,
        Attribute.key,
        Attribute.kind,
        Attribute.is_required,
        Attribute.sort_order,
    ]
    column_labels = {
        Attribute.id: "ID",
        Attribute.name: "Название (как видит пользователь)",
        Attribute.key: "Технический ключ (латиница, например «brand»)",
        Attribute.kind: "Тип значения",
        Attribute.options: "Варианты для типа «Выбор из списка»",
        Attribute.is_required: "Обязательное поле",
        Attribute.sort_order: "Порядок (меньше — выше)",
        Attribute.category: "Категория",
        Attribute.subcategory: "Подкатегория",
        Attribute.category_id: "ID категории",
        Attribute.subcategory_id: "ID подкатегории",
        Attribute.created_at: "Создано",
    }
    form_overrides = {"kind": SelectField}
    form_args = {
        "name": {
            "description": "Как поле подписано в форме объявления, например «Марка авто».",
        },
        "key": {
            "description": "Латиница без пробелов: brand, year, fuel. "
            "Используется как ID поля внутри системы.",
        },
        "kind": {
            "choices": ATTRIBUTE_KIND_CHOICES,
            "description": "Текст — обычное поле ввода. Число — только цифры. "
            "Выбор из списка — селект с вариантами ниже. Да/Нет — тогл.",
        },
        "options": {
            "description": "Только для «Выбор из списка»: JSON-массив строк, например "
            '["BMW","Mercedes","Audi"].',
        },
        "category": {
            "description": "Если выбрано — поле появится для всей категории. "
            "Можно оставить пустым, если поле общее для подкатегории.",
        },
        "subcategory": {
            "description": "Если выбрано — поле появится только в этой подкатегории.",
        },
        "is_required": {
            "description": "Если включено — без этого поля нельзя опубликовать объявление.",
        },
    }
    column_default_sort = [("sort_order", False)]


class AdvertisementAttributeValueAdmin(
    AdminOnly, ModelView, model=AdvertisementAttributeValue
):
    name = "значение атрибута"
    name_plural = "Значения атрибутов"
    icon = "fa-solid fa-tags"
    column_list = [
        AdvertisementAttributeValue.id,
        AdvertisementAttributeValue.advertisement,
        AdvertisementAttributeValue.attribute,
        AdvertisementAttributeValue.value,
    ]
    column_labels = {
        AdvertisementAttributeValue.id: "ID",
        AdvertisementAttributeValue.advertisement_id: "ID объявления",
        AdvertisementAttributeValue.attribute_id: "ID атрибута",
        AdvertisementAttributeValue.advertisement: "Объявление",
        AdvertisementAttributeValue.attribute: "Атрибут",
        AdvertisementAttributeValue.value: "Значение",
    }
