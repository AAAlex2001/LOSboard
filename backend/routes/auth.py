from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas.auth import CreateAccountRequest, CreateAccountResponse, UpdateAccountRequest, UpdateAccountResponse
from services.auth.use_cases.create_account import CreateAccountUseCase
from services.auth.use_cases.update_account import UpdateAccountUseCase

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
):
    use_case = UpdateAccountUseCase()
    return await use_case.update_account(request, db)