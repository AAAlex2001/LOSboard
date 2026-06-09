from typing import Optional

from fastapi import Cookie, Depends, HTTPException, Query
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.user import User
from services.auth.jwt_service import JWTService, TokenPayloadDTO


ACCESS_TOKEN_COOKIE = "los_access"
REFRESH_TOKEN_COOKIE = "los_refresh"

bearer_scheme_optional = HTTPBearer(auto_error=False)
jwt_service = JWTService()


def extract_access_token(
    credentials: Optional[HTTPAuthorizationCredentials],
    cookie_token: Optional[str],
) -> Optional[str]:
    if credentials and credentials.credentials:
        return credentials.credentials
    return cookie_token or None


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme_optional),
    access_cookie: Optional[str] = Cookie(default=None, alias=ACCESS_TOKEN_COOKIE),
    db: AsyncSession = Depends(get_db),
) -> User:
    token = extract_access_token(credentials, access_cookie)
    if not token:
        raise HTTPException(status_code=401, detail="Требуется авторизация")

    payload = jwt_service.verify_access_token(token)
    result = await db.execute(select(User).where(User.id == payload.user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=401, detail="Пользователь не найден")
    if user.token_version != payload.token_version:
        raise HTTPException(status_code=401, detail="Токен отозван")
    if user.is_banned:
        raise HTTPException(status_code=403, detail="Аккаунт заблокирован")
    return user


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme_optional),
    access_cookie: Optional[str] = Cookie(default=None, alias=ACCESS_TOKEN_COOKIE),
    db: AsyncSession = Depends(get_db),
) -> Optional[User]:
    token = extract_access_token(credentials, access_cookie)
    if not token:
        return None
    try:
        payload = jwt_service.verify_access_token(token)
    except HTTPException:
        return None
    result = await db.execute(select(User).where(User.id == payload.user_id))
    user = result.scalars().first()
    if not user or user.token_version != payload.token_version:
        return None
    if user.is_banned:
        return None
    return user


async def get_current_user_or_query_token(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme_optional),
    access_cookie: Optional[str] = Cookie(default=None, alias=ACCESS_TOKEN_COOKIE),
    access_token: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
) -> User:
    token = extract_access_token(credentials, access_cookie) or access_token
    if not token:
        raise HTTPException(status_code=401, detail="Требуется авторизация")

    payload = jwt_service.verify_access_token(token)
    result = await db.execute(select(User).where(User.id == payload.user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=401, detail="Пользователь не найден")
    if user.token_version != payload.token_version:
        raise HTTPException(status_code=401, detail="Токен отозван")
    if user.is_banned:
        raise HTTPException(status_code=403, detail="Аккаунт заблокирован")
    return user
