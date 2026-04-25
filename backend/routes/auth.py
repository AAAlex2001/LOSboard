from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas.auth import CreateAccountRequest, CreateAccountResponse
from services.auth.use_cases.create_account import create_account

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/create-account", response_model=CreateAccountResponse)
async def create_account_endpoint(
    request: CreateAccountRequest,
    db: AsyncSession = Depends(get_db),
):
    return await create_account(request, db)