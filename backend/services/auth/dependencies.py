from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.user import User
from services.auth.jwt_service import JWTService, TokenPayloadDTO


bearer_scheme = HTTPBearer()
jwt_service = JWTService()


def get_current_token_payload(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> TokenPayloadDTO:
    return jwt_service.verify_access_token(credentials.credentials)


async def get_current_user(
    token_payload: TokenPayloadDTO = Depends(get_current_token_payload),
    db: AsyncSession = Depends(get_db),
) -> User:
    result = await db.execute(select(User).where(User.id == token_payload.user_id))
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user