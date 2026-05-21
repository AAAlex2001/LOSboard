from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from schemas.auth import LoginRequest, LoginResponse
from models.user import User
from services.auth.jwt_service import JWTService
from services.auth.password import password_context, DUMMY_PASSWORD_HASH


class LoginAccountUseCase:
    def __init__(self):
        self.password_context = password_context
        self.jwt_service = JWTService()

    async def login_account(
        self,
        request: LoginRequest,
        db: AsyncSession,
    ) -> LoginResponse:
        result = await db.execute(
            select(User).where(User.email == request.email)
        )
        user = result.scalar_one_or_none()

        password_to_check = user.password if user else DUMMY_PASSWORD_HASH
        password_ok = self.password_context.verify(request.password, password_to_check)

        if not user or not password_ok:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        access_token = self.jwt_service.create_access_token(
            user.id, user.email, user.token_version
        )
        refresh_token = self.jwt_service.create_refresh_token(
            user.id, user.email, user.token_version
        )

        return LoginResponse(
            message="Login successful",
            email=user.email,
            name=user.name,
            access_token=access_token,
            refresh_token=refresh_token,
            id=user.id,
        )
