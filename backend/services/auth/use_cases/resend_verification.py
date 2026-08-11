from datetime import datetime

from fastapi import BackgroundTasks, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from schemas.auth import ResendCodeRequest, ResendCodeResponse
from models.user import User
from services.auth.verification_code import (
    CODE_TTL,
    RESEND_INTERVAL,
    generate_code,
    hash_code,
)
from services.auth.verification_email import send_verification_email


class ResendVerificationUseCase:

    async def resend(
        self,
        request: ResendCodeRequest,
        db: AsyncSession,
        background_tasks: BackgroundTasks,
    ) -> ResendCodeResponse:
        result = await db.execute(
            select(User).where(User.email == request.email)
        )
        user = result.scalar_one_or_none()

        if not user or user.email_verified:
            return ResendCodeResponse(
                message="Если аккаунт не подтверждён, код отправлен на почту"
            )

        now = datetime.utcnow()
        if (
            user.email_verification_sent_at
            and (now - user.email_verification_sent_at) < RESEND_INTERVAL
        ):
            raise HTTPException(
                status_code=429,
                detail="Подождите минуту перед повторной отправкой кода",
            )

        code = generate_code()
        user.email_verification_code_hash = hash_code(code)
        user.email_verification_expires_at = now + CODE_TTL
        user.email_verification_sent_at = now
        await db.flush()
        background_tasks.add_task(send_verification_email, user.email, code)

        return ResendCodeResponse(message="Код отправлен повторно")
