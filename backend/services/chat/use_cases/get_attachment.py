from pathlib import Path

from fastapi import HTTPException
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.chat import Conversation, MessageAttachment
from models.user import User


CHAT_UPLOAD_DIR = Path(__file__).resolve().parents[3] / "uploads" / "chat"


class GetChatAttachmentUseCase:

    async def get(
        self,
        conversation_id: int,
        filename: str,
        db: AsyncSession,
        current_user: User,
    ) -> FileResponse:
        if "/" in filename or "\\" in filename or filename.startswith("."):
            raise HTTPException(status_code=400, detail="Invalid filename")

        conversation = await db.get(Conversation, conversation_id)
        if conversation is None:
            raise HTTPException(status_code=404, detail="Conversation not found")
        if current_user.id not in (conversation.buyer_id, conversation.seller_id):
            raise HTTPException(status_code=403, detail="Forbidden")

        expected_url = f"/conversations/{conversation_id}/attachments/{filename}"
        att_result = await db.execute(
            select(MessageAttachment).where(MessageAttachment.url == expected_url)
        )
        attachment = att_result.scalar_one_or_none()

        path = CHAT_UPLOAD_DIR / str(conversation_id) / filename
        if not path.exists() or not path.is_file():
            raise HTTPException(status_code=404, detail="File not found")

        mime = attachment.mime_type if attachment else None
        download_name = attachment.filename if attachment else filename
        return FileResponse(
            path=str(path),
            media_type=mime,
            filename=download_name,
        )
