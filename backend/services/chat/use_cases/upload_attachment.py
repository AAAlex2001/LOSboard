import io
import secrets

from fastapi import HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError
from sqlalchemy.ext.asyncio import AsyncSession

from models.chat import Conversation
from models.user import User
from schemas.chat import AttachmentMeta
from services.chat.attachments import (
    ALLOWED_MIME,
    CHAT_UPLOAD_DIR,
    SINGLE_FILE_MAX_BYTES,
    safe_filename,
)


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

        if kind == "image":
            try:
                with Image.open(io.BytesIO(contents)) as img:
                    img.verify()
            except (UnidentifiedImageError, OSError):
                raise HTTPException(
                    status_code=400, detail="Файл не является корректным изображением"
                )

        target_dir = CHAT_UPLOAD_DIR / str(conversation_id)
        target_dir.mkdir(parents=True, exist_ok=True)
        stored_name = f"{secrets.token_hex(12)}{ext}"
        (target_dir / stored_name).write_bytes(contents)

        return AttachmentMeta(
            url=f"/conversations/{conversation_id}/attachments/{stored_name}",
            filename=safe_filename(file.filename or "file"),
            kind=kind,
            mime_type=file.content_type,
            size_bytes=len(contents),
        )
