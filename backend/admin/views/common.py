"""Общие хелперы, дроп-даун-варианты и форматтеры для всех вью админки."""

import os
from datetime import datetime, timedelta
from typing import Any

from fastapi import HTTPException
from markupsafe import Markup, escape
from starlette.requests import Request
from starlette.responses import RedirectResponse

from models.advertisement import (
    MODERATION_APPROVED,
    MODERATION_PENDING,
    MODERATION_REJECTED,
)
from models.complaint import (
    COMPLAINT_DISMISSED,
    COMPLAINT_OPEN,
    COMPLAINT_RESOLVED,
)
from models.user import ADMIN_ROLE, MODERATOR_ROLE, USER_ROLE
from services.uploads.image import MAX_FILE_BYTES


PERMANENT_BAN_UNTIL = datetime(9999, 12, 31)

MODERATION_CHOICES = [
    (MODERATION_PENDING, "Ожидает модерации"),
    (MODERATION_APPROVED, "Одобрено"),
    (MODERATION_REJECTED, "Отклонено"),
]

COMPLAINT_CHOICES = [
    (COMPLAINT_OPEN, "Открыта"),
    (COMPLAINT_RESOLVED, "Закрыта (нарушение подтверждено)"),
    (COMPLAINT_DISMISSED, "Отклонена"),
]

COMPLAINT_REASON_CHOICES = [
    ("spam", "Спам"),
    ("wrong_category", "Неверная категория"),
    ("forbidden", "Запрещённый товар"),
    ("fraud", "Мошенничество"),
    ("offensive", "Оскорбительный контент"),
    ("other", "Другое"),
]

ROLE_CHOICES = [
    (USER_ROLE, "Пользователь"),
    (MODERATOR_ROLE, "Модератор"),
    (ADMIN_ROLE, "Администратор"),
]

ATTRIBUTE_KIND_CHOICES = [
    ("text", "Текст"),
    ("number", "Число"),
    ("select", "Выбор из списка"),
    ("boolean", "Да/Нет"),
]

BANNER_PLACEMENT_CHOICES = [
    ("main_top", "Шапка главной страницы (3 баннера сверху)"),
    ("sidebar", "Боковая панель сайта (2 баннера)"),
]

MODERATION_LABEL = dict(MODERATION_CHOICES)
COMPLAINT_LABEL = dict(COMPLAINT_CHOICES)
COMPLAINT_REASON_LABEL = dict(COMPLAINT_REASON_CHOICES)
ROLE_LABEL = dict(ROLE_CHOICES)
BANNER_PLACEMENT_LABEL = dict(BANNER_PLACEMENT_CHOICES)


class AdminOnly:
    """Миксин для вью, доступных только главному админу."""

    def is_visible(self, request: Request) -> bool:
        return request.session.get("admin_role") == ADMIN_ROLE

    def is_accessible(self, request: Request) -> bool:
        return request.session.get("admin_role") == ADMIN_ROLE


def selected_pks(request: Request) -> list[int]:
    raw = request.query_params.get("pks", "")
    return [int(x) for x in raw.split(",") if x.strip().isdigit()]


def redirect_to_list(request: Request, identity: str) -> RedirectResponse:
    return RedirectResponse(request.url_for("admin:list", identity=identity))


def parse_iso_date(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return None


def apply_date_range(stmt: Any, request: Request, column: Any) -> Any:
    """Фильтрует select по диапазону дат из query-параметров `date_from`/`date_to`."""
    date_from = parse_iso_date(request.query_params.get("date_from"))
    date_to = parse_iso_date(request.query_params.get("date_to"))
    if date_from is not None:
        stmt = stmt.where(column >= date_from)
    if date_to is not None:
        stmt = stmt.where(column < date_to + timedelta(days=1))
    return stmt


def upload_is_real(upload: Any) -> bool:
    """SQLAdmin/wtforms может прислать пустышку — отличаем её от настоящего файла."""
    filename = getattr(upload, "filename", "") or ""
    return bool(filename.strip())


async def read_starlette_upload(upload: Any) -> bytes:
    """Читает Starlette UploadFile с проверкой лимита размера."""
    raw = b""
    while True:
        chunk = await upload.read(1024 * 1024)
        if not chunk:
            break
        raw += chunk
        if len(raw) > MAX_FILE_BYTES:
            raise HTTPException(status_code=400, detail="Файл больше 10 МБ")
    return raw


def img_thumb(url: str, *, size: int = 60) -> str:
    safe_url = escape(url)
    return (
        f'<a href="{safe_url}" target="_blank" rel="noreferrer">'
        f'<img src="{safe_url}" alt="" '
        f'style="max-width:{size}px; max-height:{size}px; '
        f'object-fit:cover; border-radius:6px; '
        f'border:1px solid #ddd; margin:2px;" /></a>'
    )


def photo_thumbs(urls: list[str], size: int) -> Markup:
    if not urls:
        return Markup('<span style="color:#999">—</span>')
    return Markup(
        '<div style="display:flex; flex-wrap:wrap; gap:4px; max-width:520px;">'
        + "".join(img_thumb(u, size=size) for u in urls)
        + "</div>"
    )


def make_badge(bg: str, fg: str, label: str) -> Markup:
    return Markup(
        f'<span style="background:{bg}; color:{fg}; padding:2px 8px; '
        f'border-radius:10px; font-size:12px; white-space:nowrap;">'
        f"{escape(label)}</span>"
    )


def moderation_badge(status: str) -> Markup:
    palette = {
        MODERATION_PENDING: ("#FFB300", "#FFFFFF"),
        MODERATION_APPROVED: ("#2E7D32", "#FFFFFF"),
        MODERATION_REJECTED: ("#C62828", "#FFFFFF"),
    }
    bg, fg = palette.get(status, ("#666", "#FFFFFF"))
    return make_badge(bg, fg, MODERATION_LABEL.get(status, status or "—"))


def complaint_badge(status: str) -> Markup:
    palette = {
        COMPLAINT_OPEN: ("#FB8C00", "#FFFFFF"),
        COMPLAINT_RESOLVED: ("#2E7D32", "#FFFFFF"),
        COMPLAINT_DISMISSED: ("#616161", "#FFFFFF"),
    }
    bg, fg = palette.get(status, ("#666", "#FFFFFF"))
    return make_badge(bg, fg, COMPLAINT_LABEL.get(status, status or "—"))


def role_badge(role: str) -> Markup:
    palette = {
        "admin": ("#1565C0", "#FFFFFF"),
        "moderator": ("#6A1B9A", "#FFFFFF"),
        "user": ("#90A4AE", "#FFFFFF"),
    }
    bg, fg = palette.get(role, ("#666", "#FFFFFF"))
    return make_badge(bg, fg, ROLE_LABEL.get(role, role or "—"))


def banner_placement_badge(placement: str) -> Markup:
    palette = {
        "main_top": ("#1565C0", "#FFFFFF"),
        "sidebar": ("#6A1B9A", "#FFFFFF"),
    }
    bg, fg = palette.get(placement, ("#666", "#FFFFFF"))
    return make_badge(
        bg, fg, BANNER_PLACEMENT_LABEL.get(placement, placement or "—")
    )


def complaint_reason_label(reason: str) -> str:
    return COMPLAINT_REASON_LABEL.get(reason, reason or "—")


def avatar_thumb(url: str | None, *, size: int = 40) -> Markup:
    if not url:
        return Markup('<span style="color:#999">—</span>')
    safe_url = escape(url)
    return Markup(
        f'<a href="{safe_url}" target="_blank" rel="noreferrer">'
        f'<img src="{safe_url}" alt="" '
        f'style="width:{size}px; height:{size}px; '
        f'border-radius:50%; object-fit:cover; border:1px solid #ddd;" /></a>'
    )


def user_ads_list(ads: list) -> Markup:
    if not ads:
        return Markup('<span style="color:#999">У пользователя нет объявлений</span>')
    base = os.environ.get("ADMIN_BASE_URL", "/admin").rstrip("/")
    items = []
    for ad in ads:
        href = f"{base}/advertisement/details/{ad.id}"
        status = MODERATION_LABEL.get(ad.moderation_status, ad.moderation_status or "—")
        items.append(
            f'<li style="padding:4px 0;">'
            f'<a href="{escape(href)}" style="color:#1565C0;">'
            f"#{ad.id} — {escape(ad.title)}"
            f"</a> "
            f'<span style="color:#666; font-size:12px;">'
            f"({escape(status)}, {ad.price} ₽)</span>"
            f"</li>"
        )
    return Markup(
        '<ul style="list-style:none; padding-left:0; margin:0; max-height:400px; overflow:auto;">'
        + "".join(items)
        + "</ul>"
    )
