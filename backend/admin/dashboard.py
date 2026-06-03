from datetime import datetime, timedelta

from sqladmin import BaseView, expose
from sqlalchemy import func, select
from starlette.requests import Request

from database import AsyncSessionLocal
from models.advertisement import (
    Advertisement,
    MODERATION_PENDING,
)
from models.category import Category
from models.complaint import COMPLAINT_OPEN, Complaint
from models.user import User


class DashboardView(BaseView):
    name = "Дашборд"
    icon = "fa-solid fa-chart-line"

    @expose("/dashboard", methods=["GET"], identity="dashboard")
    async def dashboard(self, request: Request):
        now = datetime.utcnow()
        day_ago = now - timedelta(days=1)
        week_ago = now - timedelta(days=7)

        async with AsyncSessionLocal() as session:
            users_today = await session.scalar(
                select(func.count(User.id)).where(User.created_at >= day_ago)
            )
            users_week = await session.scalar(
                select(func.count(User.id)).where(User.created_at >= week_ago)
            )
            ads_today = await session.scalar(
                select(func.count(Advertisement.id)).where(
                    Advertisement.created_at >= day_ago
                )
            )
            ads_week = await session.scalar(
                select(func.count(Advertisement.id)).where(
                    Advertisement.created_at >= week_ago
                )
            )
            pending_count = await session.scalar(
                select(func.count(Advertisement.id)).where(
                    Advertisement.moderation_status == MODERATION_PENDING
                )
            )
            open_complaints = await session.scalar(
                select(func.count(Complaint.id)).where(
                    Complaint.status == COMPLAINT_OPEN
                )
            )

            top_categories_rows = (
                await session.execute(
                    select(Category.name, func.count(Advertisement.id).label("cnt"))
                    .join(Advertisement, Advertisement.category_id == Category.id)
                    .group_by(Category.id, Category.name)
                    .order_by(func.count(Advertisement.id).desc())
                    .limit(5)
                )
            ).all()

            recent_complaints = (
                await session.execute(
                    select(Complaint)
                    .order_by(Complaint.created_at.desc())
                    .limit(5)
                )
            ).scalars().all()

        ads_list_url = request.url_for("admin:list", identity="advertisement")
        complaints_list_url = request.url_for("admin:list", identity="complaint")

        cards = [
            {
                "label": "Новых пользователей за 24ч",
                "value": users_today or 0,
                "icon": "fa-solid fa-user-plus",
                "color": "primary",
                "link": None,
            },
            {
                "label": "Новых пользователей за 7 дней",
                "value": users_week or 0,
                "icon": "fa-solid fa-users",
                "color": "primary",
                "link": None,
            },
            {
                "label": "Новых объявлений за 24ч",
                "value": ads_today or 0,
                "icon": "fa-solid fa-rectangle-ad",
                "color": "info",
                "link": None,
            },
            {
                "label": "Новых объявлений за 7 дней",
                "value": ads_week or 0,
                "icon": "fa-solid fa-rectangle-ad",
                "color": "info",
                "link": None,
            },
            {
                "label": "Ожидают модерации",
                "value": pending_count or 0,
                "icon": "fa-solid fa-hourglass-half",
                "color": "warning",
                "link": (
                    f"{ads_list_url}?moderation_status={MODERATION_PENDING}"
                ),
            },
            {
                "label": "Открытых жалоб",
                "value": open_complaints or 0,
                "icon": "fa-solid fa-flag",
                "color": "danger",
                "link": f"{complaints_list_url}?status={COMPLAINT_OPEN}",
            },
        ]

        top_categories = [
            {"name": row[0], "count": row[1]} for row in top_categories_rows
        ]

        return await self.templates.TemplateResponse(
            request,
            "dashboard.html",
            context={
                "cards": cards,
                "top_categories": top_categories,
                "recent_complaints": recent_complaints,
            },
        )
