from typing import Optional

from fastapi import Depends, HTTPException, Query
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.user import User
from services.auth.jwt_service import JWTService, TokenPayloadDTO


bearer_scheme = HTTPBearer()
bearer_scheme_optional = HTTPBearer(auto_error=False)
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


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme_optional),
    db: AsyncSession = Depends(get_db),
) -> Optional[User]:
    if not credentials:
        return None
    try:
        payload = jwt_service.verify_access_token(credentials.credentials)
    except HTTPException:
        return None
    result = await db.execute(select(User).where(User.id == payload.user_id))
    return result.scalars().first()


async def get_current_user_or_query_token(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme_optional),
    access_token: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
) -> User:
    token = credentials.credentials if credentials else access_token
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    payload = jwt_service.verify_access_token(token)
    result = await db.execute(select(User).where(User.id == payload.user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user