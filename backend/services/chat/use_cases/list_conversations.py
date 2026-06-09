from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.chat import Conversation, Message
from models.user import User
from schemas.chat import (
    ConversationAdvertisement,
    ConversationListItem,
    ConversationPeer,
)


class ListConversationsUseCase:
    """Список диалогов текущего пользователя (и как покупателя, и как продавца).

    Сортировка по last_message_at desc. Для каждого диалога считаем непрочитанные
    сообщения от собеседника (is_read=False, sender_id != current_user.id).
    """

    async def list(
        self,
        db: AsyncSession,
        current_user: User,
    ) -> list[ConversationListItem]:
        result = await db.execute(
            select(Conversation)
            .options(
                selectinload(Conversation.advertisement),
                selectinload(Conversation.buyer),
                selectinload(Conversation.seller),
            )
            .where(
                or_(
                    Conversation.buyer_id == current_user.id,
                    Conversation.seller_id == current_user.id,
                )
            )
            .order_by(Conversation.last_message_at.desc())
        )
        conversations = result.scalars().all()

        if not conversations:
            return []

        conv_ids = [c.id for c in conversations]

        last_msg_subq = (
            select(
                Message.conversation_id,
                func.max(Message.created_at).label("max_created"),
            )
            .where(Message.conversation_id.in_(conv_ids))
            .group_by(Message.conversation_id)
            .subquery()
        )
        last_msgs_result = await db.execute(
            select(Message).join(
                last_msg_subq,
                (Message.conversation_id == last_msg_subq.c.conversation_id)
                & (Message.created_at == last_msg_subq.c.max_created),
            )
        )
        last_msgs = {m.conversation_id: m for m in last_msgs_result.scalars().all()}

        unread_result = await db.execute(
            select(
                Message.conversation_id,
                func.count(Message.id),
            )
            .where(
                Message.conversation_id.in_(conv_ids),
                Message.sender_id != current_user.id,
                Message.is_read.is_(False),
            )
            .group_by(Message.conversation_id)
        )
        unread: dict[int, int] = {
            row[0]: int(row[1]) for row in unread_result.all()
        }

        items: list[ConversationListItem] = []
        for conv in conversations:
            peer = conv.seller if conv.buyer_id == current_user.id else conv.buyer
            ad = conv.advertisement
            last_msg = last_msgs.get(conv.id)
            photo_url = ad.photo_urls[0] if ad and ad.photo_urls else None
            items.append(
                ConversationListItem(
                    id=conv.id,
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
                    last_message_text=last_msg.text if last_msg else None,
                    last_message_at=conv.last_message_at,
                    unread_count=int(unread.get(conv.id, 0)),
                )
            )
        return items
