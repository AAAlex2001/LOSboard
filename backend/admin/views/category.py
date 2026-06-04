"""Категории и подкатегории объявлений."""

from sqladmin import ModelView

from admin.views.common import AdminOnly
from models.category import Category, Subcategory


class CategoryAdmin(AdminOnly, ModelView, model=Category):
    name = "категорию"
    name_plural = "Категории"
    icon = "fa-solid fa-layer-group"
    column_list = [
        Category.id,
        Category.name,
        Category.slug,
        Category.sort_order,
        Category.is_active,
    ]
    column_searchable_list = [Category.name, Category.slug]
    column_sortable_list = [Category.id, Category.sort_order, Category.name]
    column_labels = {
        Category.id: "ID",
        Category.name: "Название",
        Category.slug: "Slug",
        Category.sort_order: "Порядок",
        Category.is_active: "Активна",
        Category.subcategories: "Подкатегории",
        Category.advertisements: "Объявления",
    }
    column_details_exclude_list = [Category.advertisements, Category.subcategories]
    form_excluded_columns = [Category.advertisements, Category.subcategories]


class SubcategoryAdmin(AdminOnly, ModelView, model=Subcategory):
    name = "подкатегорию"
    name_plural = "Подкатегории"
    icon = "fa-solid fa-list"
    column_list = [
        Subcategory.id,
        Subcategory.name,
        Subcategory.slug,
        Subcategory.category,
        Subcategory.sort_order,
        Subcategory.is_active,
    ]
    column_searchable_list = [Subcategory.name, Subcategory.slug]
    column_sortable_list = [Subcategory.id, Subcategory.sort_order, Subcategory.name]
    column_labels = {
        Subcategory.id: "ID",
        Subcategory.name: "Название",
        Subcategory.slug: "Slug",
        Subcategory.sort_order: "Порядок",
        Subcategory.is_active: "Активна",
        Subcategory.category_id: "ID категории",
        Subcategory.category: "Категория",
        Subcategory.advertisements: "Объявления",
    }
    column_details_exclude_list = [Subcategory.advertisements]
    form_excluded_columns = [Subcategory.advertisements]
