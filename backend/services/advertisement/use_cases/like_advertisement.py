from fastapi import HTTPException
from sqlalchemy import delete, select, update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from models.advertisement import Advertisement, LikedAdvertisement
from models.user import User


class LikeAdvertisementUseCase:
    """Тоггл лайка с атомарным изменением счётчика.

    Используем INSERT ... ON CONFLICT DO NOTHING RETURNING и
    DELETE ... RETURNING — обе операции по природе атомарны на уровне
    строки. Счётчик меняем только если операция реально что-то изменила.
    """

    async def toggle_like(
        self,
        advertisement_id: int,
        db: AsyncSession,
        current_user: User,
    ) -> Advertisement:
        ad_result = await db.execute(
            select(Advertisement).where(Advertisement.id == advertisement_id)
        )
        advertisement = ad_result.scalar_one_or_none()
        if not advertisement:
            raise HTTPException(status_code=404, detail="Объявление не найдено")

        insert_stmt = (
            insert(LikedAdvertisement)
            .values(user_id=current_user.id, advertisement_id=advertisement_id)
            .on_conflict_do_nothing(
                index_elements=["user_id", "advertisement_id"]
            )
            .returning(LikedAdvertisement.id)
        )
        insert_result = await db.execute(insert_stmt)
        inserted_id = insert_result.scalar_one_or_none()

        if inserted_id is not None:
            await db.execute(
                update(Advertisement)
                .where(Advertisement.id == advertisement_id)
                .values(likes_count=Advertisement.likes_count + 1)
            )
            new_is_liked = True
        else:
            delete_result = await db.execute(
                delete(LikedAdvertisement)
                .where(
                    LikedAdvertisement.user_id == current_user.id,
                    LikedAdvertisement.advertisement_id == advertisement_id,
                )
                .returning(LikedAdvertisement.id)
            )
            removed_id = delete_result.scalar_one_or_none()
            if removed_id is not None:
                await db.execute(
                    update(Advertisement)
                    .where(Advertisement.id == advertisement_id)
                    .values(likes_count=Advertisement.likes_count - 1)
                )
            new_is_liked = False

        await db.flush()
        await db.refresh(advertisement)
        advertisement.is_liked = new_is_liked
        return advertisement
