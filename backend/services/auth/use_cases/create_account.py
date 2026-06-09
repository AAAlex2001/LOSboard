from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from schemas.auth import CreateAccountRequest, CreateAccountResponse
from models.user import User
from services.auth.password import hash_password


class CreateAccountUseCase:

    async def create_account(
        self,
        request: CreateAccountRequest,
        db: AsyncSession,
    ) -> CreateAccountResponse:
        result = await db.execute(
            select(User).where(User.email == request.email)
        )
        existing_user = result.scalar_one_or_none()

        if existing_user:
            raise HTTPException(status_code=400, detail="Email уже зарегистрирован")

        new_user = User(
            name=request.name,
            email=request.email,
            password=await hash_password(request.password),
        )

        db.add(new_user)
        await db.flush()

        return CreateAccountResponse(
            message="Аккаунт создан",
            email=new_user.email,
            id=new_user.id,
        )
