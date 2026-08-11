from datetime import datetime

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from schemas.auth import VerifyResetCodeRequest, MessageResponse
from models.user import User
from services.auth.verification_code import codes_match


class VerifyResetCodeUseCase:

    async def verify(
        self,
        request: VerifyResetCodeRequest,
        db: AsyncSession,
    ) -> MessageResponse:
        result = await db.execute(
            select(User).where(User.email == request.email)
        )
        user = result.scalar_one_or_none()

        if (
            not user
            or not user.password_reset_code_hash
            or not user.password_reset_expires_at
            or user.password_reset_expires_at < datetime.utcnow()
        ):
            raise HTTPException(status_code=400, detail="Код неверный или устарел")
        if not codes_match(request.code, user.password_reset_code_hash):
            raise HTTPException(status_code=400, detail="Код неверный или устарел")

        return MessageResponse(message="Код подтверждён")
