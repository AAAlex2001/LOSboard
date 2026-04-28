from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from services.auth.dependencies import get_current_user

from services.advertisement.use_cases.create_advertisement import CreateAdvertisementUseCase
from services.advertisement.use_cases.get_advertisement import GetAdvertisementUseCase
from services.advertisement.use_cases.get_list_advertisements import GetListAdvertisementsUseCase
from services.advertisement.use_cases.update_advertisement import UpdateAdvertisementUseCase
from services.advertisement.use_cases.delete_advertisement import DeleteAdvertisementUseCase
from services.advertisement.use_cases.find_advertisements_by_text import FindAdvertisementsByTextUseCase

from models.user import User
from schemas.advertisement import AdvertisementCreate, AdvertisementResponse, AdvertisementUpdate


router = APIRouter(prefix="/advertisements", tags=["advertisements"])


@router.post("/create", response_model=AdvertisementResponse)
async def create_advertisement(
    request: AdvertisementCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    use_case = CreateAdvertisementUseCase()

    new_advertisement = await use_case.create_advertisement(
        request=request,
        db=db,
        current_user=current_user,
    )

    return new_advertisement


@router.get("/", response_model=list[AdvertisementResponse])
async def get_list_advertisements(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    use_case = GetListAdvertisementsUseCase()

    advertisements = await use_case.get_list_advertisements(
        skip=skip,
        limit=limit,
        db=db,
        current_user=current_user,
    )

    return advertisements


@router.get("/search/autocomplete/", response_model=list[str])
async def autocomplete_advertisements(
    search_text: str = Query(..., min_length=1),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    use_case = FindAdvertisementsByTextUseCase()

    titles = await use_case.autocomplete_advertisements_by_text(
        search_text=search_text,
        db=db,
        current_user=current_user,
    )

    return titles


@router.get("/search/", response_model=list[AdvertisementResponse])
async def search_advertisements(
    search_text: str = Query(..., min_length=1),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    use_case = FindAdvertisementsByTextUseCase()

    advertisements = await use_case.find_advertisements_by_text(
        search_text=search_text,
        db=db,
        current_user=current_user,
    )

    return advertisements


@router.get("/search/category/", response_model=list[AdvertisementResponse])
async def search_advertisements_by_text_and_category(
    search_text: str = Query(..., min_length=1),
    category: str = Query(..., min_length=1),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    use_case = FindAdvertisementsByTextUseCase()

    advertisements = await use_case.find_advertisements_by_text_and_category(
        search_text=search_text,
        category=category,
        db=db,
        current_user=current_user,
    )

    return advertisements


@router.get("/{advertisement_id}", response_model=AdvertisementResponse)
async def get_advertisement(
    advertisement_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    use_case = GetAdvertisementUseCase()

    advertisement = await use_case.get_advertisement(
        advertisement_id=advertisement_id,
        db=db,
        current_user=current_user,
    )

    return advertisement


@router.patch("/{advertisement_id}", response_model=AdvertisementResponse)
async def update_advertisement(
    advertisement_id: int,
    request: AdvertisementUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    use_case = UpdateAdvertisementUseCase()

    updated_advertisement = await use_case.update_advertisement(
        advertisement_id=advertisement_id,
        request=request,
        db=db,
        current_user=current_user,
    )

    return updated_advertisement


@router.delete("/{advertisement_id}")
async def delete_advertisement(
    advertisement_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    use_case = DeleteAdvertisementUseCase()

    await use_case.delete_advertisement(
        advertisement_id=advertisement_id,
        db=db,
        current_user=current_user,
    )

    return {"detail": "Advertisement deleted successfully"}