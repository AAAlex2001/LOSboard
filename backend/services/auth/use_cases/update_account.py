from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from schemas.auth import UpdateAccountRequest, UpdateAccountResponse
from models.user import User
from services.auth.password import hash_password, verify_password


class UpdateAccountUseCase:

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
            raise HTTPException(status_code=404, detail="Пользователь не найден")

        if request.password is not None or request.email is not None:
            if not request.current_password:
                raise HTTPException(
                    status_code=400,
                    detail="Для смены email или пароля укажите текущий пароль",
                )
            if not await verify_password(
                request.current_password, existing_user.password
            ):
                raise HTTPException(
                    status_code=401, detail="Неверный текущий пароль"
                )

        if request.name is not None:
            existing_user.name = request.name
        if request.password is not None:
            existing_user.password = await hash_password(request.password)
            existing_user.token_version = (existing_user.token_version or 0) + 1
        if request.phone_number is not None:
            if not request.phone_number.isdigit() or len(request.phone_number) != 11:
                raise HTTPException(status_code=400, detail="Неверный формат номера телефона")
            existing_user.phone_number = request.phone_number

        if request.email is not None and request.email != existing_user.email:
            email_check = await db.execute(
                select(User).where(User.email == request.email, User.id != user_id)
            )
            if email_check.scalar_one_or_none():
                raise HTTPException(status_code=400, detail="Email уже используется")
            existing_user.email = request.email
            existing_user.token_version = (existing_user.token_version or 0) + 1

        await db.flush()
        return UpdateAccountResponse(
            message="Аккаунт обновлён",
            email=existing_user.email,
            phone_number=existing_user.phone_number,
            name=existing_user.name,
            id=existing_user.id,
        )
