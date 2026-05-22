from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from services.auth.dependencies import get_current_user, get_optional_user

from services.advertisement.use_cases.create_advertisement import CreateAdvertisementUseCase
from services.advertisement.use_cases.get_advertisement import GetAdvertisementUseCase
from services.advertisement.use_cases.get_list_advertisements import GetListAdvertisementsUseCase
from services.advertisement.use_cases.update_advertisement import UpdateAdvertisementUseCase
from services.advertisement.use_cases.delete_advertisement import DeleteAdvertisementUseCase
from services.advertisement.use_cases.like_advertisement import LikeAdvertisementUseCase
from services.advertisement.use_cases.view_advertisement import ViewAdvertisementUseCase
from services.advertisement.use_cases.search_advertisements import SearchAdvertisementsUseCase

from models.user import User
from schemas.advertisement import (
    AdvertisementCreate,
    AdvertisementResponse,
    AdvertisementUpdate,
)


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


@router.get("/search", response_model=list[AdvertisementResponse])
async def search_advertisements(
    q: str = Query(..., min_length=1, max_length=255),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    """Поиск объявлений по подстроке (для автокомплита).

    Открыт всем — поиск не требует авторизации.
    """
    use_case = SearchAdvertisementsUseCase()
    return await use_case.search(q=q, limit=limit, db=db)


@router.get("/", response_model=list[AdvertisementResponse])
async def get_list_advertisements(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category_id: Optional[int] = Query(None),
    subcategory_id: Optional[int] = Query(None),
    urgent_only: bool = Query(False),
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    use_case = GetListAdvertisementsUseCase()

    advertisements = await use_case.get_list_advertisements(
        skip=skip,
        limit=limit,
        db=db,
        current_user=current_user,
        category_id=category_id,
        subcategory_id=subcategory_id,
        urgent_only=urgent_only,
    )

    return advertisements


@router.get("/my", response_model=list[AdvertisementResponse])
async def get_my_advertisements(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    use_case = GetListAdvertisementsUseCase()

    advertisements = await use_case.get_my_advertisements(
        skip=skip,
        limit=limit,
        db=db,
        current_user=current_user,
    )

    return advertisements

@router.get("/my-liked", response_model=list[AdvertisementResponse])
async def get_my_liked_advertisements(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    use_case = GetListAdvertisementsUseCase()

    advertisements = await use_case.get_my_liked_advertisements(
        skip=skip,
        limit=limit,
        db=db,
        current_user=current_user,
    )

    return advertisements


@router.get("/{advertisement_id}", response_model=AdvertisementResponse)
async def get_advertisement(
    advertisement_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
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


@router.post("/{advertisement_id}/like", response_model=AdvertisementResponse)
async def toggle_like_advertisement(
    advertisement_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    use_case = LikeAdvertisementUseCase()
    return await use_case.toggle_like(
        advertisement_id=advertisement_id,
        db=db,
        current_user=current_user,
    )


@router.post("/{advertisement_id}/view", response_model=AdvertisementResponse)
async def view_advertisement(
    advertisement_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Регистрирует просмотр объявления текущим пользователем.

    Один пользователь — один просмотр (за всё время). Счётчик растёт
    атомарно. Доступно только авторизованным.
    """
    use_case = ViewAdvertisementUseCase()
    return await use_case.view(
        advertisement_id=advertisement_id,
        db=db,
        current_user=current_user,
    )


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
