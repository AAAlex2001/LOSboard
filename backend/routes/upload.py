import io
import os
import uuid
from pathlib import Path

import aiofiles
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from PIL import Image, ImageOps

from models.user import User
from services.auth.dependencies import get_current_user


UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_BYTES = 10 * 1024 * 1024
MAX_DIMENSION = 1600
WEBP_QUALITY = 82


router = APIRouter(prefix="/uploads", tags=["uploads"])


def process_image(raw: bytes) -> bytes:
    """Resize/orient/convert source image to WebP."""
    with Image.open(io.BytesIO(raw)) as img:
        img = ImageOps.exif_transpose(img)
        if img.mode in ("RGBA", "LA"):
            img = img.convert("RGBA")
        else:
            img = img.convert("RGB")
        img.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.Resampling.LANCZOS)

        buf = io.BytesIO()
        img.save(buf, format="WEBP", quality=WEBP_QUALITY, method=6)
        return buf.getvalue()


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    suffix = os.path.splitext(file.filename or "")[1].lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Допустимые форматы: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
        )

    raw = b""
    while True:
        chunk = await file.read(1024 * 1024)
        if not chunk:
            break
        raw += chunk
        if len(raw) > MAX_FILE_BYTES:
            raise HTTPException(status_code=400, detail="Файл больше 10 МБ")

    try:
        processed = process_image(raw)
    except Exception:
        raise HTTPException(status_code=400, detail="Не удалось обработать изображение")

    name = f"{uuid.uuid4().hex}.webp"
    dest = UPLOAD_DIR / name
    async with aiofiles.open(dest, "wb") as out:
        await out.write(processed)

    return {"url": f"/static/uploads/{name}"}
