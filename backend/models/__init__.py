"""Реэкспортирует ORM-модели, чтобы один `import models` или
`from models import X` регистрировал всю схему на Base.metadata.
"""

from models.advertisement import (
    Advertisement,
    LikedAdvertisement,
    ViewedAdvertisement,
)
from models.attribute import AdvertisementAttributeValue, Attribute
from models.banner import Banner
from models.category import Category, Subcategory
from models.chat import Conversation, Message, MessageAttachment
from models.complaint import Complaint
from models.content import ContentPage, FooterLink
from models.user import User

__all__ = [
    "Advertisement",
    "AdvertisementAttributeValue",
    "Attribute",
    "Banner",
    "Category",
    "Complaint",
    "ContentPage",
    "Conversation",
    "FooterLink",
    "LikedAdvertisement",
    "Message",
    "MessageAttachment",
    "Subcategory",
    "User",
    "ViewedAdvertisement",
]
