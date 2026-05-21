from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.user import User
from schemas.auth import RefreshTokenRequest, RefreshTokenResponse
from services.auth.jwt_service import JWTService


class RefreshTokenUseCase:
    def __init__(self):
        self.jwt_service = JWTService()

    async def refresh_token(
        self,
        request: RefreshTokenRequest,
        db: AsyncSession,
    ) -> RefreshTokenResponse:
        payload = self.jwt_service.verify_refresh_token(request.refresh_token)

        result = await db.execute(select(User).where(User.id == payload.user_id))
        user = result.scalar_one_or_none()
        if not user or user.token_version != payload.token_version:
            raise HTTPException(status_code=401, detail="Token has been revoked")

        access_token = self.jwt_service.create_access_token(
            user.id, user.email, user.token_version
        )
        new_refresh_token = self.jwt_service.create_refresh_token(
            user.id, user.email, user.token_version
        )

        return RefreshTokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token,
        )
