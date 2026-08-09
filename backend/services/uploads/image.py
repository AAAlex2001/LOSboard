import asyncio
import io
import os
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile
from PIL import Image, ImageOps, UnidentifiedImageError


ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".img"}
MAX_FILE_BYTES = 10 * 1024 * 1024
MAX_IMAGE_BYTES = 25 * 1024 * 1024
MAX_IMAGE_DIMENSION = 2400
WEBP_QUALITY = 88
UPLOADS_DIR = Path(__file__).resolve().parents[2] / "uploads"


def ensure_extension(filename: str) -> None:
    extension = os.path.splitext(filename)[1].lower()
    if extension not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Неподдерживаемый формат изображения. Используйте JPG, PNG, WebP или IMG.",
        )


async def read_upload(file: UploadFile) -> bytes:
    contents = await file.read(MAX_IMAGE_BYTES + 1)
    if not contents:
        raise HTTPException(status_code=400, detail="Пустой файл")
    if len(contents) > MAX_IMAGE_BYTES:
        raise HTTPException(
            status_code=400, detail="Изображение должно быть не больше 25 МБ"
        )
    return contents


def _process_image(raw: bytes) -> bytes:
    try:
        with Image.open(io.BytesIO(raw)) as source:
            source.verify()
        with Image.open(io.BytesIO(raw)) as source:
            image = ImageOps.exif_transpose(source).convert("RGB")
            image.thumbnail(
                (MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION), Image.Resampling.LANCZOS
            )
            output = io.BytesIO()
            image.save(output, format="WEBP", quality=WEBP_QUALITY, method=6)
            return output.getvalue()
    except (UnidentifiedImageError, OSError, ValueError):
        raise HTTPException(
            status_code=400, detail="Файл не является корректным изображением"
        )


def save_processed_sync(raw: bytes, subdir: str = "advertisements") -> str:
    processed = _process_image(raw)
    target_dir = UPLOADS_DIR / subdir
    target_dir.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid.uuid4().hex}.webp"
    (target_dir / filename).write_bytes(processed)
    return f"/static/uploads/{subdir}/{filename}"


async def save_processed(raw: bytes, subdir: str = "advertisements") -> str:
    return await asyncio.to_thread(save_processed_sync, raw, subdir)
