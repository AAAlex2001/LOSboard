"""Диалоги, сообщения, вложения. Только просмотр (для админа)."""

import re
from typing import Any

from markupsafe import Markup, escape
from sqladmin import ModelView

from admin.views.common import AdminOnly, img_thumb
from models.chat import Conversation, Message, MessageAttachment


CHAT_URL_PATTERN = re.compile(r"^/conversations/(\d+)/attachments/(.+)$")


def attachment_public_url(stored_url: str | None) -> str | None:
    """Парсит `/conversations/X/attachments/Y` → `/static/uploads/chat/X/Y`.

    Это публично смонтированный путь (`UPLOADS_DIR` в main.py), поэтому
    превью открывается прямо из админки в новой вкладке без отдельного auth-обхода.
    """
    if not stored_url:
        return None
    match = CHAT_URL_PATTERN.match(stored_url)
    if not match:
        return stored_url
    conv_id, filename = match.group(1), match.group(2)
    return f"/static/uploads/chat/{conv_id}/{filename}"


def attachment_preview(model: Any, _attr: Any) -> Markup:
    """Картинка → миниатюра-ссылка. Видео/документ → иконка + кликабельное имя."""
    url = attachment_public_url(model.url)
    if not url:
        return Markup('<span style="color:#999">—</span>')

    if model.kind == "image":
        return Markup(img_thumb(url, size=80))

    icon = {"video": "🎬", "document": "📄"}.get(model.kind, "📎")
    return Markup(
        f'<a href="{escape(url)}" target="_blank" rel="noreferrer" '
        f'style="color:#1565C0; text-decoration:none;">'
        f"{icon} {escape(model.filename or 'файл')}"
        f"</a>"
    )


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
    form_excluded_columns = [Message.attachments]
    column_formatters_detail = {Message.attachments: lambda m, _a: message_attachments_block(m)}


def message_attachments_block(model: Any) -> Markup:
    """Список вложений сообщения с превью для админ-детали."""
    items = list(model.attachments or [])
    if not items:
        return Markup('<span style="color:#999">Без вложений</span>')
    parts = [attachment_preview(att, None) for att in items]
    return Markup(
        '<div style="display:flex; flex-wrap:wrap; gap:8px;">'
        + "".join(str(p) for p in parts)
        + "</div>"
    )


class MessageAttachmentAdmin(AdminOnly, ModelView, model=MessageAttachment):
    name = "вложение"
    name_plural = "Вложения сообщений"
    icon = "fa-solid fa-paperclip"
    column_list = [
        MessageAttachment.id,
        MessageAttachment.url,
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
        MessageAttachment.url: "Файл (клик — открыть)",
        MessageAttachment.filename: "Имя файла",
        MessageAttachment.kind: "Тип",
        MessageAttachment.mime_type: "MIME-тип",
        MessageAttachment.size_bytes: "Размер, байт",
        MessageAttachment.message: "Сообщение",
    }
    column_formatters = {MessageAttachment.url: attachment_preview}
    column_formatters_detail = {MessageAttachment.url: attachment_preview}
