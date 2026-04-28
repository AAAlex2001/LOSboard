from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.advertisement import Advertisement
from fastapi import HTTPException
from models.user import User


class FindAdvertisementsByTextUseCase:

    async def find_advertisements_by_text(
        self,
        search_text: str,
        db: AsyncSession,
        current_user: User,
    ) -> list[Advertisement]:

        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")

        result = await db.execute(
            select(Advertisement).where(
                Advertisement.title.ilike(f"%{search_text}%")
            )
        )

        advertisements = result.scalars().all()

        return advertisements

    async def autocomplete_advertisements_by_text(
        self,
        search_text: str,
        db: AsyncSession,
        current_user: User,
    ) -> list[str]:

        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")

        result = await db.execute(
            select(Advertisement.title).where(
                Advertisement.title.ilike(f"%{search_text}%")
            ).limit(10)
        )

        titles = result.scalars().all()

        return titles
    

    async def find_advertisements_by_text_and_category(
        self,
        search_text: str,
        category: str,
        db: AsyncSession,
        current_user: User,
    ) -> list[Advertisement]:

        if not current_user:
            raise HTTPException(status_code=401, detail="Not authenticated")

        result = await db.execute(
            select(Advertisement).where(
                Advertisement.title.ilike(f"%{search_text}%"),
                Advertisement.category == category
            )
        )

        advertisements = result.scalars().all()

        return advertisements