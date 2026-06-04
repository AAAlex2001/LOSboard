import os

from fastapi import FastAPI
from sqladmin import Admin
from starlette.middleware.sessions import SessionMiddleware

from admin.auth import AdminAuth
from admin.dashboard import DashboardView
from admin.views import (
    AdvertisementAdmin,
    AdvertisementAttributeValueAdmin,
    AttributeAdmin,
    BannerAdmin,
    CategoryAdmin,
    ComplaintAdmin,
    ContentPageAdmin,
    ConversationAdmin,
    FooterLinkAdmin,
    LikedAdvertisementAdmin,
    MessageAdmin,
    MessageAttachmentAdmin,
    ModerationQueueAdmin,
    SubcategoryAdmin,
    UserAdmin,
    ViewedAdvertisementAdmin,
)
from database import engine


def setup_admin(app: FastAPI) -> None:
    secret_key = os.environ["JWT_SECRET_KEY"]
    admin_base_url = os.environ["ADMIN_BASE_URL"]
    app.add_middleware(SessionMiddleware, secret_key=secret_key)

    admin = Admin(
        app=app,
        engine=engine,
        title="Админка LOSboard",
        base_url=admin_base_url,
        templates_dir="admin/templates",
        authentication_backend=AdminAuth(secret_key=secret_key),
    )
    admin.add_base_view(DashboardView)
    admin.add_view(AdvertisementAdmin)
    admin.add_view(ModerationQueueAdmin)
    admin.add_view(ComplaintAdmin)
    admin.add_view(UserAdmin)
    admin.add_view(CategoryAdmin)
    admin.add_view(SubcategoryAdmin)
    admin.add_view(AttributeAdmin)
    admin.add_view(AdvertisementAttributeValueAdmin)
    admin.add_view(BannerAdmin)
    admin.add_view(ContentPageAdmin)
    admin.add_view(FooterLinkAdmin)
    admin.add_view(LikedAdvertisementAdmin)
    admin.add_view(ViewedAdvertisementAdmin)
    admin.add_view(ConversationAdmin)
    admin.add_view(MessageAdmin)
    admin.add_view(MessageAttachmentAdmin)
