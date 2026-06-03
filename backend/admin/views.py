from markupsafe import Markup, escape
from sqladmin import ModelView

from models.advertisement import (
    Advertisement,
    LikedAdvertisement,
    MODERATION_APPROVED,
    MODERATION_PENDING,
    MODERATION_REJECTED,
    ViewedAdvertisement,
)
from models.category import Category, Subcategory
from models.chat import Conversation, Message, MessageAttachment
from models.complaint import (
    COMPLAINT_DISMISSED,
    COMPLAINT_OPEN,
    COMPLAINT_RESOLVED,
    Complaint,
)
from models.user import ALLOWED_ROLES, User


MODERATION_CHOICES = [
    (MODERATION_PENDING, "Ожидает модерации"),
    (MODERATION_APPROVED, "Одобрено"),
    (MODERATION_REJECTED, "Отклонено"),
]

COMPLAINT_CHOICES = [
    (COMPLAINT_OPEN, "Открыта"),
    (COMPLAINT_RESOLVED, "Закрыта (нарушение подтверждено)"),
    (COMPLAINT_DISMISSED, "Отклонена"),
]

ROLE_CHOICES = [(r, r) for r in ALLOWED_ROLES]

MODERATION_LABEL = dict(MODERATION_CHOICES)
COMPLAINT_LABEL = dict(COMPLAINT_CHOICES)


def _img_thumb(url: str, *, size: int = 60) -> str:
    safe_url = escape(url)
    return (
        f'<a href="{safe_url}" target="_blank" rel="noreferrer">'
        f'<img src="{safe_url}" alt="" '
        f'style="max-width:{size}px; max-height:{size}px; '
        f'object-fit:cover; border-radius:6px; '
        f'border:1px solid #ddd; margin:2px;" /></a>'
    )


def _photo_urls_thumbnails(urls, size: int) -> Markup:
    if not urls:
        return Markup('<span style="color:#999">—</span>')
    return Markup(
        '<div style="display:flex; flex-wrap:wrap; gap:4px; max-width:520px;">'
        + "".join(_img_thumb(u, size=size) for u in urls)
        + "</div>"
    )


def _moderation_badge(status: str) -> Markup:
    colors = {
        MODERATION_PENDING: ("#FFB300", "#FFFFFF"),
        MODERATION_APPROVED: ("#2E7D32", "#FFFFFF"),
        MODERATION_REJECTED: ("#C62828", "#FFFFFF"),
    }
    bg, fg = colors.get(status, ("#666", "#FFFFFF"))
    label = MODERATION_LABEL.get(status, status or "—")
    return Markup(
        f'<span style="background:{bg}; color:{fg}; padding:2px 8px; '
        f'border-radius:10px; font-size:12px; white-space:nowrap;">{escape(label)}</span>'
    )


def _complaint_badge(status: str) -> Markup:
    colors = {
        COMPLAINT_OPEN: ("#FB8C00", "#FFFFFF"),
        COMPLAINT_RESOLVED: ("#2E7D32", "#FFFFFF"),
        COMPLAINT_DISMISSED: ("#616161", "#FFFFFF"),
    }
    bg, fg = colors.get(status, ("#666", "#FFFFFF"))
    label = COMPLAINT_LABEL.get(status, status or "—")
    return Markup(
        f'<span style="background:{bg}; color:{fg}; padding:2px 8px; '
        f'border-radius:10px; font-size:12px; white-space:nowrap;">{escape(label)}</span>'
    )


def _role_badge(role: str) -> Markup:
    colors = {
        "admin": ("#1565C0", "#FFFFFF"),
        "moderator": ("#6A1B9A", "#FFFFFF"),
        "user": ("#90A4AE", "#FFFFFF"),
    }
    bg, fg = colors.get(role, ("#666", "#FFFFFF"))
    return Markup(
        f'<span style="background:{bg}; color:{fg}; padding:2px 8px; '
        f'border-radius:10px; font-size:12px; white-space:nowrap;">{escape(role or "—")}</span>'
    )


def _avatar_thumb(url, *, size: int = 40) -> Markup:
    if not url:
        return Markup('<span style="color:#999">—</span>')
    safe_url = escape(url)
    return Markup(
        f'<a href="{safe_url}" target="_blank" rel="noreferrer">'
        f'<img src="{safe_url}" alt="" '
        f'style="width:{size}px; height:{size}px; '
        f'border-radius:50%; object-fit:cover; border:1px solid #ddd;" /></a>'
    )


class UserAdmin(ModelView, model=User):
    name = "пользователь"
    name_plural = "Пользователи"
    icon = "fa-solid fa-users"
    column_list = [
        User.id,
        User.avatar_url,
        User.name,
        User.email,
        User.phone_number,
        User.is_active,
        User.role,
        User.banned_until,
        User.created_at,
    ]
    column_details_exclude_list = [
        User.password,
        User.token_version,
        User.advertisements,
        User.liked_advertisements,
        User.viewed_advertisements,
    ]
    column_searchable_list = [User.name, User.email, User.phone_number]
    column_sortable_list = [
        User.id, User.name, User.email, User.role, User.created_at, User.is_active
    ]
    column_labels = {
        User.id: "ID",
        User.name: "Имя",
        User.email: "Email",
        User.phone_number: "Телефон",
        User.avatar_url: "Аватар",
        User.is_active: "Активен",
        User.role: "Роль",
        User.banned_until: "Бан до",
        User.created_at: "Зарегистрирован",
        User.token_version: "Версия токена",
    }
    column_formatters = {
        User.avatar_url: lambda m, _a: _avatar_thumb(m.avatar_url),
        User.role: lambda m, _a: _role_badge(m.role),
    }
    column_formatters_detail = {
        User.avatar_url: lambda m, _a: _avatar_thumb(m.avatar_url, size=120),
        User.role: lambda m, _a: _role_badge(m.role),
    }
    form_excluded_columns = [
        User.password,
        User.advertisements,
        User.liked_advertisements,
        User.viewed_advertisements,
    ]
    form_choices = {"role": ROLE_CHOICES}


class CategoryAdmin(ModelView, model=Category):
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


class SubcategoryAdmin(ModelView, model=Subcategory):
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


class AdvertisementAdmin(ModelView, model=Advertisement):
    name = "объявление"
    name_plural = "Объявления"
    icon = "fa-solid fa-rectangle-ad"
    column_list = [
        Advertisement.id,
        Advertisement.photo_urls,
        Advertisement.title,
        Advertisement.price,
        Advertisement.moderation_status,
        Advertisement.is_active,
        Advertisement.is_urgent,
        Advertisement.owner,
        Advertisement.category,
        Advertisement.subcategory,
        Advertisement.created_at,
    ]
    column_searchable_list = [Advertisement.title, Advertisement.location]
    column_sortable_list = [
        Advertisement.id,
        Advertisement.price,
        Advertisement.created_at,
        Advertisement.likes_count,
        Advertisement.views_count,
        Advertisement.moderation_status,
        Advertisement.is_active,
    ]
    column_labels = {
        Advertisement.id: "ID",
        Advertisement.title: "Название",
        Advertisement.description: "Описание",
        Advertisement.price: "Цена",
        Advertisement.location: "Локация",
        Advertisement.photo_urls: "Фото",
        Advertisement.is_active: "Активно",
        Advertisement.is_urgent: "Срочное",
        Advertisement.created_at: "Создано",
        Advertisement.likes_count: "Лайки",
        Advertisement.views_count: "Просмотры",
        Advertisement.moderation_status: "Статус модерации",
        Advertisement.moderation_reason: "Причина",
        Advertisement.moderated_at: "Промодерировано",
        Advertisement.moderated_by: "Кто промодерировал",
        Advertisement.moderated_by_id: "ID модератора",
        Advertisement.owner_id: "ID владельца",
        Advertisement.category_id: "ID категории",
        Advertisement.subcategory_id: "ID подкатегории",
        Advertisement.owner: "Владелец",
        Advertisement.category: "Категория",
        Advertisement.subcategory: "Подкатегория",
        Advertisement.liked_by_users: "Лайки",
        Advertisement.viewed_by_users: "Просмотры (пользователи)",
    }
    column_formatters = {
        Advertisement.photo_urls: lambda m, _a: _photo_urls_thumbnails(
            m.photo_urls or [], size=60
        ),
        Advertisement.moderation_status: lambda m, _a: _moderation_badge(
            m.moderation_status
        ),
    }
    column_formatters_detail = {
        Advertisement.photo_urls: lambda m, _a: _photo_urls_thumbnails(
            m.photo_urls or [], size=180
        ),
        Advertisement.moderation_status: lambda m, _a: _moderation_badge(
            m.moderation_status
        ),
    }
    column_details_exclude_list = [
        Advertisement.liked_by_users,
        Advertisement.viewed_by_users,
    ]
    form_excluded_columns = [
        Advertisement.liked_by_users,
        Advertisement.viewed_by_users,
    ]
    form_choices = {"moderation_status": MODERATION_CHOICES}


class ComplaintAdmin(ModelView, model=Complaint):
    name = "жалобу"
    name_plural = "Жалобы"
    icon = "fa-solid fa-flag"
    column_list = [
        Complaint.id,
        Complaint.advertisement,
        Complaint.reporter,
        Complaint.reason,
        Complaint.status,
        Complaint.created_at,
    ]
    column_sortable_list = [Complaint.id, Complaint.created_at, Complaint.status]
    column_searchable_list = [Complaint.reason, Complaint.comment]
    column_labels = {
        Complaint.id: "ID",
        Complaint.advertisement_id: "ID объявления",
        Complaint.advertisement: "Объявление",
        Complaint.reporter_id: "ID жалующегося",
        Complaint.reporter: "Жалуется",
        Complaint.reason: "Причина",
        Complaint.comment: "Комментарий",
        Complaint.status: "Статус",
        Complaint.created_at: "Создано",
        Complaint.resolved_at: "Закрыто",
        Complaint.resolved_by_id: "ID закрывшего",
        Complaint.resolved_by: "Закрыл",
    }
    column_formatters = {
        Complaint.status: lambda m, _a: _complaint_badge(m.status),
    }
    column_formatters_detail = {
        Complaint.status: lambda m, _a: _complaint_badge(m.status),
    }
    form_choices = {"status": COMPLAINT_CHOICES}


class LikedAdvertisementAdmin(ModelView, model=LikedAdvertisement):
    name = "лайк"
    name_plural = "Лайки объявлений"
    icon = "fa-solid fa-heart"
    column_list = [
        LikedAdvertisement.id,
        LikedAdvertisement.user,
        LikedAdvertisement.advertisement,
    ]
    column_sortable_list = [LikedAdvertisement.id]
    column_labels = {
        LikedAdvertisement.id: "ID",
        LikedAdvertisement.user_id: "ID пользователя",
        LikedAdvertisement.advertisement_id: "ID объявления",
        LikedAdvertisement.user: "Пользователь",
        LikedAdvertisement.advertisement: "Объявление",
    }


class ViewedAdvertisementAdmin(ModelView, model=ViewedAdvertisement):
    name = "просмотр"
    name_plural = "Просмотры объявлений"
    icon = "fa-solid fa-eye"
    column_list = [
        ViewedAdvertisement.id,
        ViewedAdvertisement.user,
        ViewedAdvertisement.advertisement,
        ViewedAdvertisement.viewed_at,
    ]
    column_sortable_list = [ViewedAdvertisement.id, ViewedAdvertisement.viewed_at]
    column_labels = {
        ViewedAdvertisement.id: "ID",
        ViewedAdvertisement.user_id: "ID пользователя",
        ViewedAdvertisement.advertisement_id: "ID объявления",
        ViewedAdvertisement.viewed_at: "Просмотрено",
        ViewedAdvertisement.user: "Пользователь",
        ViewedAdvertisement.advertisement: "Объявление",
    }


class ConversationAdmin(ModelView, model=Conversation):
    name = "диалог"
    name_plural = "Диалоги"
    icon = "fa-solid fa-comments"
    column_list = [
        Conversation.id,
        Conversation.advertisement,
        Conversation.buyer,
        Conversation.seller,
        Conversation.created_at,
        Conversation.last_message_at,
    ]
    column_sortable_list = [
        Conversation.id,
        Conversation.created_at,
        Conversation.last_message_at,
    ]
    column_labels = {
        Conversation.id: "ID",
        Conversation.advertisement_id: "ID объявления",
        Conversation.buyer_id: "ID покупателя",
        Conversation.seller_id: "ID продавца",
        Conversation.created_at: "Создано",
        Conversation.last_message_at: "Последнее сообщение",
        Conversation.advertisement: "Объявление",
        Conversation.buyer: "Покупатель",
        Conversation.seller: "Продавец",
        Conversation.messages: "Сообщения",
    }
    column_details_exclude_list = [Conversation.messages]
    form_excluded_columns = [Conversation.messages]


class MessageAdmin(ModelView, model=Message):
    name = "сообщение"
    name_plural = "Сообщения"
    icon = "fa-solid fa-message"
    column_list = [
        Message.id,
        Message.conversation,
        Message.sender,
        Message.text,
        Message.created_at,
        Message.is_read,
    ]
    column_searchable_list = [Message.text]
    column_sortable_list = [Message.id, Message.created_at, Message.is_read]
    column_labels = {
        Message.id: "ID",
        Message.conversation_id: "ID диалога",
        Message.sender_id: "ID отправителя",
        Message.text: "Текст",
        Message.created_at: "Создано",
        Message.is_read: "Прочитано",
        Message.conversation: "Диалог",
        Message.sender: "Отправитель",
        Message.attachments: "Вложения",
    }
    column_details_exclude_list = [Message.attachments]
    form_excluded_columns = [Message.attachments]


class MessageAttachmentAdmin(ModelView, model=MessageAttachment):
    name = "вложение"
    name_plural = "Вложения сообщений"
    icon = "fa-solid fa-paperclip"
    column_list = [
        MessageAttachment.id,
        MessageAttachment.message,
        MessageAttachment.filename,
        MessageAttachment.kind,
        MessageAttachment.mime_type,
        MessageAttachment.size_bytes,
    ]
    column_searchable_list = [MessageAttachment.filename, MessageAttachment.mime_type]
    column_sortable_list = [MessageAttachment.id, MessageAttachment.size_bytes]
    column_labels = {
        MessageAttachment.id: "ID",
        MessageAttachment.message_id: "ID сообщения",
        MessageAttachment.url: "URL",
        MessageAttachment.filename: "Имя файла",
        MessageAttachment.kind: "Тип",
        MessageAttachment.mime_type: "MIME-тип",
        MessageAttachment.size_bytes: "Размер, байт",
        MessageAttachment.message: "Сообщение",
    }
