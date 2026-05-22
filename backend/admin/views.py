from sqladmin import ModelView

from models.advertisement import Advertisement, LikedAdvertisement, ViewedAdvertisement
from models.category import Category, Subcategory
from models.chat import Conversation, Message, MessageAttachment
from models.user import User


class UserAdmin(ModelView, model=User):
    name = "User"
    name_plural = "Users"
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
    form_excluded_columns = [
        User.password,
        User.advertisements,
        User.liked_advertisements,
        User.viewed_advertisements,
    ]


class CategoryAdmin(ModelView, model=Category):
    name = "Category"
    name_plural = "Categories"
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


class SubcategoryAdmin(ModelView, model=Subcategory):
    name = "Subcategory"
    name_plural = "Subcategories"
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


class AdvertisementAdmin(ModelView, model=Advertisement):
    name = "Advertisement"
    name_plural = "Advertisements"
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


class LikedAdvertisementAdmin(ModelView, model=LikedAdvertisement):
    name = "Liked advertisement"
    name_plural = "Liked advertisements"
    icon = "fa-solid fa-heart"
    column_list = [
        LikedAdvertisement.id,
        LikedAdvertisement.user_id,
        LikedAdvertisement.advertisement_id,
    ]
    column_sortable_list = [LikedAdvertisement.id]


class ViewedAdvertisementAdmin(ModelView, model=ViewedAdvertisement):
    name = "Viewed advertisement"
    name_plural = "Viewed advertisements"
    icon = "fa-solid fa-eye"
    column_list = [
        ViewedAdvertisement.id,
        ViewedAdvertisement.user_id,
        ViewedAdvertisement.advertisement_id,
        ViewedAdvertisement.viewed_at,
    ]
    column_sortable_list = [ViewedAdvertisement.id, ViewedAdvertisement.viewed_at]


class ConversationAdmin(ModelView, model=Conversation):
    name = "Conversation"
    name_plural = "Conversations"
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


class MessageAdmin(ModelView, model=Message):
    name = "Message"
    name_plural = "Messages"
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


class MessageAttachmentAdmin(ModelView, model=MessageAttachment):
    name = "Message attachment"
    name_plural = "Message attachments"
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
