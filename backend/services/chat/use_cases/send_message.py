from datetime import datetime

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.chat import Conversation, Message, MessageAttachment
from models.user import User
from schemas.chat import AttachmentMeta, MessageResponse
from services.chat.attachments import (
    CHAT_UPLOAD_DIR,
    EXT_TO_META,
    MAX_ATTACHMENTS,
    MAX_TOTAL_ATTACHMENT_BYTES,
    safe_filename,
)


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
            raise HTTPException(status_code=404, detail="Диалог не найден")

        if current_user.id not in (conversation.buyer_id, conversation.seller_id):
            raise HTTPException(status_code=403, detail="Нет доступа к диалогу")

        normalized_text = text.strip() if text else ""
        if not normalized_text and not attachments:
            raise HTTPException(
                status_code=400, detail="Сообщение должно содержать текст или вложения"
            )

        if len(attachments) > MAX_ATTACHMENTS:
            raise HTTPException(
                status_code=400,
                detail=f"Слишком много вложений (макс {MAX_ATTACHMENTS})",
            )

        expected_prefix = f"/conversations/{conversation_id}/attachments/"
        resolved_attachments: list[dict] = []
        for a in attachments:
            if not a.url.startswith(expected_prefix):
                raise HTTPException(
                    status_code=400, detail="Вложение не относится к этому диалогу"
                )
            stored_name = a.url[len(expected_prefix):]
            if "/" in stored_name or "\\" in stored_name or stored_name.startswith("."):
                raise HTTPException(status_code=400, detail="Некорректная ссылка вложения")

            disk_path = CHAT_UPLOAD_DIR / str(conversation_id) / stored_name
            if not disk_path.exists() or not disk_path.is_file():
                raise HTTPException(status_code=400, detail="Вложение не найдено")

            ext = disk_path.suffix.lower()
            if ext not in EXT_TO_META:
                raise HTTPException(status_code=400, detail="Неподдерживаемый тип вложения")

            mime, kind = EXT_TO_META[ext]
            size = disk_path.stat().st_size
            resolved_attachments.append(
                {
                    "url": a.url,
                    "filename": safe_filename(a.filename),
                    "kind": kind,
                    "mime_type": mime,
                    "size_bytes": size,
                }
            )

        total = sum(meta["size_bytes"] for meta in resolved_attachments)
        if total > MAX_TOTAL_ATTACHMENT_BYTES:
            raise HTTPException(
                status_code=400,
                detail="Суммарный размер вложений превышает 30 МБ",
            )

        now = datetime.utcnow()
        message = Message(
            conversation_id=conversation_id,
            sender_id=current_user.id,
            text=normalized_text,
            created_at=now,
        )
        for meta in resolved_attachments:
            message.attachments.append(MessageAttachment(**meta))
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
