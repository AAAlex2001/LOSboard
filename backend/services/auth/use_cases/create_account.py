from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext

from schemas.auth import CreateAccountRequest, CreateAccountResponse
from models.user import User


password_context = CryptContext(
    schemes=["argon2"],
    argon2__memory_cost=19456,
    argon2__time_cost=2,
    argon2__parallelism=1,
)


async def create_account(
    request: CreateAccountRequest,
    db: AsyncSession,
) -> CreateAccountResponse:
    result = await db.execute(
        select(User).where(User.email == request.email)
    )
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        name=request.name,
        email=request.email,
        password=password_context.hash(request.password),
    )

    db.add(new_user)
    await db.flush()

    return CreateAccountResponse(
        message="Account created successfully",
        email=new_user.email,
    )