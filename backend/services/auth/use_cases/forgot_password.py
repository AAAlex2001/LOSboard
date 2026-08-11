from datetime import datetime

from fastapi import BackgroundTasks, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from schemas.auth import ForgotPasswordRequest, MessageResponse
from models.user import User
from services.auth.verification_code import (
    CODE_TTL,
    RESEND_INTERVAL,
    generate_code,
    hash_code,
)
from services.auth.verification_email import send_password_reset_email


class ForgotPasswordUseCase:

    async def request_reset(
        self,
        request: ForgotPasswordRequest,
        db: AsyncSession,
        background_tasks: BackgroundTasks,
    ) -> MessageResponse:
        result = await db.execute(
            select(User).where(User.email == request.email)
        )
        user = result.scalar_one_or_none()

        generic = MessageResponse(
            message="Если аккаунт существует, код отправлен на почту"
        )
        if not user or not user.email_verified:
            return generic

        now = datetime.utcnow()
        if (
            user.password_reset_sent_at
            and (now - user.password_reset_sent_at) < RESEND_INTERVAL
        ):
            raise HTTPException(
                status_code=429,
                detail="Подождите минуту перед повторной отправкой кода",
            )

        code = generate_code()
        user.password_reset_code_hash = hash_code(code)
        user.password_reset_expires_at = now + CODE_TTL
        user.password_reset_sent_at = now
        await db.flush()
        background_tasks.add_task(send_password_reset_email, user.email, code)

        return generic
