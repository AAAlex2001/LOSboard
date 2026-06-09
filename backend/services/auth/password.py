import asyncio

from passlib.context import CryptContext


password_context = CryptContext(
    schemes=["argon2"],
    argon2__memory_cost=19456,
    argon2__time_cost=2,
    argon2__parallelism=1,
)

DUMMY_PASSWORD_HASH = password_context.hash("dummy-password-for-constant-time-compare")


async def hash_password(password: str) -> str:
    """Хеширует пароль argon2 в треде, чтобы не блокировать event loop."""
    return await asyncio.to_thread(password_context.hash, password)


async def verify_password(password: str, hashed: str) -> bool:
    """Проверяет пароль argon2 в треде, чтобы не блокировать event loop."""
    return await asyncio.to_thread(password_context.verify, password, hashed)
