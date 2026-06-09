"""UserAdmin с массовыми действиями: бан / разбан / удалить объявления юзера."""

from datetime import datetime, timedelta
from typing import Any

from markupsafe import Markup, escape
from sqladmin import ModelView, action
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
from starlette.requests import Request
from starlette.responses import RedirectResponse
from wtforms import SelectField

from admin.views.common import (
    AdminOnly,
    PERMANENT_BAN_UNTIL,
    ROLE_CHOICES,
    avatar_thumb,
    redirect_to_list,
    role_badge,
    selected_pks,
    user_ads_list,
)
from database import AsyncSessionLocal
from models.advertisement import Advertisement
from models.user import User


def user_advertisements_block(user: Any, _attr: Any = None) -> Markup:
    ads = list(getattr(user, "advertisements", None) or [])
    if not ads:
        return Markup('<span style="color:#999">Без объявлений</span>')
    parts = []
    for ad in ads:
        title = escape(ad.title or "(без названия)")
        parts.append(
            f'<div style="margin-bottom:4px;">'
            f'<a href="/los-control-x9k2m-admin/advertisement/details/{ad.id}" '
            f'style="color:#1565C0; text-decoration:none;">'
            f"#{ad.id} {title}</a></div>"
        )
    return Markup("".join(parts))


def fmt_user_avatar(model: Any, _attr: Any) -> Markup:
    return avatar_thumb(model.avatar_url)


def fmt_user_avatar_large(model: Any, _attr: Any) -> Markup:
    return avatar_thumb(model.avatar_url, size=120)


def fmt_user_role(model: Any, _attr: Any) -> Markup:
    return role_badge(model.role)


def fmt_user_ads(model: Any, _attr: Any) -> Markup:
    return user_ads_list(model.advertisements)


class UserAdmin(AdminOnly, ModelView, model=User):
    name = "пользователь"
    name_plural = "Пользователи"
    icon = "fa-solid fa-users"
    column_list = [
        User.id,
        User.avatar_url,
        User.name,
        User.email,
        User.phone_number,
        User.is_active,
        User.role,
        User.banned_until,
        User.created_at,
    ]
    column_details_list = [
        User.id,
        User.avatar_url,
        User.name,
        User.email,
        User.phone_number,
        User.role,
        User.is_active,
        User.banned_until,
        User.created_at,
        User.advertisements,
    ]
    column_searchable_list = [User.name, User.email, User.phone_number]
    column_sortable_list = [
        User.id, User.name, User.email, User.role, User.created_at, User.is_active
    ]
    column_labels = {
        User.id: "ID",
        User.name: "Имя",
        User.email: "Email",
        User.phone_number: "Телефон",
        User.avatar_url: "Аватар",
        User.is_active: "Активен",
        User.role: "Роль",
        User.banned_until: "Бан до",
        User.created_at: "Зарегистрирован",
        User.token_version: "Версия токена",
        User.advertisements: "Объявления",
    }
    column_formatters = {
        User.avatar_url: fmt_user_avatar,
        User.role: fmt_user_role,
    }
    column_formatters_detail = {
        User.avatar_url: fmt_user_avatar_large,
        User.role: fmt_user_role,
        User.advertisements: user_advertisements_block,
    }
    form_excluded_columns = [
        User.password,
        User.advertisements,
        User.liked_advertisements,
        User.viewed_advertisements,
    ]
    form_overrides = {"role": SelectField}
    form_args = {"role": {"choices": ROLE_CHOICES}}

    async def get_object_for_details(self, request: Request) -> Any:
        """Eager-load объявлений: sqladmin закрывает сессию до рендера, lazy-load кинул бы DetachedInstanceError."""
        pk = request.path_params["pk"]
        stmt = (
            select(User)
            .where(User.id == int(pk))
            .options(selectinload(User.advertisements))
        )
        async with AsyncSessionLocal() as session:
            result = await session.execute(stmt)
            return result.unique().scalar_one_or_none()

    async def apply_ban(
        self,
        request: Request,
        until: datetime | None,
    ) -> RedirectResponse:
        pks = selected_pks(request)
        if pks:
            current_admin = request.session.get("admin_user_id")
            safe_pks = [p for p in pks if p != current_admin]
            if safe_pks:
                async with self.session_maker() as session:
                    await session.execute(
                        update(User).where(User.id.in_(safe_pks)).values(banned_until=until)
                    )
                    await session.commit()
        return redirect_to_list(request, self.identity)

    @action(
        name="ban_7d",
        label="Забанить на 7 дней",
        confirmation_message="Забанить выбранных пользователей на 7 дней?",
    )
    async def ban_7d_action(self, request: Request) -> RedirectResponse:
        return await self.apply_ban(request, datetime.utcnow() + timedelta(days=7))

    @action(
        name="ban_30d",
        label="Забанить на 30 дней",
        confirmation_message="Забанить выбранных пользователей на 30 дней?",
    )
    async def ban_30d_action(self, request: Request) -> RedirectResponse:
        return await self.apply_ban(request, datetime.utcnow() + timedelta(days=30))

    @action(
        name="ban_forever",
        label="Забанить навсегда",
        confirmation_message="Забанить выбранных пользователей навсегда?",
    )
    async def ban_forever_action(self, request: Request) -> RedirectResponse:
        return await self.apply_ban(request, PERMANENT_BAN_UNTIL)

    @action(
        name="unban",
        label="Снять бан",
        confirmation_message="Снять бан с выбранных пользователей?",
    )
    async def unban_action(self, request: Request) -> RedirectResponse:
        return await self.apply_ban(request, None)

    @action(
        name="delete_ads",
        label="Удалить все объявления юзера",
        confirmation_message="Удалить ВСЕ объявления выбранных пользователей? Действие необратимо.",
    )
    async def delete_ads_action(self, request: Request) -> RedirectResponse:
        pks = selected_pks(request)
        if pks:
            async with self.session_maker() as session:
                await session.execute(
                    update(Advertisement)
                    .where(
                        Advertisement.owner_id.in_(pks),
                        Advertisement.deleted_at.is_(None),
                    )
                    .values(
                        is_active=False,
                        deleted_at=datetime.utcnow(),
                    )
                )
                await session.commit()
        return redirect_to_list(request, self.identity)
