from fastapi import APIRouter, Depends, File, UploadFile

from models.user import User
from services.auth.dependencies import get_current_user
from services.uploads.image import (
    ensure_extension,
    read_upload,
    save_processed,
)


router = APIRouter(prefix="/uploads", tags=["uploads"])


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
) -> dict[str, str]:
    """Принимает картинку, ужимает в WebP и сохраняет в публичный uploads-каталог."""
    ensure_extension(file.filename or "")
    raw = await read_upload(file)
    url = await save_processed(raw)
    return {"url": url}
