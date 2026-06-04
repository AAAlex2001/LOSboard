"""Жалобы пользователей на объявления."""

from datetime import datetime
from typing import Any

from markupsafe import Markup
from sqladmin import ModelView, action
from sqlalchemy import update
from starlette.requests import Request
from starlette.responses import RedirectResponse
from wtforms import SelectField

from admin.views.common import (
    COMPLAINT_CHOICES,
    COMPLAINT_REASON_CHOICES,
    complaint_badge,
    complaint_reason_label,
    redirect_to_list,
    selected_pks,
)
from models.complaint import COMPLAINT_DISMISSED, COMPLAINT_RESOLVED, Complaint


def fmt_complaint_status(model: Any, _attr: Any) -> Markup:
    return complaint_badge(model.status)


def fmt_complaint_reason(model: Any, _attr: Any) -> str:
    return complaint_reason_label(model.reason)


class ComplaintAdmin(ModelView, model=Complaint):
    name = "жалобу"
    name_plural = "Жалобы"
    icon = "fa-solid fa-flag"
    column_list = [
        Complaint.id,
        Complaint.advertisement,
        Complaint.reporter,
        Complaint.reason,
        Complaint.status,
        Complaint.created_at,
    ]
    column_sortable_list = [Complaint.id, Complaint.created_at, Complaint.status]
    column_searchable_list = [Complaint.reason, Complaint.comment]
    column_labels = {
        Complaint.id: "ID",
        Complaint.advertisement_id: "ID объявления",
        Complaint.advertisement: "Объявление",
        Complaint.reporter_id: "ID жалующегося",
        Complaint.reporter: "Жалуется",
        Complaint.reason: "Причина",
        Complaint.comment: "Комментарий",
        Complaint.status: "Статус",
        Complaint.created_at: "Создано",
        Complaint.resolved_at: "Закрыто",
        Complaint.resolved_by_id: "ID закрывшего",
        Complaint.resolved_by: "Закрыл",
    }
    column_formatters = {
        Complaint.status: fmt_complaint_status,
        Complaint.reason: fmt_complaint_reason,
    }
    column_formatters_detail = {
        Complaint.status: fmt_complaint_status,
        Complaint.reason: fmt_complaint_reason,
    }
    form_overrides = {
        "status": SelectField,
        "reason": SelectField,
    }
    form_args = {
        "status": {"choices": COMPLAINT_CHOICES},
        "reason": {"choices": COMPLAINT_REASON_CHOICES},
    }
    column_default_sort = [("created_at", True)]

    async def apply_resolution(
        self, request: Request, status: str
    ) -> RedirectResponse:
        pks = selected_pks(request)
        if pks:
            async with self.session_maker() as session:
                await session.execute(
                    update(Complaint)
                    .where(Complaint.id.in_(pks))
                    .values(
                        status=status,
                        resolved_at=datetime.utcnow(),
                        resolved_by_id=request.session.get("admin_user_id"),
                    )
                )
                await session.commit()
        return redirect_to_list(request, self.identity)

    @action(
        name="resolve",
        label="Закрыть (нарушение подтверждено)",
        confirmation_message="Закрыть жалобы как подтверждённые?",
    )
    async def resolve_action(self, request: Request) -> RedirectResponse:
        return await self.apply_resolution(request, COMPLAINT_RESOLVED)

    @action(
        name="dismiss",
        label="Отклонить жалобу",
        confirmation_message="Отклонить выбранные жалобы?",
    )
    async def dismiss_action(self, request: Request) -> RedirectResponse:
        return await self.apply_resolution(request, COMPLAINT_DISMISSED)
