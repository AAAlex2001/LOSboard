"""Диалоги. Просмотр переписки целиком с вложениями."""

import re
from typing import Any

from markupsafe import Markup, escape
from sqladmin import ModelView

from admin.views.common import AdminOnly, img_thumb
from models.chat import Conversation, Message


CHAT_URL_PATTERN = re.compile(r"^/conversations/(\d+)/attachments/(.+)$")


def attachment_public_url(stored_url: str | None) -> str | None:
    """Парсит `/conversations/X/attachments/Y` → публичный URL под `/static/uploads/chat/...`.

    Тот же путь, что монтирует main.py для UPLOADS_DIR, поэтому ссылка
    открывается прямо из админки без отдельной авторизации.
    """
    if not stored_url:
        return None
    match = CHAT_URL_PATTERN.match(stored_url)
    if not match:
        return stored_url
    conv_id, filename = match.group(1), match.group(2)
    return f"/static/uploads/chat/{conv_id}/{filename}"


def attachment_chip(att: Any) -> str:
    """HTML-плашка одного вложения: миниатюра для картинок, иконка + имя для файлов."""
    url = attachment_public_url(att.url) or ""
    if att.kind == "image":
        return (
            f'<a href="{escape(url)}" target="_blank" rel="noreferrer">'
            f"{img_thumb(url, size=80)}"
            f"</a>"
        )
    icon = {"video": "🎬", "document": "📄"}.get(att.kind, "📎")
    return (
        f'<a href="{escape(url)}" target="_blank" rel="noreferrer" '
        f'style="color:#1565C0; text-decoration:none;">'
        f"{icon} {escape(att.filename or 'файл')}"
        f"</a>"
    )


def message_block(msg: Message) -> str:
    """HTML одного сообщения: автор, время, текст, вложения."""
    sender_label = getattr(msg.sender, "name", None) or f"#{msg.sender_id}"
    when = msg.created_at.strftime("%Y-%m-%d %H:%M")
    text = escape((msg.text or "").strip())
    read_mark = "✓" if msg.is_read else "·"
    attachments = list(msg.attachments or [])

    body_html = text if text else '<em style="color:#9ca3af;">(без текста)</em>'

    chips_html = ""
    if attachments:
        chips_html = (
            '<div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;">'
            + "".join(attachment_chip(a) for a in attachments)
            + "</div>"
        )

    return (
        '<div style="border:1px solid #e5e7eb; border-radius:10px; '
        'padding:12px 14px; margin-bottom:10px; background:#fafbfc;">'
        '<div style="display:flex; justify-content:space-between; '
        'font-size:13px; color:#6b7280; margin-bottom:6px;">'
        f'<strong style="color:#111827;">{escape(sender_label)}</strong>'
        f"<span>{escape(when)} {read_mark}</span>"
        "</div>"
        f'<div style="white-space:pre-wrap; font-size:14px; color:#111827;">{body_html}</div>'
        f"{chips_html}"
        "</div>"
    )


def conversation_thread(conv: Conversation, _attr: Any = None) -> Markup:
    """Полная переписка диалога с вложениями для детальной страницы."""
    messages = list(conv.messages or [])
    if not messages:
        return Markup('<span style="color:#999">Сообщений нет</span>')
    return Markup("".join(message_block(m) for m in messages))


class ConversationAdmin(AdminOnly, ModelView, model=Conversation):
    name = "диалог"
    name_plural = "Диалоги"
    icon = "fa-solid fa-comments"
    can_create = False
    can_edit = False
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
        Conversation.messages: "Переписка",
    }
    column_details_list = [
        Conversation.id,
        Conversation.advertisement,
        Conversation.buyer,
        Conversation.seller,
        Conversation.created_at,
        Conversation.last_message_at,
        Conversation.messages,
    ]
    column_formatters_detail = {
        Conversation.messages: conversation_thread,
    }
