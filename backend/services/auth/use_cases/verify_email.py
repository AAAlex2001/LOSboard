from datetime import datetime

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from schemas.auth import VerifyEmailRequest, LoginResponse
from models.user import User
from services.auth.jwt_service import JWTService
from services.auth.verification_code import codes_match


class VerifyEmailUseCase:
    def __init__(self):
        self.jwt_service = JWTService()

    async def verify_email(
        self,
        request: VerifyEmailRequest,
        db: AsyncSession,
    ) -> LoginResponse:
        result = await db.execute(
            select(User).where(User.email == request.email)
        )
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=400, detail="Неверный код")
        if user.email_verified:
            raise HTTPException(status_code=400, detail="Почта уже подтверждена")
        if (
            not user.email_verification_code_hash
            or not user.email_verification_expires_at
            or user.email_verification_expires_at < datetime.utcnow()
        ):
            raise HTTPException(
                status_code=400, detail="Код устарел, запросите новый"
            )
        if not codes_match(request.code, user.email_verification_code_hash):
            raise HTTPException(status_code=400, detail="Неверный код")

        user.email_verified = True
        user.email_verification_code_hash = None
        user.email_verification_expires_at = None
        user.email_verification_sent_at = None
        await db.flush()

        access_token = self.jwt_service.create_access_token(
            user.id, user.email, user.token_version
        )
        refresh_token = self.jwt_service.create_refresh_token(
            user.id, user.email, user.token_version
        )

        return LoginResponse(
            message="Почта подтверждена",
            email=user.email,
            name=user.name,
            access_token=access_token,
            refresh_token=refresh_token,
            id=user.id,
        )
