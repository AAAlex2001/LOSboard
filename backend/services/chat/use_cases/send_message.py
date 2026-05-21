from datetime import datetime

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.chat import Conversation, Message
from models.user import User
from schemas.chat import MessageResponse


class SendMessageUseCase:
    """Отправка сообщения в существующий диалог.

    Проверяем, что отправитель — участник диалога. Обновляем last_message_at
    для корректной сортировки в списке.
    """

    async def send(
        self,
        conversation_id: int,
        text: str,
        db: AsyncSession,
        current_user: User,
    ) -> MessageResponse:
        result = await db.execute(
            select(Conversation).where(Conversation.id == conversation_id)
        )
        conversation = result.scalar_one_or_none()
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")

        if current_user.id not in (conversation.buyer_id, conversation.seller_id):
            raise HTTPException(status_code=403, detail="Forbidden")

        now = datetime.utcnow()
        message = Message(
            conversation_id=conversation_id,
            sender_id=current_user.id,
            text=text.strip(),
            created_at=now,
        )
        db.add(message)
        conversation.last_message_at = now

        await db.commit()
        await db.refresh(message)
        return MessageResponse.model_validate(message)
