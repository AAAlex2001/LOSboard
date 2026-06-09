import os

from fastapi import Response

from services.auth.dependencies import (
    ACCESS_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE,
)


ACCESS_TOKEN_MAX_AGE_SECONDS = int(os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"]) * 60
REFRESH_TOKEN_MAX_AGE_SECONDS = int(os.environ["REFRESH_TOKEN_EXPIRE_DAYS"]) * 24 * 60 * 60
COOKIE_SECURE = os.environ.get("COOKIE_SECURE", "1") == "1"
COOKIE_SAMESITE = os.environ.get("COOKIE_SAMESITE", "lax")


def set_auth_cookies(response: Response, access_token: str, refresh_token: str) -> None:
    """Устанавливает HttpOnly cookies с токенами доступа и обновления."""
    response.set_cookie(
        key=ACCESS_TOKEN_COOKIE,
        value=access_token,
        max_age=ACCESS_TOKEN_MAX_AGE_SECONDS,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        path="/",
    )
    response.set_cookie(
        key=REFRESH_TOKEN_COOKIE,
        value=refresh_token,
        max_age=REFRESH_TOKEN_MAX_AGE_SECONDS,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        path="/",
    )


def clear_auth_cookies(response: Response) -> None:
    """Удаляет cookies с токенами."""
    response.delete_cookie(ACCESS_TOKEN_COOKIE, path="/")
    response.delete_cookie(REFRESH_TOKEN_COOKIE, path="/")
