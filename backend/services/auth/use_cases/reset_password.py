from datetime import datetime

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from schemas.auth import ResetPasswordRequest, LoginResponse
from models.user import User
from services.auth.jwt_service import JWTService
from services.auth.password import hash_password
from services.auth.verification_code import codes_match


class ResetPasswordUseCase:
    def __init__(self):
        self.jwt_service = JWTService()

    async def reset(
        self,
        request: ResetPasswordRequest,
        db: AsyncSession,
    ) -> LoginResponse:
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

        user.password = await hash_password(request.password)
        user.password_reset_code_hash = None
        user.password_reset_expires_at = None
        user.password_reset_sent_at = None
        user.email_verified = True
        user.token_version += 1
        await db.flush()

        access_token = self.jwt_service.create_access_token(
            user.id, user.email, user.token_version
        )
        refresh_token = self.jwt_service.create_refresh_token(
            user.id, user.email, user.token_version
        )

        return LoginResponse(
            message="Пароль обновлён",
            email=user.email,
            name=user.name,
            access_token=access_token,
            refresh_token=refresh_token,
            id=user.id,
        )
