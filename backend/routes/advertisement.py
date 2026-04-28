from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from services.auth.dependencies import get_current_user

from services.advertisement.use_cases.create_advertisement import CreateAdvertisementUseCase
from models.user import User
from schemas.advertisement import AdvertisementCreate, AdvertisementResponse

router = APIRouter(prefix="/advertisements", tags=["advertisements"])


router.post("/create-advertisement", response_model=AdvertisementResponse)
async def create_advertisement(
    request: AdvertisementCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    use_case = CreateAdvertisementUseCase()
    new_advertisement = await use_case.create_advertisement(request, db, current_user)
    return new_advertisement