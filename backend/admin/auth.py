from sqlalchemy import select
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request

from database import AsyncSessionLocal
from models.user import User
from services.auth.password import DUMMY_PASSWORD_HASH, password_context


class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        email = str(form.get("username", "")).strip().lower()
        password = str(form.get("password", ""))

        async with AsyncSessionLocal() as session:
            result = await session.execute(select(User).where(User.email == email))
            user = result.scalar_one_or_none()

        password_hash = user.password if user else DUMMY_PASSWORD_HASH
        password_ok = password_context.verify(password, password_hash)

        if not user or not password_ok or not user.is_active or not user.is_admin:
            return False

        request.session.update({"admin_user_id": user.id})
        return True

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        user_id = request.session.get("admin_user_id")
        if not user_id:
            return False

        async with AsyncSessionLocal() as session:
            result = await session.execute(
                select(User.id).where(
                    User.id == user_id,
                    User.is_active == True,
                    User.is_admin == True,
                )
            )
            return result.scalar_one_or_none() is not None
