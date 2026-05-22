#!/usr/bin/env python3
"""Fetch public advert data from the 999.md GraphQL endpoint.

The script exports normalized JSON and keeps owner fields returned by the
public response. It intentionally does not persist click tracking tokens.
"""

from __future__ import annotations

import argparse
import copy
import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


GRAPHQL_ENDPOINT = "https://999.md/graphql"
DEFAULT_PLACEMENT = "AD_FOOTER_REDESIGN"
DEFAULT_SOURCE = "AD_SOURCE_MOBILE_REDESIGN"
DEFAULT_LOCALE = "ro_RO"
DEFAULT_AD_TYPE = "AD_999"

BOOSTERS_RANDOM_CHUNKS_QUERY = """
query BoostersRandomChunks($input: Booster_ViewRequestInput!, $withBody: Boolean = false, $locale: Common_Locale) {
  boostersRandomChunks(input: $input) {
    chunks {
      ads {
        ad {
          id
          title
          owner {
            id
            login
            avatar
            createdDate
            business {
              plan
              id
            }
            verification {
              isVerified
              date(input: {timezone: "Europe/Chisinau", getDiff: false})
            }
          }
          subCategory {
            id
            title {
              translated
            }
            parent {
              id
              title {
                translated
              }
              parent {
                id
                title {
                  translated
                }
              }
            }
          }
          price: feature(id: 2) {
            id
            type
            value
          }
          pricePerMeter: feature(id: 1385) {
            id
            type
            value
          }
          oldPrice: feature(id: 1640) {
            id
            type
            value
          }
          images: feature(id: 14) {
            id
            type
            value
          }
          body: feature(id: 13) @include(if: $withBody) {
            id
            type
            value
          }
          reseted(input: {format: "2 Jan. 2006, 15:04", locale: $locale, timezone: "Europe/Chisinau", getDiff: false})
          condition: feature(id: 593) {
            id
            type
            value
          }
        }
      }
      token
    }
  }
}
""".strip()


def load_json_arg(value: str | None) -> Any:
    if not value:
        return None

    path = Path(value)
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))

    return json.loads(value)


def translated(node: dict[str, Any] | None) -> str | None:
    title = (node or {}).get("title")
    if isinstance(title, dict):
        value = title.get("translated")
        return value if isinstance(value, str) and value else None
    return None


def feature_value(feature: dict[str, Any] | None) -> Any:
    if not isinstance(feature, dict):
        return None
    return feature.get("value")


def nested_get(payload: dict[str, Any] | None, *keys: str) -> Any:
    current: Any = payload
    for key in keys:
        if not isinstance(current, dict):
            return None
        current = current.get(key)
    return current


def normalize_price(price_feature: dict[str, Any] | None) -> dict[str, Any]:
    value = feature_value(price_feature)
    if not isinstance(value, dict):
        return {
            "amount": None,
            "currency": None,
            "mode": None,
            "measurement": None,
            "bargain": None,
            "raw": value,
        }

    return {
        "amount": value.get("value"),
        "currency": value.get("unit"),
        "mode": value.get("mode"),
        "measurement": value.get("measurement"),
        "bargain": value.get("bargain"),
        "raw": value,
    }


def image_refs(images_feature: dict[str, Any] | None) -> list[str]:
    value = feature_value(images_feature)
    if not isinstance(value, list):
        return []
    return [item for item in value if isinstance(item, str) and item]


def build_image_urls(images: list[str], image_base_url: str | None) -> list[str]:
    if not image_base_url:
        return []
    base = image_base_url.rstrip("/")
    return [f"{base}/{image.lstrip('/')}" for image in images]


def locale_to_path(locale: str) -> str:
    if locale.lower().startswith("ru"):
        return "ru"
    if locale.lower().startswith("ro"):
        return "ro"
    return locale.split("_", 1)[0].lower() or "ro"


def public_url(ad_id: str, template: str | None, locale: str) -> str | None:
    if not template:
        return None
    return template.format(id=ad_id, locale=locale, lang=locale_to_path(locale))


def normalize_ad(
    ad: dict[str, Any],
    *,
    image_base_url: str | None,
    public_url_template: str | None,
    locale: str,
    include_raw_ad: bool,
) -> dict[str, Any]:
    subcategory = ad.get("subCategory") if isinstance(ad.get("subCategory"), dict) else {}
    parent = subcategory.get("parent") if isinstance(subcategory.get("parent"), dict) else {}
    root = parent.get("parent") if isinstance(parent.get("parent"), dict) else {}
    owner = ad.get("owner") if isinstance(ad.get("owner"), dict) else {}
    business = owner.get("business") if isinstance(owner.get("business"), dict) else {}
    verification = owner.get("verification") if isinstance(owner.get("verification"), dict) else {}
    images = image_refs(ad.get("images"))
    body = feature_value(ad.get("body"))
    ad_id = str(ad.get("id") or "")

    normalized = {
        "source": "999.md",
        "source_id": ad_id,
        "source_url": public_url(ad_id, public_url_template, locale),
        "title": ad.get("title"),
        "description": body if isinstance(body, str) else None,
        "published_at_text": ad.get("reseted"),
        "price": normalize_price(ad.get("price")),
        "old_price": normalize_price(ad.get("oldPrice")),
        "price_per_meter": normalize_price(ad.get("pricePerMeter")),
        "category": {
            "id": root.get("id"),
            "title": translated(root),
        },
        "parent_category": {
            "id": parent.get("id"),
            "title": translated(parent),
        },
        "subcategory": {
            "id": subcategory.get("id"),
            "title": translated(subcategory),
        },
        "images": {
            "refs": images,
            "urls": build_image_urls(images, image_base_url),
        },
        "condition": feature_value(ad.get("condition")),
        "owner": {
            "id": owner.get("id"),
            "login": owner.get("login"),
            "avatar": owner.get("avatar"),
            "created_date": owner.get("createdDate"),
            "business_id": business.get("id"),
            "business_plan": business.get("plan"),
            "is_verified": verification.get("isVerified") if verification else None,
            "verification_date": verification.get("date") if verification else None,
        },
    }

    if include_raw_ad:
        normalized["raw_ad"] = ad

    return normalized


def merge_exclude_ids(filter_payload: dict[str, Any], ad_ids: set[str]) -> dict[str, Any]:
    payload = copy.deepcopy(filter_payload)
    existing = payload.get("excludeIds")
    exclude_ids: list[dict[str, str]] = []
    seen: set[str] = set()

    if isinstance(existing, list):
        for item in existing:
            if not isinstance(item, dict):
                continue
            item_id = str(item.get("id") or "")
            item_type = str(item.get("type") or DEFAULT_AD_TYPE)
            if not item_id or item_id in seen:
                continue
            exclude_ids.append({"id": item_id, "type": item_type})
            seen.add(item_id)

    for ad_id in sorted(ad_ids):
        if ad_id and ad_id not in seen:
            exclude_ids.append({"id": ad_id, "type": DEFAULT_AD_TYPE})

    if exclude_ids:
        payload["excludeIds"] = exclude_ids

    return payload


def make_filter(args: argparse.Namespace) -> dict[str, Any]:
    filter_from_arg = load_json_arg(args.filter_json)
    if filter_from_arg is not None:
        if not isinstance(filter_from_arg, dict):
            raise ValueError("--filter-json must be a JSON object")
        return filter_from_arg

    features = load_json_arg(args.features_json)
    if features is None:
        features = []
    if not isinstance(features, list):
        raise ValueError("--features-json must be a JSON array")

    subcategory_ids = args.subcategory_ids or [1378]
    exclude_ids = [{"id": ad_id, "type": DEFAULT_AD_TYPE} for ad_id in args.exclude_ids]

    return {
        "categoryId": args.category_id,
        "subcategoryIds": subcategory_ids,
        "excludeIds": exclude_ids,
        "features": features,
    }


def make_payload(args: argparse.Namespace, filter_payload: dict[str, Any]) -> dict[str, Any]:
    request_input = {
        "placement": args.placement,
        "limit": args.chunks,
        "chunkSize": args.chunk_size,
        "source": args.source,
        "filter": filter_payload,
    }

    return {
        "operationName": "BoostersRandomChunks",
        "query": BOOSTERS_RANDOM_CHUNKS_QUERY,
        "variables": {
            "withBody": args.with_body,
            "locale": args.locale,
            "input": request_input,
        },
    }


def request_graphql(endpoint: str, payload: dict[str, Any], timeout: float) -> dict[str, Any]:
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    request = Request(
        endpoint,
        data=body,
        method="POST",
        headers={
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Origin": "https://999.md",
            "Referer": "https://999.md/",
            "User-Agent": "LOSboard-import/1.0 (+https://landofsoul-apsny-daily.ru)",
        },
    )

    try:
        with urlopen(request, timeout=timeout) as response:
            response_body = response.read().decode("utf-8")
    except HTTPError as exc:
        error_body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"999.md returned HTTP {exc.code}: {error_body}") from exc
    except URLError as exc:
        raise RuntimeError(f"Failed to connect to 999.md: {exc}") from exc

    data = json.loads(response_body)
    if data.get("errors"):
        raise RuntimeError(f"GraphQL errors: {json.dumps(data['errors'], ensure_ascii=False)}")
    return data


def extract_ads(response: dict[str, Any]) -> list[dict[str, Any]]:
    chunks = nested_get(response, "data", "boostersRandomChunks", "chunks")
    if not isinstance(chunks, list):
        return []

    ads: list[dict[str, Any]] = []
    for chunk in chunks:
        chunk_ads = chunk.get("ads") if isinstance(chunk, dict) else None
        if not isinstance(chunk_ads, list):
            continue
        for item in chunk_ads:
            ad = item.get("ad") if isinstance(item, dict) else None
            if isinstance(ad, dict) and ad.get("id"):
                ads.append(ad)
    return ads


def write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Fetch and normalize public ads from 999.md GraphQL.")
    parser.add_argument("--endpoint", default=os.getenv("NINE_MD_GRAPHQL_ENDPOINT", GRAPHQL_ENDPOINT))
    parser.add_argument("--category-id", type=int, default=45)
    parser.add_argument("--subcategory-id", dest="subcategory_ids", type=int, action="append", default=[])
    parser.add_argument("--exclude-id", dest="exclude_ids", action="append", default=[])
    parser.add_argument("--filter-json", help="Full filter JSON object or path to a JSON file.")
    parser.add_argument("--features-json", help="Filter features JSON array or path to a JSON file.")
    parser.add_argument("--locale", default=DEFAULT_LOCALE)
    parser.add_argument("--placement", default=DEFAULT_PLACEMENT)
    parser.add_argument("--source", default=DEFAULT_SOURCE)
    parser.add_argument("--chunks", type=int, default=3)
    parser.add_argument("--chunk-size", type=int, default=5)
    parser.add_argument("--repeat", type=int, default=1)
    parser.add_argument("--delay", type=float, default=2.0)
    parser.add_argument("--timeout", type=float, default=20.0)
    parser.add_argument("--with-body", action="store_true")
    parser.add_argument("--include-raw-ad", action="store_true")
    parser.add_argument("--image-base-url", help="Optional image CDN base URL. Raw image refs are always exported.")
    parser.add_argument(
        "--public-url-template",
        default="https://999.md/{lang}/{id}",
        help="Template for source_url. Available fields: {id}, {locale}, {lang}.",
    )
    parser.add_argument("--output", type=Path, help="Output JSON path. Prints to stdout when omitted.")
    return parser.parse_args(argv)


def main(argv: list[str]) -> int:
    args = parse_args(argv)
    if args.chunks < 1 or args.chunk_size < 1 or args.repeat < 1:
        raise ValueError("--chunks, --chunk-size and --repeat must be positive")

    base_filter = make_filter(args)
    seen_ids: set[str] = {str(ad_id) for ad_id in args.exclude_ids}
    normalized_by_id: dict[str, dict[str, Any]] = {}

    for index in range(args.repeat):
        request_filter = merge_exclude_ids(base_filter, seen_ids)
        payload = make_payload(args, request_filter)
        response = request_graphql(args.endpoint, payload, args.timeout)

        for ad in extract_ads(response):
            ad_id = str(ad.get("id") or "")
            if not ad_id or ad_id in normalized_by_id:
                continue
            normalized_by_id[ad_id] = normalize_ad(
                ad,
                image_base_url=args.image_base_url,
                public_url_template=args.public_url_template,
                locale=args.locale,
                include_raw_ad=args.include_raw_ad,
            )
            seen_ids.add(ad_id)

        if index + 1 < args.repeat:
            time.sleep(args.delay)

    result = {
        "source": "999.md",
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "endpoint": args.endpoint,
        "request": {
            "category_id": args.category_id,
            "subcategory_ids": args.subcategory_ids or [1378],
            "locale": args.locale,
            "chunks": args.chunks,
            "chunk_size": args.chunk_size,
            "repeat": args.repeat,
            "with_body": args.with_body,
        },
        "count": len(normalized_by_id),
        "ads": list(normalized_by_id.values()),
    }

    if args.output:
        write_json(args.output, result)
        print(f"Saved {result['count']} ads to {args.output}", file=sys.stderr)
    else:
        print(json.dumps(result, ensure_ascii=False, indent=2))

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        raise SystemExit(1)
