from datetime import datetime

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.chat import Conversation, Message, MessageAttachment
from models.user import User
from schemas.chat import AttachmentMeta, MessageResponse


MAX_ATTACHMENTS = 5
MAX_TOTAL_ATTACHMENT_BYTES = 30 * 1024 * 1024


class SendMessageUseCase:

    async def send(
        self,
        conversation_id: int,
        text: str,
        attachments: list[AttachmentMeta],
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

        normalized_text = text.strip() if text else ""
        if not normalized_text and not attachments:
            raise HTTPException(
                status_code=400, detail="Message must have text or attachments"
            )

        if len(attachments) > MAX_ATTACHMENTS:
            raise HTTPException(
                status_code=400,
                detail=f"Слишком много вложений (макс {MAX_ATTACHMENTS})",
            )
        total = sum(a.size_bytes for a in attachments)
        if total > MAX_TOTAL_ATTACHMENT_BYTES:
            raise HTTPException(
                status_code=400,
                detail="Суммарный размер вложений превышает 30 МБ",
            )

        expected_prefix = f"/conversations/{conversation_id}/attachments/"
        for a in attachments:
            if not a.url.startswith(expected_prefix):
                raise HTTPException(
                    status_code=400, detail="Attachment does not belong to conversation"
                )

        now = datetime.utcnow()
        message = Message(
            conversation_id=conversation_id,
            sender_id=current_user.id,
            text=normalized_text,
            created_at=now,
        )
        for a in attachments:
            message.attachments.append(
                MessageAttachment(
                    url=a.url,
                    filename=a.filename,
                    kind=a.kind,
                    mime_type=a.mime_type,
                    size_bytes=a.size_bytes,
                )
            )
        db.add(message)
        conversation.last_message_at = now

        await db.flush()
        await db.refresh(message, attribute_names=["attachments"])

        return MessageResponse(
            id=message.id,
            conversation_id=message.conversation_id,
            sender_id=message.sender_id,
            text=message.text,
            created_at=message.created_at,
            is_read=message.is_read,
            attachments=[
                AttachmentMeta(
                    url=a.url,
                    filename=a.filename,
                    kind=a.kind,
                    mime_type=a.mime_type,
                    size_bytes=a.size_bytes,
                )
                for a in message.attachments
            ],
        )
