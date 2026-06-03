from sqlalchemy import select
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request

from database import AsyncSessionLocal
from models.user import STAFF_ROLES, User
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

        if not user or not password_ok or not user.is_active:
            return False
        if user.role not in STAFF_ROLES:
            return False
        if user.is_banned:
            return False

        request.session.update(
            {"admin_user_id": user.id, "admin_role": user.role}
        )
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
                select(User).where(
                    User.id == user_id,
                    User.is_active == True,
                )
            )
            user = result.scalar_one_or_none()

        if not user or user.role not in STAFF_ROLES or user.is_banned:
            request.session.clear()
            return False

        request.session["admin_role"] = user.role
        return True
