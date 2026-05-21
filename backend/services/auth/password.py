from passlib.context import CryptContext


password_context = CryptContext(
    schemes=["argon2"],
    argon2__memory_cost=19456,
    argon2__time_cost=2,
    argon2__parallelism=1,
)

DUMMY_PASSWORD_HASH = password_context.hash("dummy-password-for-constant-time-compare")
