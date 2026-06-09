from fastapi import HTTPException
from sqlalchemy import select, update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from models.advertisement import Advertisement, ViewedAdvertisement
from models.user import User


class ViewAdvertisementUseCase:
    """Регистрирует факт просмотра объявления текущим пользователем.

    Один пользователь — один просмотр на объявление. Счётчик увеличивается
    атомарно (UPDATE ... SET views_count = views_count + 1) только если
    INSERT не упёрся в unique-конфликт.
    """

    async def view(
        self,
        advertisement_id: int,
        db: AsyncSession,
        current_user: User,
    ) -> Advertisement:
        ad_result = await db.execute(
            select(Advertisement).where(
                Advertisement.id == advertisement_id,
                Advertisement.deleted_at.is_(None),
            )
        )
        advertisement = ad_result.scalar_one_or_none()
        if not advertisement:
            raise HTTPException(status_code=404, detail="Объявление не найдено")

        insert_stmt = (
            insert(ViewedAdvertisement)
            .values(user_id=current_user.id, advertisement_id=advertisement_id)
            .on_conflict_do_nothing(
                index_elements=["user_id", "advertisement_id"]
            )
            .returning(ViewedAdvertisement.id)
        )
        insert_result = await db.execute(insert_stmt)
        inserted_id = insert_result.scalar_one_or_none()

        if inserted_id is not None:
            await db.execute(
                update(Advertisement)
                .where(Advertisement.id == advertisement_id)
                .values(views_count=Advertisement.views_count + 1)
            )
            await db.flush()
            await db.refresh(advertisement)

        return advertisement
