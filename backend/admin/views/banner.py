"""Рекламные баннеры. Картинка загружается с компа, конвертится в WebP."""

from typing import Any

from fastapi import HTTPException
from markupsafe import Markup
from sqladmin import ModelView
from sqladmin.fields import FileField
from starlette.requests import Request

from admin.views.common import (
    AdminOnly,
    img_thumb,
    read_starlette_upload,
    upload_is_real,
)
from models.banner import Banner
from services.uploads.image import ensure_extension, save_processed_sync


def fmt_banner_thumb_small(model: Any, _attr: Any) -> Markup:
    if not model.image_url:
        return Markup('<span style="color:#999">—</span>')
    return Markup(img_thumb(model.image_url, size=80))


def fmt_banner_thumb_large(model: Any, _attr: Any) -> Markup:
    if not model.image_url:
        return Markup('<span style="color:#999">—</span>')
    return Markup(img_thumb(model.image_url, size=300))


class BannerAdmin(AdminOnly, ModelView, model=Banner):
    name = "баннер"
    name_plural = "Баннеры"
    icon = "fa-solid fa-image"
    column_list = [
        Banner.id,
        Banner.image_url,
        Banner.title,
        Banner.link_url,
        Banner.sort_order,
        Banner.is_active,
        Banner.starts_at,
        Banner.ends_at,
    ]
    column_searchable_list = [Banner.title, Banner.description, Banner.link_url]
    column_sortable_list = [
        Banner.id,
        Banner.sort_order,
        Banner.is_active,
        Banner.starts_at,
        Banner.ends_at,
        Banner.created_at,
    ]
    column_labels = {
        Banner.id: "ID",
        Banner.title: "Название",
        Banner.description: "Краткое описание (показывается под заголовком)",
        Banner.image_url: "Картинка (JPG / PNG / WebP, до 10 МБ)",
        Banner.link_url: "Куда ведёт клик по баннеру (опционально)",
        Banner.sort_order: "Порядок (меньше — выше)",
        Banner.is_active: "Показывать на сайте",
        Banner.starts_at: "Старт показа (для заметки)",
        Banner.ends_at: "Конец показа (для заметки)",
        Banner.created_at: "Создан",
    }
    column_formatters = {Banner.image_url: fmt_banner_thumb_small}
    column_formatters_detail = {Banner.image_url: fmt_banner_thumb_large}
    column_default_sort = [("sort_order", False)]
    form_overrides = {"image_url": FileField}
    form_args = {
        "image_url": {
            "description": "Выберите файл с компьютера. JPG, PNG или WebP, до 10 МБ.",
        },
        "is_active": {
            "description": "Главный переключатель: выключите — баннер исчезнет с сайта мгновенно.",
        },
        "starts_at": {
            "description": "Информационное поле — пока не используется для автоматического показа. "
            "Показом управляет тогл «Показывать на сайте».",
        },
        "ends_at": {
            "description": "Информационное поле — пока не используется для автоматического показа.",
        },
    }
    form_excluded_columns = [Banner.created_at]

    async def on_model_change(
        self,
        data: dict,
        model: Banner,
        is_created: bool,
        request: Request,
    ) -> None:
        upload = data.pop("image_url", None)
        if upload_is_real(upload):
            ensure_extension(upload.filename or "")
            raw = await read_starlette_upload(upload)
            data["image_url"] = save_processed_sync(raw, subdir="banners")
        elif is_created:
            raise HTTPException(
                status_code=400,
                detail="Загрузите картинку для баннера",
            )
