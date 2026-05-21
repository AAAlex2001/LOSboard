import secrets
from pathlib import Path

from fastapi import HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from models.chat import Conversation
from models.user import User
from schemas.chat import AttachmentMeta


CHAT_UPLOAD_DIR = Path(__file__).resolve().parents[3] / "uploads" / "chat"

SINGLE_FILE_MAX_BYTES = 30 * 1024 * 1024

ALLOWED_MIME: dict[str, tuple[str, str]] = {
    "image/jpeg": ("image", ".jpg"),
    "image/png": ("image", ".png"),
    "image/webp": ("image", ".webp"),
    "image/gif": ("image", ".gif"),
    "video/mp4": ("video", ".mp4"),
    "video/quicktime": ("video", ".mov"),
    "video/webm": ("video", ".webm"),
    "application/pdf": ("document", ".pdf"),
    "application/msword": ("document", ".doc"),
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": (
        "document",
        ".docx",
    ),
    "application/vnd.ms-excel": ("document", ".xls"),
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": (
        "document",
        ".xlsx",
    ),
}


class UploadChatAttachmentUseCase:

    async def upload(
        self,
        conversation_id: int,
        file: UploadFile,
        db: AsyncSession,
        current_user: User,
    ) -> AttachmentMeta:
        conversation = await db.get(Conversation, conversation_id)
        if conversation is None:
            raise HTTPException(status_code=404, detail="Conversation not found")
        if current_user.id not in (conversation.buyer_id, conversation.seller_id):
            raise HTTPException(status_code=403, detail="Forbidden")

        if file.content_type not in ALLOWED_MIME:
            raise HTTPException(status_code=400, detail="Недопустимый формат файла")
        kind, ext = ALLOWED_MIME[file.content_type]

        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Пустой файл")
        if len(contents) > SINGLE_FILE_MAX_BYTES:
            raise HTTPException(
                status_code=400, detail="Файл слишком большой (макс 30 МБ)"
            )

        target_dir = CHAT_UPLOAD_DIR / str(conversation_id)
        target_dir.mkdir(parents=True, exist_ok=True)
        stored_name = f"{secrets.token_hex(12)}{ext}"
        (target_dir / stored_name).write_bytes(contents)

        original_name = (file.filename or "file")[:200]

        return AttachmentMeta(
            url=f"/conversations/{conversation_id}/attachments/{stored_name}",
            filename=original_name,
            kind=kind,
            mime_type=file.content_type,
            size_bytes=len(contents),
        )
