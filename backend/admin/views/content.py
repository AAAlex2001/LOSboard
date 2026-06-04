"""Контент-страницы, ссылки футера, глобальные настройки сайта."""

from sqladmin import ModelView
from starlette.requests import Request

from admin.views.common import AdminOnly
from models.content import ContentPage, FooterLink, SiteSettings


class ContentPageAdmin(AdminOnly, ModelView, model=ContentPage):
    """Редактируемые из админки страницы (`/docs/<slug>`, `/contacts`, `/advertising`)."""

    name = "страницу"
    name_plural = "Контент-страницы"
    icon = "fa-solid fa-file-lines"
    column_list = [
        ContentPage.id,
        ContentPage.slug,
        ContentPage.title,
        ContentPage.is_published,
        ContentPage.updated_at,
        ContentPage.updated_by,
    ]
    column_searchable_list = [ContentPage.slug, ContentPage.title]
    column_sortable_list = [
        ContentPage.id,
        ContentPage.slug,
        ContentPage.updated_at,
        ContentPage.is_published,
    ]
    column_labels = {
        ContentPage.id: "ID",
        ContentPage.slug: "Slug (часть URL после /docs/)",
        ContentPage.title: "Заголовок",
        ContentPage.body: "Содержимое",
        ContentPage.is_published: "Опубликована",
        ContentPage.updated_at: "Обновлено",
        ContentPage.updated_by: "Кто обновил",
        ContentPage.updated_by_id: "ID редактора",
    }
    column_default_sort = [("updated_at", True)]
    form_excluded_columns = [
        ContentPage.updated_at,
        ContentPage.updated_by,
        ContentPage.updated_by_id,
    ]
    form_widget_args = {
        "body": {"class": "rich-editor", "rows": 20},
    }
    form_args = {
        "slug": {
            "description": "Латиница, без пробелов: `privacy`, `contacts`, `pricing`. "
            "Страница будет доступна по URL `/docs/<slug>` или (для contacts/pricing) "
            "на соответствующих страницах фронта.",
        },
        "body": {
            "description": "Используй визуальный редактор: заголовки, списки, ссылки, "
            "выделение текста.",
        },
    }

    async def on_model_change(
        self, data: dict, model: ContentPage, is_created: bool, request: Request
    ) -> None:
        admin_id = request.session.get("admin_user_id")
        if admin_id:
            data["updated_by_id"] = admin_id


class FooterLinkAdmin(AdminOnly, ModelView, model=FooterLink):
    name = "ссылку"
    name_plural = "Футер"
    icon = "fa-solid fa-link"
    column_list = [
        FooterLink.id,
        FooterLink.title,
        FooterLink.url,
        FooterLink.sort_order,
        FooterLink.is_active,
    ]
    column_searchable_list = [FooterLink.title, FooterLink.url]
    column_sortable_list = [
        FooterLink.id,
        FooterLink.sort_order,
        FooterLink.title,
        FooterLink.is_active,
    ]
    column_labels = {
        FooterLink.id: "ID",
        FooterLink.title: "Название",
        FooterLink.url: "Ссылка",
        FooterLink.sort_order: "Порядок",
        FooterLink.is_active: "Активна",
    }
    column_default_sort = [("sort_order", False)]


class SiteSettingsAdmin(AdminOnly, ModelView, model=SiteSettings):
    """Глобальные настройки сайта: бренд, описание, копирайт, ссылки на соцсети.

    Существует одна-единственная строка — её редактируешь, остальное удалять/создавать не надо.
    """

    name = "настройки сайта"
    name_plural = "Настройки сайта"
    icon = "fa-solid fa-gear"
    can_create = False
    can_delete = False
    column_list = [
        SiteSettings.id,
        SiteSettings.brand_title,
        SiteSettings.about_title,
        SiteSettings.copyright_line,
    ]
    column_labels = {
        SiteSettings.id: "ID",
        SiteSettings.brand_title: "Заголовок бренда (футер)",
        SiteSettings.brand_subtitle: "Подзаголовок бренда (футер)",
        SiteSettings.about_title: "«О сервисе» — заголовок",
        SiteSettings.about_text: "«О сервисе» — текст",
        SiteSettings.socials_title: "Подпись над соцсетями",
        SiteSettings.telegram_url: "Ссылка на Telegram",
        SiteSettings.instagram_url: "Ссылка на Instagram",
        SiteSettings.facebook_url: "Ссылка на Facebook",
        SiteSettings.copyright_line: "Копирайт внизу страницы",
    }
    form_args = {
        "telegram_url": {"description": "Пусто = иконка скрыта"},
        "instagram_url": {"description": "Пусто = иконка скрыта"},
        "facebook_url": {"description": "Пусто = иконка скрыта"},
    }
