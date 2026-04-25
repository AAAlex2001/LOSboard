from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext

from schemas.auth import UpdateAccountRequest, UpdateAccountResponse
from models.user import User


password_context = CryptContext(
    schemes=["argon2"],
    argon2__memory_cost=19456,
    argon2__time_cost=2,
    argon2__parallelism=1,
)


class UpdateAccountUseCase:
    def __init__(self):
        self.password_context = password_context

    async def update_account(
        self,
        request: UpdateAccountRequest,
        user_id: int,
        db: AsyncSession,
    ) -> UpdateAccountResponse:
        result = await db.execute(
            select(User).where(User.id == user_id)
        )
        existing_user = result.scalar_one_or_none()

        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found")

        if request.name is not None:
            existing_user.name = request.name
        if request.password is not None:
            existing_user.password = self.password_context.hash(request.password)
        if request.phone_number is not None:
            if not request.phone_number.isdigit() or len(request.phone_number) != 11:
                raise HTTPException(status_code=400, detail="Invalid phone number format")
            existing_user.phone_number = request.phone_number

        if request.email is not None:
            email_check = await db.execute(
                select(User).where(User.email == request.email, User.id != user_id)
            )
            if email_check.scalar_one_or_none():
                raise HTTPException(status_code=400, detail="Email already in use")
            existing_user.email = request.email

        await db.flush()
        return UpdateAccountResponse(
            message="Account updated successfully",
            email=existing_user.email,
            phone_number=existing_user.phone_number,
            name=existing_user.name,
            id=existing_user.id,
        )
    