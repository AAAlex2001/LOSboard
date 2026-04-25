from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext

from schemas.auth import LoginRequest, LoginResponse
from models.user import User
from services.auth.jwt_service import JWTService


password_context = CryptContext(
    schemes=["argon2"],
    argon2__memory_cost=19456,
    argon2__time_cost=2,
    argon2__parallelism=1,
)

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

        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if not self.password_context.verify(request.password, user.password):
            raise HTTPException(status_code=401, detail="Incorrect password")
        
        access_token = self.jwt_service.create_access_token(user.id, user.email)
        refresh_token = self.jwt_service.create_refresh_token(user.id, user.email)

        return LoginResponse(
            message="Login successful",
            email=user.email,
            name=user.name,
            access_token=access_token,
            refresh_token=refresh_token,
            id=user.id,
        )