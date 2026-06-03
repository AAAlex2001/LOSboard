from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.advertisement import Advertisement
from models.complaint import COMPLAINT_OPEN, Complaint
from models.user import User
from schemas.complaint import COMPLAINT_REASONS, ComplaintCreate


class CreateComplaintUseCase:
    async def create(
        self,
        advertisement_id: int,
        request: ComplaintCreate,
        db: AsyncSession,
        current_user: User,
    ) -> Complaint:
        if request.reason not in COMPLAINT_REASONS:
            raise HTTPException(status_code=422, detail="Неверная причина жалобы")

        ad = await db.scalar(
            select(Advertisement).where(Advertisement.id == advertisement_id)
        )
        if not ad:
            raise HTTPException(status_code=404, detail="Объявление не найдено")

        if ad.owner_id == current_user.id:
            raise HTTPException(
                status_code=400,
                detail="Нельзя пожаловаться на собственное объявление",
            )

        already = await db.scalar(
            select(Complaint.id).where(
                Complaint.advertisement_id == advertisement_id,
                Complaint.reporter_id == current_user.id,
                Complaint.status == COMPLAINT_OPEN,
            )
        )
        if already:
            raise HTTPException(
                status_code=409,
                detail="Вы уже отправили жалобу на это объявление",
            )

        complaint = Complaint(
            advertisement_id=advertisement_id,
            reporter_id=current_user.id,
            reason=request.reason,
            comment=request.comment,
            status=COMPLAINT_OPEN,
        )
        db.add(complaint)
        await db.flush()
        await db.refresh(complaint)
        return complaint
