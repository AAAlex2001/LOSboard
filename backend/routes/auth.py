from fastapi import (
    APIRouter,
    Cookie,
    Depends,
    File,
    HTTPException,
    Request,
    Response,
    UploadFile,
)
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
from services.auth.cookies import clear_auth_cookies, set_auth_cookies
from services.auth.dependencies import REFRESH_TOKEN_COOKIE, get_current_user
from services.auth.use_cases.login_account import LoginAccountUseCase
from services.auth.use_cases.create_account import CreateAccountUseCase
from services.auth.use_cases.update_account import UpdateAccountUseCase
from services.auth.use_cases.refresh_token import RefreshTokenUseCase
from services.auth.use_cases.upload_avatar import UploadAvatarUseCase
from services.rate_limit import limiter

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/create-account", response_model=CreateAccountResponse)
@limiter.limit("5/minute")
async def create_account_endpoint(
    request: Request,
    payload: CreateAccountRequest,
    db: AsyncSession = Depends(get_db),
):
    use_case = CreateAccountUseCase()
    return await use_case.create_account(payload, db)


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
@limiter.limit("20/minute")
async def upload_avatar_endpoint(
    request: Request,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    use_case = UploadAvatarUseCase()
    avatar_url = await use_case.upload(file=file, db=db, current_user=current_user)
    return UploadAvatarResponse(avatar_url=avatar_url)


@router.post("/login", response_model=LoginResponse)
@limiter.limit("10/minute")
async def login_account_endpoint(
    request: Request,
    response: Response,
    payload: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    use_case = LoginAccountUseCase()
    result = await use_case.login_account(payload, db)
    set_auth_cookies(response, result.access_token, result.refresh_token)
    return result


@router.post("/refresh", response_model=RefreshTokenResponse)
@limiter.limit("20/minute")
async def refresh_token_endpoint(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
    payload: RefreshTokenRequest | None = None,
    refresh_cookie: str | None = Cookie(default=None, alias=REFRESH_TOKEN_COOKIE),
):
    token_value = (payload.refresh_token if payload else None) or refresh_cookie
    if not token_value:
        raise HTTPException(status_code=401, detail="Требуется refresh-токен")
    use_case = RefreshTokenUseCase()
    refresh_request = RefreshTokenRequest(refresh_token=token_value)
    result = await use_case.refresh_token(refresh_request, db)
    set_auth_cookies(response, result.access_token, result.refresh_token)
    return result


@router.post("/logout")
async def logout_endpoint(response: Response):
    clear_auth_cookies(response)
    return {"message": "Сессия завершена"}
