import os
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException
from jose import JWTError, jwt


ALLOWED_JWT_ALGORITHMS = {"HS256"}
DEFAULT_JWT_ALGORITHM = "HS256"


def _resolve_jwt_algorithm(raw: str | None) -> str:
    """Возвращает безопасный алгоритм: пустое/none → HS256, чужой алгоритм → ошибка старта."""
    candidate = (raw or "").strip()
    if not candidate or candidate.lower() == "none":
        return DEFAULT_JWT_ALGORITHM
    if candidate not in ALLOWED_JWT_ALGORITHMS:
        raise ValueError(
            f"JWT_ALGORITHM={candidate!r} запрещён; разрешены только {sorted(ALLOWED_JWT_ALGORITHMS)}"
        )
    return candidate


JWT_SECRET_KEY = os.environ["JWT_SECRET_KEY"]
JWT_ALGORITHM = _resolve_jwt_algorithm(os.environ.get("JWT_ALGORITHM"))
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"])
REFRESH_TOKEN_EXPIRE_DAYS = int(os.environ["REFRESH_TOKEN_EXPIRE_DAYS"])


@dataclass
class TokenDTO:
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


@dataclass
class TokenPayloadDTO:
    user_id: int
    email: str
    token_type: str
    token_version: int


class JWTService:
    def __init__(
        self,
        secret_key: str = JWT_SECRET_KEY,
        algorithm: str = JWT_ALGORITHM,
        access_token_expire_minutes: int = ACCESS_TOKEN_EXPIRE_MINUTES,
        refresh_token_expire_days: int = REFRESH_TOKEN_EXPIRE_DAYS,
    ):
        if not secret_key:
            raise ValueError("JWT_SECRET_KEY must be set")

        self.secret_key = secret_key
        self.algorithm = _resolve_jwt_algorithm(algorithm)
        self.access_token_expire_minutes = access_token_expire_minutes
        self.refresh_token_expire_days = refresh_token_expire_days

    def create_access_token(self, user_id: int, email: str, token_version: int) -> str:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=self.access_token_expire_minutes
        )
        payload = {
            "sub": str(user_id),
            "email": email,
            "type": "access",
            "tv": token_version,
            "exp": expire,
        }
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)

    def create_refresh_token(self, user_id: int, email: str, token_version: int) -> str:
        expire = datetime.now(timezone.utc) + timedelta(
            days=self.refresh_token_expire_days
        )
        payload = {
            "sub": str(user_id),
            "email": email,
            "type": "refresh",
            "tv": token_version,
            "exp": expire,
        }
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)

    def create_tokens(self, user_id: int, email: str, token_version: int) -> TokenDTO:
        access_token = self.create_access_token(user_id, email, token_version)
        refresh_token = self.create_refresh_token(user_id, email, token_version)
        return TokenDTO(
            access_token=access_token,
            refresh_token=refresh_token,
        )

    def verify_token(self, token: str) -> TokenPayloadDTO:
        try:
            payload = jwt.decode(
                token,
                self.secret_key,
                algorithms=[self.algorithm],
            )

            user_id = payload.get("sub")
            email = payload.get("email")
            token_type = payload.get("type")
            token_version = payload.get("tv")

            if (
                user_id is None
                or email is None
                or token_type is None
                or token_version is None
            ):
                raise HTTPException(status_code=401, detail="Невалидный токен")

            return TokenPayloadDTO(
                user_id=int(user_id),
                email=email,
                token_type=token_type,
                token_version=int(token_version),
            )

        except JWTError:
            raise HTTPException(status_code=401, detail="Невалидный или просроченный токен")

    def verify_access_token(self, token: str) -> TokenPayloadDTO:
        payload = self.verify_token(token)
        if payload.token_type != "access":
            raise HTTPException(status_code=401, detail="Неверный тип токена")
        return payload

    def verify_refresh_token(self, token: str) -> TokenPayloadDTO:
        payload = self.verify_token(token)
        if payload.token_type != "refresh":
            raise HTTPException(status_code=401, detail="Неверный тип токена")
        return payload
