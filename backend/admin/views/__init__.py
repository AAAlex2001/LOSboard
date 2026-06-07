"""Реэкспорт всех ModelView админки для setup.py.

Каждый файл здесь отвечает за свой доменный кусок:
- advertisement.py — объявления + 4 пресет-вью по статусу
- attribute.py — динамические доп. поля категорий
- banner.py — баннеры с загрузкой картинки
- category.py — категории и подкатегории
- chat.py — диалоги (с переписью и вложениями в детали)
- complaint.py — жалобы
- content.py — контент-страницы / футер / настройки сайта
- likes_views.py — технические таблицы лайков/просмотров
- user.py — пользователи + бан/разбан/удалить объявления
- common.py — общие хелперы (AdminOnly, форматтеры, бэйджи, choices)
"""

from admin.views.advertisement import (
    ActiveAdvertisementsAdmin,
    AdvertisementAdmin,
    ArchivedAdvertisementsAdmin,
    ModerationQueueAdmin,
    RejectedAdvertisementsAdmin,
)
from admin.views.attribute import (
    AdvertisementAttributeValueAdmin,
    AttributeAdmin,
)
from admin.views.banner import BannerAdmin
from admin.views.category import CategoryAdmin, SubcategoryAdmin
from admin.views.chat import ConversationAdmin
from admin.views.complaint import ComplaintAdmin
from admin.views.content import (
    ContentPageAdmin,
    FooterLinkAdmin,
    SiteSettingsAdmin,
)
from admin.views.likes_views import (
    LikedAdvertisementAdmin,
    ViewedAdvertisementAdmin,
)
from admin.views.user import UserAdmin

__all__ = [
    "ActiveAdvertisementsAdmin",
    "AdvertisementAdmin",
    "AdvertisementAttributeValueAdmin",
    "ArchivedAdvertisementsAdmin",
    "AttributeAdmin",
    "BannerAdmin",
    "CategoryAdmin",
    "ComplaintAdmin",
    "ContentPageAdmin",
    "ConversationAdmin",
    "FooterLinkAdmin",
    "LikedAdvertisementAdmin",
    "ModerationQueueAdmin",
    "RejectedAdvertisementsAdmin",
    "SiteSettingsAdmin",
    "SubcategoryAdmin",
    "UserAdmin",
    "ViewedAdvertisementAdmin",
]
