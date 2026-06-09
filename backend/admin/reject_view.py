"""Кастомная страница отклонения объявлений с причиной + комментарием.

SQLAdmin не умеет принимать произвольный текст в bulk-action, поэтому action
в `AdvertisementAdmin` редиректит сюда с query-параметром `pks`, а здесь уже
показывается форма и применяется обновление.
"""

from datetime import datetime
from typing import Sequence

from sqladmin import BaseView, expose
from sqlalchemy import update
from starlette.requests import Request
from starlette.responses import RedirectResponse, Response

from database import AsyncSessionLocal
from models.advertisement import MODERATION_REJECTED, Advertisement


REJECT_PRESETS: Sequence[tuple[str, str]] = (
    ("spam", "Спам"),
    ("wrong_category", "Неверная категория"),
    ("forbidden", "Запрещённый товар"),
    ("custom", "Свой текст (укажите в комментарии)"),
)
REJECT_PRESET_LABEL = dict(REJECT_PRESETS)


def parse_pks(raw: str) -> list[int]:
    return [int(x) for x in raw.split(",") if x.strip().isdigit()]


def build_reason(preset: str, comment: str) -> str:
    comment = (comment or "").strip()
    label = REJECT_PRESET_LABEL.get(preset, "Нарушение правил")
    if preset == "custom":
        return comment or "Нарушение правил"
    if comment:
        return f"{label}: {comment}"
    return label


class RejectAdvertisementsView(BaseView):
    """Форма ручного отклонения объявлений с пресетной причиной и комментарием."""

    name = "Отклонить объявления"
    icon = "fa-solid fa-ban"

    def is_visible(self, request: Request) -> bool:
        return False

    def is_accessible(self, request: Request) -> bool:
        return bool(request.session.get("admin_user_id"))

    @expose("/advertisements/reject", methods=["GET", "POST"], identity="reject-ads")
    async def reject(self, request: Request) -> Response:
        pks = parse_pks(request.query_params.get("pks", ""))
        cancel_url = request.url_for("admin:list", identity="advertisement")

        if request.method == "POST":
            form = await request.form()
            pks = parse_pks(str(form.get("pks", "")))
            reason = build_reason(
                str(form.get("preset", "")),
                str(form.get("comment", "")),
            )
            if pks:
                async with AsyncSessionLocal() as session:
                    await session.execute(
                        update(Advertisement)
                        .where(
                            Advertisement.id.in_(pks),
                            Advertisement.deleted_at.is_(None),
                        )
                        .values(
                            moderation_status=MODERATION_REJECTED,
                            moderation_reason=reason,
                            moderated_at=datetime.utcnow(),
                            moderated_by_id=request.session.get("admin_user_id"),
                        )
                    )
                    await session.commit()
            return RedirectResponse(str(cancel_url), status_code=302)

        return await self.templates.TemplateResponse(
            request,
            "reject_advertisements.html",
            context={
                "count": len(pks),
                "pks_csv": ",".join(str(pk) for pk in pks),
                "preset_choices": list(REJECT_PRESETS),
                "form_action": str(
                    request.url_for("admin:reject-ads").include_query_params(
                        pks=",".join(str(pk) for pk in pks)
                    )
                ),
                "cancel_url": str(cancel_url),
            },
        )
