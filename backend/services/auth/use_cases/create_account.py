from datetime import datetime

from fastapi import BackgroundTasks, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from schemas.auth import CreateAccountRequest, CreateAccountResponse
from models.user import User
from services.auth.password import hash_password
from services.auth.verification_code import CODE_TTL, generate_code, hash_code
from services.auth.verification_email import send_verification_email


class CreateAccountUseCase:

    async def create_account(
        self,
        request: CreateAccountRequest,
        db: AsyncSession,
        background_tasks: BackgroundTasks,
    ) -> CreateAccountResponse:
        result = await db.execute(
            select(User).where(User.email == request.email)
        )
        existing_user = result.scalar_one_or_none()

        if existing_user and existing_user.email_verified:
            raise HTTPException(status_code=400, detail="Email уже зарегистрирован")

        code = generate_code()
        now = datetime.utcnow()

        if existing_user:
            existing_user.name = request.name
            existing_user.password = await hash_password(request.password)
            existing_user.email_verification_code_hash = hash_code(code)
            existing_user.email_verification_expires_at = now + CODE_TTL
            existing_user.email_verification_sent_at = now
            user = existing_user
        else:
            user = User(
                name=request.name,
                email=request.email,
                password=await hash_password(request.password),
                email_verified=False,
                email_verification_code_hash=hash_code(code),
                email_verification_expires_at=now + CODE_TTL,
                email_verification_sent_at=now,
            )
            db.add(user)

        await db.flush()
        background_tasks.add_task(send_verification_email, user.email, code)

        return CreateAccountResponse(
            message="Код подтверждения отправлен на почту",
            email=user.email,
            id=user.id,
        )
