from fastapi import APIRouter, Depends, File, UploadFile
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
from services.auth.use_cases.upload_avatar import UploadAvatarUseCase

router = APIRouter(prefix="/auth", tags=["auth"])


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
async def upload_avatar_endpoint(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    use_case = UploadAvatarUseCase()
    avatar_url = await use_case.upload(file=file, db=db, current_user=current_user)
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
    db: AsyncSession = Depends(get_db),
):
    use_case = RefreshTokenUseCase()
    return await use_case.refresh_token(request, db)
