from datetime import datetime, timedelta

from sqladmin import BaseView, expose
from sqlalchemy import cast, func, select
from sqlalchemy.types import Date
from starlette.requests import Request
from starlette.responses import JSONResponse

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
                    Advertisement.moderation_status == MODERATION_PENDING,
                    Advertisement.deleted_at.is_(None),
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

            chart_from = (now - timedelta(days=13)).replace(
                hour=0, minute=0, second=0, microsecond=0
            )

            ads_daily_rows = (
                await session.execute(
                    select(
                        cast(Advertisement.created_at, Date).label("day"),
                        func.count(Advertisement.id).label("cnt"),
                    )
                    .where(Advertisement.created_at >= chart_from)
                    .group_by(cast(Advertisement.created_at, Date))
                    .order_by(cast(Advertisement.created_at, Date))
                )
            ).all()
            users_daily_rows = (
                await session.execute(
                    select(
                        cast(User.created_at, Date).label("day"),
                        func.count(User.id).label("cnt"),
                    )
                    .where(User.created_at >= chart_from)
                    .group_by(cast(User.created_at, Date))
                    .order_by(cast(User.created_at, Date))
                )
            ).all()

        days = [
            (chart_from + timedelta(days=i)).date() for i in range(14)
        ]
        ads_by_day = {row[0]: row[1] for row in ads_daily_rows}
        users_by_day = {row[0]: row[1] for row in users_daily_rows}
        chart_labels = [d.strftime("%d.%m") for d in days]
        chart_ads = [ads_by_day.get(d, 0) for d in days]
        chart_users = [users_by_day.get(d, 0) for d in days]

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
                "chart_labels": chart_labels,
                "chart_ads": chart_ads,
                "chart_users": chart_users,
            },
        )

    @expose(
        "/notification-counts",
        methods=["GET"],
        identity="notification-counts",
        include_in_schema=False,
    )
    async def notification_counts(self, request: Request) -> JSONResponse:
        """Счётчики активной работы рядом с пунктами меню админки."""
        async with AsyncSessionLocal() as session:
            pending_ads = await session.scalar(
                select(func.count(Advertisement.id)).where(
                    Advertisement.moderation_status == MODERATION_PENDING,
                    Advertisement.deleted_at.is_(None),
                )
            )
            open_complaints = await session.scalar(
                select(func.count(Complaint.id)).where(
                    Complaint.status == COMPLAINT_OPEN
                )
            )

        return JSONResponse(
            {
                "moderation": {
                    "count": pending_ads or 0,
                    "url": str(
                        request.url_for(
                            "admin:list", identity="moderation-queue"
                        )
                    ),
                },
                "complaints": {
                    "count": open_complaints or 0,
                    "url": str(
                        request.url_for("admin:list", identity="complaint")
                    ),
                },
            }
        )
