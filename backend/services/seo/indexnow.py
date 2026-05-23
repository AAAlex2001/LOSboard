import asyncio
import logging
import os
import re
from urllib.parse import urljoin

import httpx


logger = logging.getLogger(__name__)

INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow"
CYRILLIC_TO_LATIN = {
    "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "yo",
    "ж": "zh", "з": "z", "и": "i", "й": "y", "к": "k", "л": "l", "м": "m",
    "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u",
    "ф": "f", "х": "h", "ц": "c", "ч": "ch", "ш": "sh", "щ": "sch",
    "ъ": "", "ы": "y", "ь": "", "э": "e", "ю": "yu", "я": "ya",
}


def slugify(text: str, max_length: int = 60) -> str:
    text = text.lower()
    result = []
    for ch in text:
        if ch in CYRILLIC_TO_LATIN:
            result.append(CYRILLIC_TO_LATIN[ch])
        elif ch.isalnum():
            result.append(ch)
        else:
            result.append("-")
    s = "".join(result)
    s = re.sub(r"-+", "-", s).strip("-")
    return s[:max_length].rstrip("-")


def get_indexnow_config() -> tuple[str, str] | None:
    site_url = os.getenv("SITE_URL")
    key = os.getenv("INDEXNOW_KEY")
    if not site_url or not key:
        return None
    return site_url.rstrip("/"), key


async def submit_url(path: str) -> None:
    config = get_indexnow_config()
    if not config:
        return
    site_url, key = config
    full_url = urljoin(f"{site_url}/", path.lstrip("/"))
    payload = {
        "host": site_url.split("://", 1)[-1],
        "key": key,
        "keyLocation": f"{site_url}/{key}.txt",
        "urlList": [full_url],
    }
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            await client.post(INDEXNOW_ENDPOINT, json=payload)
    except Exception as exc:
        logger.warning("IndexNow submit failed for %s: %s", full_url, exc)


def submit_advertisement(ad_id: int, title: str) -> None:
    slug = slugify(title)
    path = f"/advertisements/{ad_id}-{slug}" if slug else f"/advertisements/{ad_id}"
    asyncio.create_task(submit_url(path))
