from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.chat import Conversation, Message
from models.user import User


class GetUnreadTotalUseCase:
    """Сумма непрочитанных сообщений по всем диалогам пользователя.

    Один атомарный SQL: SELECT COUNT(*) с JOIN по диалогам где user участвует
    как buyer или seller, и фильтром по входящим непрочитанным.
    """

    async def get(self, db: AsyncSession, current_user: User) -> int:
        result = await db.execute(
            select(func.count(Message.id))
            .join(Conversation, Message.conversation_id == Conversation.id)
            .where(
                Message.is_read.is_(False),
                Message.sender_id != current_user.id,
                or_(
                    Conversation.buyer_id == current_user.id,
                    Conversation.seller_id == current_user.id,
                ),
            )
        )
        return int(result.scalar() or 0)
