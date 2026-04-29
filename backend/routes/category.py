from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from services.categories.use_cases.get_list_categories import GetListCategoriesUseCase
from schemas.categories import CategoryResponse


router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("/list", response_model=list[CategoryResponse])
async def get_list_categories_endpoint(
    db: AsyncSession = Depends(get_db),
):
    use_case = GetListCategoriesUseCase()
    categories = await use_case.get_list_categories(db)

    return categories