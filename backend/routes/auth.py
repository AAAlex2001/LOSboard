import os
import secrets
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas.auth import (
    CreateAccountRequest,
    CreateAccountResponse,
    UpdateAccountRequest,
    UpdateAccountResponse,
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    MeResponse,
    UploadAvatarResponse,
)
from models.user import User
from services.auth.dependencies import get_current_user
from services.auth.use_cases.login_account import LoginAccountUseCase
from services.auth.use_cases.create_account import CreateAccountUseCase
from services.auth.use_cases.update_account import UpdateAccountUseCase
from services.auth.use_cases.refresh_token import RefreshTokenUseCase

router = APIRouter(prefix="/auth", tags=["auth"])

ALLOWED_AVATAR_MIME = {"image/jpeg", "image/png", "image/webp", "image/gif"}
AVATAR_MAX_BYTES = 5 * 1024 * 1024
AVATARS_DIR = Path(__file__).resolve().parent.parent / "uploads" / "avatars"
AVATARS_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/create-account", response_model=CreateAccountResponse)
async def create_account_endpoint(
    request: CreateAccountRequest,
    db: AsyncSession = Depends(get_db),
):
    use_case = CreateAccountUseCase()
    return await use_case.create_account(request, db)


@router.patch("/update-account", response_model=UpdateAccountResponse)
async def update_account_endpoint(
    request: UpdateAccountRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    use_case = UpdateAccountUseCase()
    return await use_case.update_account(request, current_user.id, db)


@router.get("/me", response_model=MeResponse)
async def me_endpoint(
    current_user: User = Depends(get_current_user),
):
    return MeResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        phone_number=current_user.phone_number,
        avatar_url=current_user.avatar_url,
    )


@router.post("/avatar", response_model=UploadAvatarResponse)
async def upload_avatar(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if file.content_type not in ALLOWED_AVATAR_MIME:
        raise HTTPException(status_code=400, detail="Недопустимый формат файла")

    contents = await file.read()
    if len(contents) > AVATAR_MAX_BYTES:
        raise HTTPException(status_code=400, detail="Файл слишком большой (макс 5 МБ)")
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Пустой файл")

    ext_map = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
        "image/gif": ".gif",
    }
    ext = ext_map[file.content_type]
    filename = f"{current_user.id}_{secrets.token_hex(8)}{ext}"
    target_path = AVATARS_DIR / filename
    target_path.write_bytes(contents)

    old_url = current_user.avatar_url
    avatar_url = f"/static/uploads/avatars/{filename}"
    current_user.avatar_url = avatar_url
    db.add(current_user)
    await db.commit()

    if old_url and old_url.startswith("/static/uploads/avatars/"):
        old_path = AVATARS_DIR / Path(old_url).name
        try:
            if old_path.exists():
                os.remove(old_path)
        except OSError:
            pass

    return UploadAvatarResponse(avatar_url=avatar_url)


@router.post("/login", response_model=LoginResponse)
async def login_account_endpoint(
    request: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    use_case = LoginAccountUseCase()
    return await use_case.login_account(request, db)


@router.post("/refresh", response_model=RefreshTokenResponse)
async def refresh_token_endpoint(
    request: RefreshTokenRequest,
):
    use_case = RefreshTokenUseCase()
    return await use_case.refresh_token(request)
