import os
from datetime import datetime, timedelta

from markupsafe import Markup, escape
from sqladmin import ModelView, action
from sqlalchemy import delete, select, update
from starlette.requests import Request
from starlette.responses import RedirectResponse
from wtforms import SelectField

from models.advertisement import (
    Advertisement,
    LikedAdvertisement,
    MODERATION_APPROVED,
    MODERATION_PENDING,
    MODERATION_REJECTED,
    ViewedAdvertisement,
)
from models.attribute import AdvertisementAttributeValue, Attribute
from models.banner import Banner
from models.category import Category, Subcategory
from models.chat import Conversation, Message, MessageAttachment
from models.complaint import (
    COMPLAINT_DISMISSED,
    COMPLAINT_OPEN,
    COMPLAINT_RESOLVED,
    Complaint,
)
from models.content import ContentPage, FooterLink
from models.user import ADMIN_ROLE, MODERATOR_ROLE, USER_ROLE, User


PERMANENT_BAN_UNTIL = datetime(9999, 12, 31)


def selected_pks(request: Request) -> list[int]:
    raw = request.query_params.get("pks", "")
    return [int(x) for x in raw.split(",") if x.strip().isdigit()]


def redirect_to_list(request: Request, identity: str) -> RedirectResponse:
    return RedirectResponse(request.url_for("admin:list", identity=identity))


class AdminOnly:
    def is_visible(self, request: Request) -> bool:
        return request.session.get("admin_role") == ADMIN_ROLE

    def is_accessible(self, request: Request) -> bool:
        return request.session.get("admin_role") == ADMIN_ROLE


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

COMPLAINT_REASON_CHOICES = [
    ("spam", "Спам"),
    ("wrong_category", "Неверная категория"),
    ("forbidden", "Запрещённый товар"),
    ("fraud", "Мошенничество"),
    ("offensive", "Оскорбительный контент"),
    ("other", "Другое"),
]

ROLE_CHOICES = [
    (USER_ROLE, "Пользователь"),
    (MODERATOR_ROLE, "Модератор"),
    (ADMIN_ROLE, "Администратор"),
]

MODERATION_LABEL = dict(MODERATION_CHOICES)
COMPLAINT_LABEL = dict(COMPLAINT_CHOICES)
COMPLAINT_REASON_LABEL = dict(COMPLAINT_REASON_CHOICES)
ROLE_LABEL = dict(ROLE_CHOICES)


def img_thumb(url: str, *, size: int = 60) -> str:
    safe_url = escape(url)
    return (
        f'<a href="{safe_url}" target="_blank" rel="noreferrer">'
        f'<img src="{safe_url}" alt="" '
        f'style="max-width:{size}px; max-height:{size}px; '
        f'object-fit:cover; border-radius:6px; '
        f'border:1px solid #ddd; margin:2px;" /></a>'
    )


def photo_thumbs(urls, size: int) -> Markup:
    if not urls:
        return Markup('<span style="color:#999">—</span>')
    return Markup(
        '<div style="display:flex; flex-wrap:wrap; gap:4px; max-width:520px;">'
        + "".join(img_thumb(u, size=size) for u in urls)
        + "</div>"
    )


def moderation_badge(status: str) -> Markup:
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


def complaint_badge(status: str) -> Markup:
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


def role_badge(role: str) -> Markup:
    colors = {
        "admin": ("#1565C0", "#FFFFFF"),
        "moderator": ("#6A1B9A", "#FFFFFF"),
        "user": ("#90A4AE", "#FFFFFF"),
    }
    bg, fg = colors.get(role, ("#666", "#FFFFFF"))
    label = ROLE_LABEL.get(role, role or "—")
    return Markup(
        f'<span style="background:{bg}; color:{fg}; padding:2px 8px; '
        f'border-radius:10px; font-size:12px; white-space:nowrap;">{escape(label)}</span>'
    )


def complaint_reason_label(reason: str) -> str:
    return COMPLAINT_REASON_LABEL.get(reason, reason or "—")


def avatar_thumb(url, *, size: int = 40) -> Markup:
    if not url:
        return Markup('<span style="color:#999">—</span>')
    safe_url = escape(url)
    return Markup(
        f'<a href="{safe_url}" target="_blank" rel="noreferrer">'
        f'<img src="{safe_url}" alt="" '
        f'style="width:{size}px; height:{size}px; '
        f'border-radius:50%; object-fit:cover; border:1px solid #ddd;" /></a>'
    )


def user_ads_list(ads) -> Markup:
    if not ads:
        return Markup('<span style="color:#999">У пользователя нет объявлений</span>')
    base = os.environ.get("ADMIN_BASE_URL", "/admin").rstrip("/")
    items = []
    for ad in ads:
        href = f"{base}/advertisement/details/{ad.id}"
        status = MODERATION_LABEL.get(ad.moderation_status, ad.moderation_status or "—")
        items.append(
            f'<li style="padding:4px 0;">'
            f'<a href="{escape(href)}" style="color:#1565C0;">'
            f'#{ad.id} — {escape(ad.title)}'
            f'</a> '
            f'<span style="color:#666; font-size:12px;">'
            f'({escape(status)}, {ad.price} ₽)</span>'
            f'</li>'
        )
    return Markup(
        f'<ul style="list-style:none; padding-left:0; margin:0; max-height:400px; overflow:auto;">'
        f'{"".join(items)}</ul>'
    )


class UserAdmin(AdminOnly, ModelView, model=User):
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
    column_details_list = [
        User.id,
        User.avatar_url,
        User.name,
        User.email,
        User.phone_number,
        User.role,
        User.is_active,
        User.banned_until,
        User.created_at,
        User.advertisements,
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
        User.advertisements: "Объявления",
    }
    column_formatters = {
        User.avatar_url: lambda m, _a: avatar_thumb(m.avatar_url),
        User.role: lambda m, _a: role_badge(m.role),
    }
    column_formatters_detail = {
        User.avatar_url: lambda m, _a: avatar_thumb(m.avatar_url, size=120),
        User.role: lambda m, _a: role_badge(m.role),
        User.advertisements: lambda m, _a: user_ads_list(m.advertisements),
    }
    form_excluded_columns = [
        User.password,
        User.advertisements,
        User.liked_advertisements,
        User.viewed_advertisements,
    ]
    form_overrides = {"role": SelectField}
    form_args = {"role": {"choices": ROLE_CHOICES}}

    async def apply_ban(
        self,
        request: Request,
        until: datetime | None,
    ) -> RedirectResponse:
        pks = selected_pks(request)
        if pks:
            current_admin = request.session.get("admin_user_id")
            safe_pks = [p for p in pks if p != current_admin]
            if safe_pks:
                async with self.session_maker() as session:
                    await session.execute(
                        update(User)
                        .where(User.id.in_(safe_pks))
                        .values(banned_until=until)
                    )
                    await session.commit()
        return redirect_to_list(request, self.identity)

    @action(
        name="ban_7d",
        label="Забанить на 7 дней",
        confirmation_message="Забанить выбранных пользователей на 7 дней?",
    )
    async def ban_7d_action(self, request: Request) -> RedirectResponse:
        return await self.apply_ban(request, datetime.utcnow() + timedelta(days=7))

    @action(
        name="ban_30d",
        label="Забанить на 30 дней",
        confirmation_message="Забанить выбранных пользователей на 30 дней?",
    )
    async def ban_30d_action(self, request: Request) -> RedirectResponse:
        return await self.apply_ban(request, datetime.utcnow() + timedelta(days=30))

    @action(
        name="ban_forever",
        label="Забанить навсегда",
        confirmation_message="Забанить выбранных пользователей навсегда?",
    )
    async def ban_forever_action(self, request: Request) -> RedirectResponse:
        return await self.apply_ban(request, PERMANENT_BAN_UNTIL)

    @action(
        name="unban",
        label="Снять бан",
        confirmation_message="Снять бан с выбранных пользователей?",
    )
    async def unban_action(self, request: Request) -> RedirectResponse:
        return await self.apply_ban(request, None)

    @action(
        name="delete_ads",
        label="Удалить все объявления юзера",
        confirmation_message="Удалить ВСЕ объявления выбранных пользователей? Действие необратимо.",
    )
    async def delete_ads_action(self, request: Request) -> RedirectResponse:
        pks = selected_pks(request)
        if pks:
            async with self.session_maker() as session:
                await session.execute(
                    delete(Advertisement).where(Advertisement.owner_id.in_(pks))
                )
                await session.commit()
        return redirect_to_list(request, self.identity)


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
    column_searchable_list = [
        Advertisement.title,
        Advertisement.location,
        Advertisement.id,
        "owner.email",
        "owner.name",
        "category.name",
        "subcategory.name",
    ]
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
        Advertisement.photo_urls: lambda m, _a: photo_thumbs(
            m.photo_urls or [], size=60
        ),
        Advertisement.moderation_status: lambda m, _a: moderation_badge(
            m.moderation_status
        ),
    }
    column_formatters_detail = {
        Advertisement.photo_urls: lambda m, _a: photo_thumbs(
            m.photo_urls or [], size=180
        ),
        Advertisement.moderation_status: lambda m, _a: moderation_badge(
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
    form_overrides = {"moderation_status": SelectField}
    form_args = {"moderation_status": {"choices": MODERATION_CHOICES}}
    column_default_sort = [("created_at", True)]

    async def apply_moderation(
        self,
        request: Request,
        status: str,
        reason: str | None,
    ) -> RedirectResponse:
        pks = selected_pks(request)
        if pks:
            async with self.session_maker() as session:
                await session.execute(
                    update(Advertisement)
                    .where(Advertisement.id.in_(pks))
                    .values(
                        moderation_status=status,
                        moderation_reason=reason,
                        moderated_at=datetime.utcnow(),
                        moderated_by_id=request.session.get("admin_user_id"),
                    )
                )
                await session.commit()
        return redirect_to_list(request, self.identity)

    @action(
        name="approve",
        label="Одобрить",
        confirmation_message="Одобрить выбранные объявления?",
        add_in_detail=True,
        add_in_list=True,
    )
    async def approve_action(self, request: Request) -> RedirectResponse:
        return await self.apply_moderation(request, MODERATION_APPROVED, None)

    @action(
        name="reject_spam",
        label="Отклонить — спам",
        confirmation_message="Отклонить как спам?",
    )
    async def reject_spam_action(self, request: Request) -> RedirectResponse:
        return await self.apply_moderation(request, MODERATION_REJECTED, "Спам")

    @action(
        name="reject_wrong_category",
        label="Отклонить — неверная категория",
        confirmation_message="Отклонить из-за неверной категории?",
    )
    async def reject_wrong_category_action(
        self, request: Request
    ) -> RedirectResponse:
        return await self.apply_moderation(
            request, MODERATION_REJECTED, "Неверная категория"
        )

    @action(
        name="reject_forbidden",
        label="Отклонить — запрещённый товар",
        confirmation_message="Отклонить как запрещённый товар?",
    )
    async def reject_forbidden_action(self, request: Request) -> RedirectResponse:
        return await self.apply_moderation(
            request, MODERATION_REJECTED, "Запрещённый товар"
        )

    @action(
        name="reject_other",
        label="Отклонить — прочее",
        confirmation_message="Отклонить (общая причина)?",
    )
    async def reject_other_action(self, request: Request) -> RedirectResponse:
        return await self.apply_moderation(
            request, MODERATION_REJECTED, "Нарушение правил площадки"
        )


class ModerationQueueAdmin(AdvertisementAdmin, model=Advertisement):
    name = "элемент очереди"
    name_plural = "Очередь модерации"
    identity = "moderation-queue"
    icon = "fa-solid fa-hourglass-half"
    can_create = False
    can_delete = False

    def list_query(self, request: Request):
        return (
            select(Advertisement)
            .where(Advertisement.moderation_status == MODERATION_PENDING)
            .order_by(Advertisement.created_at.asc())
        )


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
        Complaint.status: lambda m, _a: complaint_badge(m.status),
        Complaint.reason: lambda m, _a: complaint_reason_label(m.reason),
    }
    column_formatters_detail = {
        Complaint.status: lambda m, _a: complaint_badge(m.status),
        Complaint.reason: lambda m, _a: complaint_reason_label(m.reason),
    }
    form_overrides = {
        "status": SelectField,
        "reason": SelectField,
    }
    form_args = {
        "status": {"choices": COMPLAINT_CHOICES},
        "reason": {"choices": COMPLAINT_REASON_CHOICES},
    }
    column_default_sort = [("created_at", True)]

    async def apply_resolution(
        self, request: Request, status: str
    ) -> RedirectResponse:
        pks = selected_pks(request)
        if pks:
            async with self.session_maker() as session:
                await session.execute(
                    update(Complaint)
                    .where(Complaint.id.in_(pks))
                    .values(
                        status=status,
                        resolved_at=datetime.utcnow(),
                        resolved_by_id=request.session.get("admin_user_id"),
                    )
                )
                await session.commit()
        return redirect_to_list(request, self.identity)

    @action(
        name="resolve",
        label="Закрыть (нарушение подтверждено)",
        confirmation_message="Закрыть жалобы как подтверждённые?",
    )
    async def resolve_action(self, request: Request) -> RedirectResponse:
        return await self.apply_resolution(request, COMPLAINT_RESOLVED)

    @action(
        name="dismiss",
        label="Отклонить жалобу",
        confirmation_message="Отклонить выбранные жалобы?",
    )
    async def dismiss_action(self, request: Request) -> RedirectResponse:
        return await self.apply_resolution(request, COMPLAINT_DISMISSED)


class LikedAdvertisementAdmin(AdminOnly, ModelView, model=LikedAdvertisement):
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


class ViewedAdvertisementAdmin(AdminOnly, ModelView, model=ViewedAdvertisement):
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


class ConversationAdmin(AdminOnly, ModelView, model=Conversation):
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


class MessageAdmin(AdminOnly, ModelView, model=Message):
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


class MessageAttachmentAdmin(AdminOnly, ModelView, model=MessageAttachment):
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


ATTRIBUTE_KIND_CHOICES = [
    ("text", "Текст"),
    ("number", "Число"),
    ("select", "Выбор из списка"),
    ("boolean", "Да/Нет"),
]


class ContentPageAdmin(AdminOnly, ModelView, model=ContentPage):
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
        ContentPage.slug: "Slug",
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

    async def on_model_change(self, data, model, is_created, request):
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


def banner_image_thumb(model, _attr) -> Markup:
    if not model.image_url:
        return Markup('<span style="color:#999">—</span>')
    return Markup(img_thumb(model.image_url, size=80))


class BannerAdmin(AdminOnly, ModelView, model=Banner):
    name = "баннер"
    name_plural = "Баннеры"
    icon = "fa-solid fa-image"
    column_list = [
        Banner.id,
        Banner.image_url,
        Banner.title,
        Banner.link_url,
        Banner.sort_order,
        Banner.is_active,
        Banner.starts_at,
        Banner.ends_at,
    ]
    column_searchable_list = [Banner.title, Banner.description, Banner.link_url]
    column_sortable_list = [
        Banner.id,
        Banner.sort_order,
        Banner.is_active,
        Banner.starts_at,
        Banner.ends_at,
        Banner.created_at,
    ]
    column_labels = {
        Banner.id: "ID",
        Banner.title: "Название",
        Banner.description: "Описание",
        Banner.image_url: "Картинка",
        Banner.link_url: "Ссылка",
        Banner.sort_order: "Порядок",
        Banner.is_active: "Активен",
        Banner.starts_at: "Старт показа",
        Banner.ends_at: "Конец показа",
        Banner.created_at: "Создан",
    }
    column_formatters = {Banner.image_url: banner_image_thumb}
    column_formatters_detail = {
        Banner.image_url: lambda m, _a: Markup(img_thumb(m.image_url, size=300))
    }
    column_default_sort = [("sort_order", False)]


class AttributeAdmin(AdminOnly, ModelView, model=Attribute):
    name = "атрибут"
    name_plural = "Атрибуты категорий"
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
        Attribute.name: "Название",
        Attribute.key: "Ключ (slug)",
        Attribute.kind: "Тип",
        Attribute.options: "Варианты (для «Выбор из списка», JSON-массив строк)",
        Attribute.is_required: "Обязательный",
        Attribute.sort_order: "Порядок",
        Attribute.category: "Категория",
        Attribute.subcategory: "Подкатегория",
        Attribute.category_id: "ID категории",
        Attribute.subcategory_id: "ID подкатегории",
        Attribute.created_at: "Создан",
    }
    form_overrides = {"kind": SelectField}
    form_args = {"kind": {"choices": ATTRIBUTE_KIND_CHOICES}}
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
