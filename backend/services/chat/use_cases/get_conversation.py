from fastapi import HTTPException
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.chat import Conversation, Message
from models.user import User

from schemas.chat import (
    AttachmentMeta,
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
                selectinload(Conversation.messages).selectinload(
                    Message.attachments
                ),
            )
            .where(Conversation.id == conversation_id)
        )
        conversation = result.scalar_one_or_none()
        if not conversation:
            raise HTTPException(status_code=404, detail="Диалог не найден")

        if current_user.id not in (conversation.buyer_id, conversation.seller_id):
            raise HTTPException(status_code=403, detail="Нет доступа к диалогу")

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
        await db.flush()

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
            messages=[
                MessageResponse(
                    id=m.id,
                    conversation_id=m.conversation_id,
                    sender_id=m.sender_id,
                    text=m.text,
                    created_at=m.created_at,
                    is_read=m.is_read,
                    attachments=[
                        AttachmentMeta(
                            url=a.url,
                            filename=a.filename,
                            kind=a.kind,
                            mime_type=a.mime_type,
                            size_bytes=a.size_bytes,
                        )
                        for a in m.attachments
                    ],
                )
                for m in conversation.messages
            ],
        )
