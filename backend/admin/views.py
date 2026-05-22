from sqladmin import ModelView

from models.advertisement import Advertisement, LikedAdvertisement, ViewedAdvertisement
from models.category import Category, Subcategory
from models.chat import Conversation, Message, MessageAttachment
from models.user import User


class UserAdmin(ModelView, model=User):
    name = "пользователь"
    name_plural = "Пользователи"
    icon = "fa-solid fa-users"
    column_list = [
        User.id,
        User.name,
        User.email,
        User.phone_number,
        User.is_active,
        User.is_admin,
    ]
    column_searchable_list = [User.name, User.email, User.phone_number]
    column_sortable_list = [User.id, User.name, User.email]
    column_labels = {
        User.id: "ID",
        User.name: "Имя",
        User.email: "Email",
        User.phone_number: "Телефон",
        User.avatar_url: "Аватар",
        User.is_active: "Активен",
        User.is_admin: "Админ",
        User.token_version: "Версия токена",
    }
    form_excluded_columns = [
        User.password,
        User.advertisements,
        User.liked_advertisements,
        User.viewed_advertisements,
    ]


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


class SubcategoryAdmin(ModelView, model=Subcategory):
    name = "подкатегорию"
    name_plural = "Подкатегории"
    icon = "fa-solid fa-list"
    column_list = [
        Subcategory.id,
        Subcategory.name,
        Subcategory.slug,
        Subcategory.category_id,
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


class AdvertisementAdmin(ModelView, model=Advertisement):
    name = "объявление"
    name_plural = "Объявления"
    icon = "fa-solid fa-rectangle-ad"
    column_list = [
        Advertisement.id,
        Advertisement.title,
        Advertisement.price,
        Advertisement.location,
        Advertisement.is_active,
        Advertisement.is_urgent,
        Advertisement.owner_id,
        Advertisement.category_id,
        Advertisement.subcategory_id,
        Advertisement.created_at,
    ]
    column_searchable_list = [Advertisement.title, Advertisement.location]
    column_sortable_list = [
        Advertisement.id,
        Advertisement.price,
        Advertisement.created_at,
        Advertisement.likes_count,
        Advertisement.views_count,
    ]
    column_labels = {
        Advertisement.id: "ID",
        Advertisement.title: "Название",
        Advertisement.description: "Описание",
        Advertisement.price: "Цена",
        Advertisement.location: "Локация",
        Advertisement.photo_urls: "Фотографии",
        Advertisement.is_active: "Активно",
        Advertisement.is_urgent: "Срочное",
        Advertisement.created_at: "Создано",
        Advertisement.likes_count: "Лайки",
        Advertisement.views_count: "Просмотры",
        Advertisement.owner_id: "ID владельца",
        Advertisement.category_id: "ID категории",
        Advertisement.subcategory_id: "ID подкатегории",
        Advertisement.owner: "Владелец",
        Advertisement.category: "Категория",
        Advertisement.subcategory: "Подкатегория",
    }


class LikedAdvertisementAdmin(ModelView, model=LikedAdvertisement):
    name = "лайк"
    name_plural = "Лайки объявлений"
    icon = "fa-solid fa-heart"
    column_list = [
        LikedAdvertisement.id,
        LikedAdvertisement.user_id,
        LikedAdvertisement.advertisement_id,
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
        ViewedAdvertisement.user_id,
        ViewedAdvertisement.advertisement_id,
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
        Conversation.advertisement_id,
        Conversation.buyer_id,
        Conversation.seller_id,
        Conversation.created_at,
        Conversation.last_message_at,
    ]
    column_sortable_list = [Conversation.id, Conversation.created_at, Conversation.last_message_at]
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


class MessageAdmin(ModelView, model=Message):
    name = "сообщение"
    name_plural = "Сообщения"
    icon = "fa-solid fa-message"
    column_list = [
        Message.id,
        Message.conversation_id,
        Message.sender_id,
        Message.text,
        Message.created_at,
        Message.is_read,
    ]
    column_searchable_list = [Message.text]
    column_sortable_list = [Message.id, Message.created_at]
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


class MessageAttachmentAdmin(ModelView, model=MessageAttachment):
    name = "вложение"
    name_plural = "Вложения сообщений"
    icon = "fa-solid fa-paperclip"
    column_list = [
        MessageAttachment.id,
        MessageAttachment.message_id,
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
