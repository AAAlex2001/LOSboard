from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.content import ContentPage, FooterLink
from schemas.content import (
    ContentPageListItem,
    ContentPageResponse,
    FooterLinkResponse,
    FooterResponse,
)


router = APIRouter(prefix="/content", tags=["content"])


@router.get("/pages", response_model=list[ContentPageListItem])
async def list_content_pages(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ContentPage)
        .where(ContentPage.is_published == True)
        .order_by(ContentPage.title.asc())
    )
    return result.scalars().all()


@router.get("/pages/{slug}", response_model=ContentPageResponse)
async def get_content_page(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ContentPage).where(
            ContentPage.slug == slug,
            ContentPage.is_published == True,
        )
    )
    page = result.scalar_one_or_none()
    if not page:
        raise HTTPException(status_code=404, detail="Страница не найдена")
    return page


@router.get("/footer", response_model=FooterResponse)
async def get_footer(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(FooterLink)
        .where(FooterLink.is_active == True)
        .order_by(FooterLink.sort_order.asc(), FooterLink.id.asc())
    )
    links = [FooterLinkResponse.model_validate(row) for row in result.scalars().all()]
    return FooterResponse(links=links)
