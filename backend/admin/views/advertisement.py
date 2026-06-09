"""Объявления: базовая вью + 4 пресет-вью по статусам (очередь, активные, архив, отклонённые)."""

from datetime import datetime
from typing import Any, List

from markupsafe import Markup
from sqladmin import ModelView, action
from sqlalchemy import func, select, update
from starlette.requests import Request
from starlette.responses import RedirectResponse
from wtforms import SelectField

from admin.views.common import (
    MODERATION_CHOICES,
    apply_date_range,
    moderation_badge,
    photo_thumbs,
    redirect_to_list,
    selected_pks,
)
from models.advertisement import (
    Advertisement,
    MODERATION_APPROVED,
    MODERATION_PENDING,
    MODERATION_REJECTED,
)


def fmt_ad_photos_small(model: Any, _attr: Any) -> Markup:
    return photo_thumbs(list(model.photo_urls or []), size=60)


def fmt_ad_photos_large(model: Any, _attr: Any) -> Markup:
    return photo_thumbs(list(model.photo_urls or []), size=180)


def fmt_ad_moderation(model: Any, _attr: Any) -> Markup:
    return moderation_badge(model.moderation_status)


class AdvertisementAdmin(ModelView, model=Advertisement):
    """Все объявления на сайте — поиск по любому полю, модерация, ручное редактирование."""

    name = "объявление"
    name_plural = "Объявления"
    icon = "fa-solid fa-rectangle-ad"
    show_date_filter = True
    column_list = [
        Advertisement.id,
        Advertisement.photo_urls,
        Advertisement.title,
        Advertisement.price,
        Advertisement.moderation_status,
        Advertisement.is_active,
        Advertisement.is_urgent,
        Advertisement.owner,
        Advertisement.category,
        Advertisement.subcategory,
        Advertisement.created_at,
    ]
    column_searchable_list = [
        Advertisement.title,
        Advertisement.location,
        Advertisement.id,
        "owner.email",
        "owner.name",
        "category.name",
        "subcategory.name",
    ]
    column_sortable_list = [
        Advertisement.id,
        Advertisement.price,
        Advertisement.created_at,
        Advertisement.likes_count,
        Advertisement.views_count,
        Advertisement.moderation_status,
        Advertisement.is_active,
    ]
    column_labels = {
        Advertisement.id: "ID",
        Advertisement.title: "Название",
        Advertisement.description: "Описание",
        Advertisement.price: "Цена",
        Advertisement.location: "Локация",
        Advertisement.photo_urls: "Фото",
        Advertisement.is_active: "Активно",
        Advertisement.is_urgent: "Срочное",
        Advertisement.created_at: "Создано",
        Advertisement.likes_count: "Лайки",
        Advertisement.views_count: "Просмотры",
        Advertisement.moderation_status: "Статус модерации",
        Advertisement.moderation_reason: "Причина",
        Advertisement.moderated_at: "Промодерировано",
        Advertisement.moderated_by: "Кто промодерировал",
        Advertisement.moderated_by_id: "ID модератора",
        Advertisement.owner_id: "ID владельца",
        Advertisement.category_id: "ID категории",
        Advertisement.subcategory_id: "ID подкатегории",
        Advertisement.owner: "Владелец",
        Advertisement.category: "Категория",
        Advertisement.subcategory: "Подкатегория",
        Advertisement.liked_by_users: "Лайки",
        Advertisement.viewed_by_users: "Просмотры (пользователи)",
    }
    column_formatters = {
        Advertisement.photo_urls: fmt_ad_photos_small,
        Advertisement.moderation_status: fmt_ad_moderation,
    }
    column_formatters_detail = {
        Advertisement.photo_urls: fmt_ad_photos_large,
        Advertisement.moderation_status: fmt_ad_moderation,
    }
    column_details_exclude_list = [
        Advertisement.liked_by_users,
        Advertisement.viewed_by_users,
    ]
    form_excluded_columns = [
        Advertisement.liked_by_users,
        Advertisement.viewed_by_users,
    ]
    form_overrides = {"moderation_status": SelectField}
    form_args = {"moderation_status": {"choices": MODERATION_CHOICES}}
    column_default_sort = [("created_at", True)]

    def list_query(self, request: Request):
        return apply_date_range(
            select(Advertisement).order_by(Advertisement.created_at.desc()),
            request,
            Advertisement.created_at,
        )

    async def delete_model(self, request: Request, pks: List[Any]) -> None:
        """Soft-delete объявления — оставляем строку, чтобы не падать на FK с чатами."""
        if not pks:
            return
        ids = [int(pk) for pk in pks]
        async with self.session_maker() as session:
            await session.execute(
                update(Advertisement)
                .where(Advertisement.id.in_(ids))
                .values(
                    is_active=False,
                    deleted_at=datetime.utcnow(),
                )
            )
            await session.commit()

    async def apply_moderation(
        self,
        request: Request,
        status: str,
        reason: str | None,
    ) -> RedirectResponse:
        pks = selected_pks(request)
        if pks:
            async with self.session_maker() as session:
                await session.execute(
                    update(Advertisement)
                    .where(Advertisement.id.in_(pks))
                    .values(
                        moderation_status=status,
                        moderation_reason=reason,
                        moderated_at=datetime.utcnow(),
                        moderated_by_id=request.session.get("admin_user_id"),
                    )
                )
                await session.commit()
        return redirect_to_list(request, self.identity)

    @action(
        name="approve",
        label="Одобрить",
        confirmation_message="Одобрить выбранные объявления?",
        add_in_detail=True,
        add_in_list=True,
    )
    async def approve_action(self, request: Request) -> RedirectResponse:
        return await self.apply_moderation(request, MODERATION_APPROVED, None)

    @action(name="reject", label="Отклонить (выбрать причину)")
    async def reject_action(self, request: Request) -> RedirectResponse:
        pks_raw = request.query_params.get("pks", "")
        target = request.url_for("admin:reject-ads").include_query_params(pks=pks_raw)
        return RedirectResponse(str(target))


class ModerationQueueAdmin(AdvertisementAdmin, model=Advertisement):
    """Только объявления со статусом «ожидает модерации», старые сверху."""

    name = "элемент очереди"
    name_plural = "Очередь модерации"
    icon = "fa-solid fa-hourglass-half"
    can_create = False
    can_delete = False

    def list_query(self, request: Request):
        return apply_date_range(
            select(Advertisement)
            .where(Advertisement.moderation_status == MODERATION_PENDING)
            .order_by(Advertisement.created_at.asc()),
            request,
            Advertisement.created_at,
        )

    def count_query(self, request: Request):
        return select(func.count(Advertisement.id)).where(
            Advertisement.moderation_status == MODERATION_PENDING
        )


class ActiveAdvertisementsAdmin(AdvertisementAdmin, model=Advertisement):
    """Одобренные и активные объявления — то, что видят пользователи на сайте."""

    name = "активное объявление"
    name_plural = "Активные"
    icon = "fa-solid fa-circle-check"
    can_create = False

    def list_query(self, request: Request):
        return apply_date_range(
            select(Advertisement)
            .where(
                Advertisement.moderation_status == MODERATION_APPROVED,
                Advertisement.is_active.is_(True),
            )
            .order_by(Advertisement.created_at.desc()),
            request,
            Advertisement.created_at,
        )

    def count_query(self, request: Request):
        return select(func.count(Advertisement.id)).where(
            Advertisement.moderation_status == MODERATION_APPROVED,
            Advertisement.is_active.is_(True),
        )


class ArchivedAdvertisementsAdmin(AdvertisementAdmin, model=Advertisement):
    """Снятые с публикации владельцем (`is_active=False`), но не отклонённые."""

    name = "архивное объявление"
    name_plural = "В архиве"
    icon = "fa-solid fa-box-archive"
    can_create = False

    def list_query(self, request: Request):
        return apply_date_range(
            select(Advertisement)
            .where(Advertisement.is_active.is_(False))
            .order_by(Advertisement.created_at.desc()),
            request,
            Advertisement.created_at,
        )

    def count_query(self, request: Request):
        return select(func.count(Advertisement.id)).where(
            Advertisement.is_active.is_(False)
        )


class RejectedAdvertisementsAdmin(AdvertisementAdmin, model=Advertisement):
    """Отклонённые модератором объявления — с причиной отклонения."""

    name = "отклонённое объявление"
    name_plural = "Заблокированные"
    icon = "fa-solid fa-ban"
    can_create = False

    def list_query(self, request: Request):
        return apply_date_range(
            select(Advertisement)
            .where(Advertisement.moderation_status == MODERATION_REJECTED)
            .order_by(Advertisement.moderated_at.desc().nullslast()),
            request,
            Advertisement.moderated_at,
        )

    def count_query(self, request: Request):
        return select(func.count(Advertisement.id)).where(
            Advertisement.moderation_status == MODERATION_REJECTED
        )


# Метакласс SQLAdmin при `model=Advertisement` затирает `identity` именем модели
# («advertisement»), поэтому все 4 пресет-вью получали один и тот же URL и
# роутились в первый зарегистрированный AdvertisementAdmin. Выставляем уникальный
# identity после определения класса — это единственное место, где это можно сделать,
# чтобы метакласс библиотеки нас не перебил.
ModerationQueueAdmin.identity = "moderation-queue"
ActiveAdvertisementsAdmin.identity = "ads-active"
ArchivedAdvertisementsAdmin.identity = "ads-archived"
RejectedAdvertisementsAdmin.identity = "ads-rejected"
