"""Диалоги, сообщения, вложения. Только просмотр (для админа)."""

from sqladmin import ModelView

from admin.views.common import AdminOnly
from models.chat import Conversation, Message, MessageAttachment


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
