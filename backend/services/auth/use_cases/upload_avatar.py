import asyncio
import io
import logging
import os
import secrets
from pathlib import Path

from fastapi import HTTPException, UploadFile
from PIL import Image, ImageOps, UnidentifiedImageError
from sqlalchemy.ext.asyncio import AsyncSession

from models.user import User


AVATAR_MAX_BYTES = 5 * 1024 * 1024
AVATAR_MAX_DIMENSION = 512
AVATAR_WEBP_QUALITY = 85
AVATARS_DIR = Path(__file__).resolve().parents[3] / "uploads" / "avatars"
AVATARS_PUBLIC_PREFIX = "/static/uploads/avatars/"

logger = logging.getLogger(__name__)


class UploadAvatarUseCase:

    def __init__(self):
        AVATARS_DIR.mkdir(parents=True, exist_ok=True)

    async def upload(
        self,
        file: UploadFile,
        db: AsyncSession,
        current_user: User,
    ) -> str:
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Пустой файл")
        if len(contents) > AVATAR_MAX_BYTES:
            raise HTTPException(
                status_code=400, detail="Файл слишком большой (макс 5 МБ)"
            )

        try:
            with Image.open(io.BytesIO(contents)) as img:
                img = ImageOps.exif_transpose(img)
                img = img.convert("RGB")
                img.thumbnail(
                    (AVATAR_MAX_DIMENSION, AVATAR_MAX_DIMENSION),
                    Image.Resampling.LANCZOS,
                )
                buf = io.BytesIO()
                img.save(buf, format="WEBP", quality=AVATAR_WEBP_QUALITY, method=6)
                processed = buf.getvalue()
        except (UnidentifiedImageError, OSError):
            raise HTTPException(status_code=400, detail="Файл не является изображением")

        filename = f"{current_user.id}_{secrets.token_hex(8)}.webp"
        target_path = AVATARS_DIR / filename
        await asyncio.to_thread(target_path.write_bytes, processed)

        old_url = current_user.avatar_url
        avatar_url = f"{AVATARS_PUBLIC_PREFIX}{filename}"
        current_user.avatar_url = avatar_url
        db.add(current_user)
        await db.flush()

        if old_url and old_url.startswith(AVATARS_PUBLIC_PREFIX):
            old_path = AVATARS_DIR / Path(old_url).name
            try:
                if await asyncio.to_thread(old_path.exists):
                    await asyncio.to_thread(os.remove, old_path)
            except OSError as exc:
                logger.warning(
                    "Не удалось удалить старый аватар %s: %s", old_path, exc
                )

        return avatar_url
