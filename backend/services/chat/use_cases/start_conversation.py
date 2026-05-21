from datetime import datetime

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from models.advertisement import Advertisement
from models.chat import Conversation, Message
from models.user import User


class StartConversationUseCase:
    """Найти или создать диалог между текущим юзером и продавцом по объявлению.

    Покупатель не может писать сам себе (диалог с собственным объявлением). Если
    диалог уже существует — возвращаем его id. Опционально сразу отправляется
    первое сообщение.
    """

    async def start(
        self,
        advertisement_id: int,
        text: str | None,
        db: AsyncSession,
        current_user: User,
    ) -> Conversation:
        ad_result = await db.execute(
            select(Advertisement).where(Advertisement.id == advertisement_id)
        )
        advertisement = ad_result.scalar_one_or_none()
        if not advertisement:
            raise HTTPException(status_code=404, detail="Advertisement not found")

        if advertisement.owner_id == current_user.id:
            raise HTTPException(
                status_code=400,
                detail="Cannot start a conversation with your own advertisement",
            )

        # Атомарно создаём диалог; если уже есть — берём существующий.
        insert_stmt = (
            insert(Conversation)
            .values(
                advertisement_id=advertisement_id,
                buyer_id=current_user.id,
                seller_id=advertisement.owner_id,
            )
            .on_conflict_do_nothing(index_elements=["advertisement_id", "buyer_id"])
            .returning(Conversation.id)
        )
        insert_result = await db.execute(insert_stmt)
        new_id = insert_result.scalar_one_or_none()

        if new_id is None:
            existing = await db.execute(
                select(Conversation).where(
                    Conversation.advertisement_id == advertisement_id,
                    Conversation.buyer_id == current_user.id,
                )
            )
            conversation = existing.scalar_one()
        else:
            conversation = (
                await db.execute(select(Conversation).where(Conversation.id == new_id))
            ).scalar_one()

        if text and text.strip():
            now = datetime.utcnow()
            db.add(
                Message(
                    conversation_id=conversation.id,
                    sender_id=current_user.id,
                    text=text.strip(),
                    created_at=now,
                )
            )
            conversation.last_message_at = now

        await db.flush()
        await db.refresh(conversation)
        return conversation
