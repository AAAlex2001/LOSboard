from pathlib import Path


CHAT_UPLOAD_DIR = Path(__file__).resolve().parents[2] / "uploads" / "chat"

SINGLE_FILE_MAX_BYTES = 30 * 1024 * 1024
MAX_TOTAL_ATTACHMENT_BYTES = 30 * 1024 * 1024
MAX_ATTACHMENTS = 5

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

EXT_TO_META: dict[str, tuple[str, str]] = {
    ext: (mime, kind) for mime, (kind, ext) in ALLOWED_MIME.items()
}


def safe_filename(name: str) -> str:
    name = name.replace("\\", "_").replace("/", "_").strip()
    if not name:
        name = "file"
    return name[:200]
