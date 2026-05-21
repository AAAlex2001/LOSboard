from fastapi import HTTPException
from sqlalchemy import or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.chat import Conversation, Message
from models.user import User
from schemas.chat import (
    ConversationAdvertisement,
    ConversationDetail,
    ConversationPeer,
    MessageResponse,
)


class GetConversationUseCase:
    """Возвращает диалог с сообщениями и помечает входящие как прочитанные."""

    async def get(
        self,
        conversation_id: int,
        db: AsyncSession,
        current_user: User,
    ) -> ConversationDetail:
        result = await db.execute(
            select(Conversation)
            .options(
                selectinload(Conversation.advertisement),
                selectinload(Conversation.buyer),
                selectinload(Conversation.seller),
                selectinload(Conversation.messages),
            )
            .where(Conversation.id == conversation_id)
        )
        conversation = result.scalar_one_or_none()
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")

        if current_user.id not in (conversation.buyer_id, conversation.seller_id):
            raise HTTPException(status_code=403, detail="Forbidden")

        # Помечаем входящие как прочитанные
        await db.execute(
            update(Message)
            .where(
                Message.conversation_id == conversation_id,
                Message.sender_id != current_user.id,
                Message.is_read.is_(False),
            )
            .values(is_read=True)
        )
        await db.commit()

        peer = (
            conversation.seller
            if conversation.buyer_id == current_user.id
            else conversation.buyer
        )
        ad = conversation.advertisement
        photo_url = ad.photo_urls[0] if ad and ad.photo_urls else None

        return ConversationDetail(
            id=conversation.id,
            advertisement=ConversationAdvertisement(
                id=ad.id if ad else 0,
                title=ad.title if ad else "",
                photo_url=photo_url,
                price=ad.price if ad else None,
            ),
            peer=ConversationPeer(
                id=peer.id if peer else 0,
                name=peer.name if peer else "",
                avatar_url=peer.avatar_url if peer else None,
            ),
            messages=[MessageResponse.model_validate(m) for m in conversation.messages],
        )
