"""Рекламные баннеры. Картинка загружается с компа, конвертится в WebP."""

import os
import uuid
from pathlib import Path
from typing import Any

from fastapi import HTTPException
from markupsafe import Markup
from sqladmin import ModelView
from sqladmin.fields import FileField
from starlette.requests import Request
from wtforms.fields import SelectField

from admin.views.common import (
    BANNER_PLACEMENT_CHOICES,
    AdminOnly,
    banner_placement_badge,
    img_thumb,
    read_starlette_upload,
    upload_is_real,
)
from models.banner import Banner
from services.uploads.image import ensure_extension, save_processed_sync


# Каталог /backend/uploads (тот же, что main.py монтирует под /static/uploads).
BANNER_UPLOADS_DIR = Path(__file__).resolve().parents[2] / "uploads" / "banners"

VIDEO_ALLOWED_EXTS = {".mp4", ".webm", ".mov"}
VIDEO_MAX_BYTES = 10 * 1024 * 1024


async def _validate_and_get_video_size(upload) -> int:
    ext = os.path.splitext(upload.filename or "")[1].lower()
    if ext not in VIDEO_ALLOWED_EXTS:
        raise HTTPException(
            status_code=400,
            detail=f"Неподдерживаемый формат видео {ext}. Используйте MP4 или WebM.",
        )
    contents = await upload.read()
    await upload.seek(0)
    return len(contents)


async def _save_banner_video(upload) -> str:
    ext = os.path.splitext(upload.filename or "")[1].lower()
    filename = f"{uuid.uuid4().hex}{ext}"
    contents = await upload.read()

    BANNER_UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    target_path = BANNER_UPLOADS_DIR / filename
    with open(target_path, "wb") as f:
        f.write(contents)
    return f"/static/uploads/banners/{filename}"


def fmt_banner_thumb_small(model: Any, _attr: Any) -> Markup:
    if not model.image_url:
        return Markup('<span style="color:#999">—</span>')
    return Markup(img_thumb(model.image_url, size=80))


def fmt_banner_thumb_large(model: Any, _attr: Any) -> Markup:
    if not model.image_url:
        return Markup('<span style="color:#999">—</span>')
    return Markup(img_thumb(model.image_url, size=300))


def fmt_banner_placement(model: Any, _attr: Any) -> Markup:
    return banner_placement_badge(getattr(model, "placement", "") or "")


class BannerAdmin(AdminOnly, ModelView, model=Banner):
    name = "баннер"
    name_plural = "Баннеры"
    icon = "fa-solid fa-image"
    column_list = [
        Banner.id,
        Banner.image_url,
        Banner.title,
        Banner.placement,
        Banner.link_url,
        Banner.sort_order,
        Banner.is_active,
        Banner.starts_at,
        Banner.ends_at,
    ]
    column_searchable_list = [Banner.title, Banner.description, Banner.link_url]
    column_sortable_list = [
        Banner.id,
        Banner.placement,
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
        Banner.video_url: "Видео (MP4 / WebM, до 10 МБ, опционально)",
        Banner.link_url: "Куда ведёт клик по баннеру (опционально)",
        Banner.placement: "Размещение",
        Banner.sort_order: "Порядок (меньше — выше)",
        Banner.is_active: "Показывать на сайте",
        Banner.starts_at: "Старт показа (для заметки)",
        Banner.ends_at: "Конец показа (для заметки)",
        Banner.created_at: "Создан",
    }
    column_formatters = {
        Banner.image_url: fmt_banner_thumb_small,
        Banner.placement: fmt_banner_placement,
    }
    column_formatters_detail = {
        Banner.image_url: fmt_banner_thumb_large,
        Banner.placement: fmt_banner_placement,
    }
    column_default_sort = [("sort_order", False)]
    form_overrides = {
        "image_url": FileField,
        "video_url": FileField,
        "placement": SelectField,
    }
    form_args = {
        "image_url": {
            "description": "Выберите файл с компьютера. JPG, PNG или WebP, до 10 МБ.",
        },
        "video_url": {
            "description": "Опционально: видео MP4/WebM, до 10 МБ. Если указано, отображается вместо картинки с автовоспроизведением.",
        },
        "placement": {
            "choices": BANNER_PLACEMENT_CHOICES,
            "description": "Где показывать баннер. «Шапка главной» — 3 верхних баннера "
            "на главной странице. «Боковая панель» — 2 баннера в правом сайдбаре сайта.",
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

        video_upload = data.pop("video_url", None)
        if upload_is_real(video_upload):
            size_bytes = await _validate_and_get_video_size(video_upload)
            if size_bytes > VIDEO_MAX_BYTES:
                raise HTTPException(
                    status_code=400,
                    detail="Видео должно быть не больше 10 МБ",
                )
            data["video_url"] = await _save_banner_video(video_upload)
