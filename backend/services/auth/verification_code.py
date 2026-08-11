import hashlib
import hmac
import os
import secrets
from datetime import timedelta

CODE_LENGTH = 6
CODE_TTL = timedelta(minutes=15)
RESEND_INTERVAL = timedelta(seconds=60)


def generate_code() -> str:
    """Генерирует числовой код подтверждения фиксированной длины."""
    return "".join(secrets.choice("0123456789") for _ in range(CODE_LENGTH))


def hash_code(code: str) -> str:
    """Хеширует код HMAC-SHA256 на секрете приложения для безопасного хранения."""
    secret = os.environ["JWT_SECRET_KEY"].encode()
    return hmac.new(secret, code.encode(), hashlib.sha256).hexdigest()


def codes_match(code: str, code_hash: str) -> bool:
    """Сравнивает код с хешем в постоянное время."""
    return hmac.compare_digest(hash_code(code), code_hash)
