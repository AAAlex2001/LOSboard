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
DEFAULT_SEARCH_SOURCE = "AD_SOURCE_MOBILE_REDESIGN"
DEFAULT_SEARCH_SORT = "SORT_ADS_DATE_DESC"
DEFAULT_LOCALE = "ro_RO"
DEFAULT_AD_TYPE = "AD_999"
DEFAULT_IMAGE_BASE_URL = "https://i.simpalsmedia.com/999.md/BoardImages/900x900"
DEFAULT_CATEGORIES_PATH = Path(__file__).resolve().parents[1] / "imports" / "categories.json"
DEFAULT_BATCH_OUTPUT_DIR = Path(__file__).resolve().parents[1] / "imports" / "999_all_categories"

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
          phones: feature(id: 16) {
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

SEARCH_ADS_QUERY = """
query SearchAds(
  $input: Ads_SearchInput!
  $includeCarsFeatures: Boolean = false
  $includeBody: Boolean = false
  $includeOwner: Boolean = false
  $includeBoost: Boolean = false
  $locale: Common_Locale
) {
  searchAds(input: $input) {
    ads {
      id
      title
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
      body: feature(id: 13) @include(if: $includeBody) {
        id
        type
        value
      }
      phones: feature(id: 16) {
        id
        type
        value
      }
      owner @include(if: $includeOwner) {
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
      booster: product(alias: BOOSTER_V2) @include(if: $includeBoost) {
        enable
      }
      label: displayProduct(alias: LABEL) {
        ... on DisplayLabel {
          enable
          title
          color {
            r
            g
            b
            a
          }
          gradient {
            from {
              r
              g
              b
              a
            }
            to {
              r
              g
              b
              a
            }
            position
            rotation
          }
        }
      }
      frame: displayProduct(alias: FRAME) {
        ... on DisplayFrame {
          enable
        }
      }
      animation: displayProduct(alias: ANIMATION) {
        ... on DisplayAnimation {
          enable
        }
      }
      animationAndFrame: displayProduct(alias: ANIMATION_AND_FRAME) {
        ... on DisplayAnimationAndFrame {
          enable
        }
      }
      carFuel: feature(id: 151) @include(if: $includeCarsFeatures) {
        id
        type
        value
      }
      carDrive: feature(id: 108) @include(if: $includeCarsFeatures) {
        id
        type
        value
      }
      carTransmission: feature(id: 101) @include(if: $includeCarsFeatures) {
        id
        type
        value
      }
      mileage: feature(id: 104) @include(if: $includeCarsFeatures) {
        id
        type
        value
      }
      engineVolume: feature(id: 103) @include(if: $includeCarsFeatures) {
        id
        type
        value
      }
      transportYear: feature(id: 19) {
        id
        type
        value
      }
      author: feature(id: 795) {
        id
        type
        value
      }
      uploadedVideos: feature(id: 2562) {
        id
        type
        value
      }
      condition: feature(id: 593) {
        id
        type
        value
      }
      reseted(input: {format: "2 Jan. 2006, 15:04", locale: $locale, timezone: "Europe/Chisinau", getDiff: false})
    }
    count
    reseted
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


def has_phone(value: Any) -> bool:
    if isinstance(value, dict):
        for key in ("phone_numbers", "phones", "numbers"):
            nested = value.get(key)
            if has_phone(nested):
                return True
        return False
    if isinstance(value, list):
        return any(has_phone(item) for item in value)
    if isinstance(value, str):
        return bool(value.strip())
    return value is not None


def nested_get(payload: dict[str, Any] | None, *keys: str) -> Any:
    current: Any = payload
    for key in keys:
        if not isinstance(current, dict):
            return None
        current = current.get(key)
    return current


def normalize_price(price_feature: dict[str, Any] | None) -> dict[str, Any]:
    value = feature_value(price_feature)
    if isinstance(value, (int, float)):
        return {
            "amount": value,
            "currency": None,
            "mode": None,
            "measurement": None,
            "bargain": None,
            "raw": value,
        }

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
    phone_mode: str,
) -> dict[str, Any]:
    subcategory = ad.get("subCategory") if isinstance(ad.get("subCategory"), dict) else {}
    parent = subcategory.get("parent") if isinstance(subcategory.get("parent"), dict) else {}
    root = parent.get("parent") if isinstance(parent.get("parent"), dict) else {}
    owner = ad.get("owner") if isinstance(ad.get("owner"), dict) else {}
    business = owner.get("business") if isinstance(owner.get("business"), dict) else {}
    verification = owner.get("verification") if isinstance(owner.get("verification"), dict) else {}
    images = image_refs(ad.get("images"))
    body = feature_value(ad.get("body"))
    phones = feature_value(ad.get("phones"))
    phone_present = has_phone(phones)
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
        "has_phone": phone_present,
        "transport": {
            "year": feature_value(ad.get("transportYear")),
            "fuel": feature_value(ad.get("carFuel")),
            "drive": feature_value(ad.get("carDrive")),
            "transmission": feature_value(ad.get("carTransmission")),
            "mileage": feature_value(ad.get("mileage")),
            "engine_volume": feature_value(ad.get("engineVolume")),
        },
        "author": feature_value(ad.get("author")),
        "label": ad.get("label"),
        "frame": ad.get("frame"),
        "animation": ad.get("animation"),
        "animation_and_frame": ad.get("animationAndFrame"),
        "booster": ad.get("booster"),
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

    if phone_mode == "full":
        normalized["phones"] = phones
    elif phone_mode == "redacted":
        normalized["phones"] = {"has_phone": phone_present}
    elif phone_mode != "none":
        raise ValueError("--phone-mode must be one of: full, redacted, none")

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


def make_search_input(args: argparse.Namespace, skip: int, limit: int) -> dict[str, Any]:
    input_from_arg = load_json_arg(args.search_input_json)
    if input_from_arg is not None:
        if not isinstance(input_from_arg, dict):
            raise ValueError("--search-input-json must be a JSON object")
        request_input = copy.deepcopy(input_from_arg)
        request_input["pagination"] = {"limit": limit, "skip": skip}
        return request_input

    filters = load_json_arg(args.search_filters_json)
    if filters is None:
        filters = []
    if not isinstance(filters, list):
        raise ValueError("--search-filters-json must be a JSON array")

    request_input: dict[str, Any] = {
        "source": args.search_source,
        "sort": args.search_sort,
        "pagination": {"limit": limit, "skip": skip},
        "filters": filters,
    }

    if args.search_subcategory_id is not None:
        request_input["subCategoryId"] = args.search_subcategory_id
    elif args.subcategory_ids:
        request_input["subCategoryId"] = args.subcategory_ids[0]

    return request_input


def make_search_payload(args: argparse.Namespace, skip: int, limit: int) -> dict[str, Any]:
    return {
        "operationName": "SearchAds",
        "query": SEARCH_ADS_QUERY,
        "variables": {
            "includeBody": args.with_body,
            "includeBoost": args.include_boost,
            "includeCarsFeatures": args.include_cars_features,
            "includeOwner": args.include_owner,
            "input": make_search_input(args, skip, limit),
            "locale": args.locale,
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


def configure_stdio() -> None:
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8")


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


def extract_search_ads(response: dict[str, Any]) -> tuple[list[dict[str, Any]], int | None, int | None]:
    search_ads = nested_get(response, "data", "searchAds")
    if not isinstance(search_ads, dict):
        return [], None, None

    raw_ads = search_ads.get("ads")
    ads = [ad for ad in raw_ads if isinstance(ad, dict) and ad.get("id")] if isinstance(raw_ads, list) else []
    count = search_ads.get("count")
    reseted = search_ads.get("reseted")
    return ads, count if isinstance(count, int) else None, reseted if isinstance(reseted, int) else None


def write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def category_title(node: dict[str, Any], lang: str) -> str | None:
    title = node.get("title")
    if not isinstance(title, dict):
        return None

    i18n = title.get("i18n")
    if isinstance(i18n, dict):
        value = i18n.get(lang)
        if isinstance(value, str) and value:
            return value

    value = title.get("translated")
    return value if isinstance(value, str) and value else None


def category_titles(node: dict[str, Any]) -> dict[str, str | None]:
    return {
        "translated": translated(node),
        "ro": category_title(node, "ro"),
        "ru": category_title(node, "ru"),
    }


def compact_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def load_category_targets(
    path: Path,
    *,
    include_redirects: bool,
    include_symlinks: bool,
) -> list[dict[str, Any]]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    root = nested_get(payload, "data", "categoryTree")
    if not isinstance(root, dict):
        raise ValueError(f"{path} does not contain data.categoryTree")

    targets: list[dict[str, Any]] = []
    seen: set[tuple[int, str]] = set()

    def add_target(
        node: dict[str, Any],
        *,
        search_subcategory_id: int,
        filters: list[Any],
        root_node: dict[str, Any] | None,
        group_node: dict[str, Any] | None,
        path_nodes: list[dict[str, Any]],
    ) -> None:
        filter_key = compact_json(filters)
        key = (search_subcategory_id, filter_key)
        if key in seen:
            return
        seen.add(key)
        targets.append(
            {
                "node_id": node.get("id"),
                "node_type": node.get("type"),
                "search_subcategory_id": search_subcategory_id,
                "filters": filters,
                "title": category_titles(node),
                "url": node.get("url"),
                "root": {
                    "id": root_node.get("id") if root_node else None,
                    "title": category_titles(root_node) if root_node else None,
                    "url": root_node.get("url") if root_node else None,
                },
                "group": {
                    "id": group_node.get("id") if group_node else None,
                    "title": category_titles(group_node) if group_node else None,
                },
                "path": [
                    {
                        "id": item.get("id"),
                        "type": item.get("type"),
                        "title": category_titles(item),
                        "url": item.get("url"),
                    }
                    for item in path_nodes
                ],
            }
        )

    def walk(
        node: dict[str, Any],
        *,
        root_node: dict[str, Any] | None,
        group_node: dict[str, Any] | None,
        path_nodes: list[dict[str, Any]],
    ) -> None:
        node_type = node.get("type")
        node_id = node.get("id")
        next_root = root_node
        next_group = group_node

        if node_type == "CATEGORY" and node_id != 0:
            next_root = node
            next_group = None
        elif node_type == "GROUP":
            next_group = node

        next_path = [*path_nodes, node]

        if node_type == "SUBCATEGORY" and isinstance(node_id, int):
            add_target(
                node,
                search_subcategory_id=node_id,
                filters=[],
                root_node=next_root,
                group_node=next_group,
                path_nodes=next_path,
            )
        elif node_type in {"REDIRECT", "SYMLINK"}:
            redirect = node.get("redirect") if isinstance(node.get("redirect"), dict) else None
            category = redirect.get("category") if isinstance(redirect, dict) else None
            target_id = category.get("id") if isinstance(category, dict) else None
            filters = redirect.get("filters") if isinstance(redirect, dict) else []
            filters = filters if isinstance(filters, list) else []
            should_include = (node_type == "REDIRECT" and include_redirects) or (
                node_type == "SYMLINK" and include_symlinks
            )
            if should_include and isinstance(target_id, int):
                add_target(
                    node,
                    search_subcategory_id=target_id,
                    filters=filters,
                    root_node=next_root,
                    group_node=next_group,
                    path_nodes=next_path,
                )

        children = node.get("categories")
        if isinstance(children, list):
            for child in children:
                if isinstance(child, dict):
                    walk(child, root_node=next_root, group_node=next_group, path_nodes=next_path)

    walk(root, root_node=None, group_node=None, path_nodes=[])
    return targets


def summarize_targets(targets: list[dict[str, Any]]) -> dict[str, Any]:
    by_root: dict[str, dict[str, Any]] = {}
    by_type: dict[str, int] = {}
    for target in targets:
        node_type = str(target.get("node_type") or "")
        by_type[node_type] = by_type.get(node_type, 0) + 1

        root = target.get("root") if isinstance(target.get("root"), dict) else {}
        root_id = root.get("id")
        root_key = str(root_id)
        item = by_root.setdefault(
            root_key,
            {
                "id": root_id,
                "title": root.get("title"),
                "targets": 0,
            },
        )
        item["targets"] += 1

    return {
        "target_count": len(targets),
        "by_type": by_type,
        "by_root": list(by_root.values()),
    }


def batch_output_path(output_dir: Path, locale: str, target: dict[str, Any]) -> Path:
    node_id = target.get("node_id")
    search_subcategory_id = target.get("search_subcategory_id")
    node_type = str(target.get("node_type") or "category").lower()
    suffix = f"{node_type}_{node_id}_target_{search_subcategory_id}"
    if target.get("filters"):
        suffix += "_filters"
    return output_dir / locale_to_path(locale) / f"{suffix}.json"


def fetch_all_category_ads(args: argparse.Namespace) -> dict[str, Any]:
    targets = load_category_targets(
        args.categories_json,
        include_redirects=args.include_redirect_targets,
        include_symlinks=args.include_symlink_targets,
    )

    if args.max_categories:
        targets = targets[: args.max_categories]

    target_summary = summarize_targets(targets)
    if args.categories_dry_run:
        return {
            "source": "999.md",
            "mode": "categoryTargets",
            "fetched_at": datetime.now(timezone.utc).isoformat(),
            "categories_json": str(args.categories_json),
            "locales": args.batch_locales,
            "summary": target_summary,
            "targets": targets,
        }

    output_files: list[dict[str, Any]] = []
    total_ads = 0
    batch_started_at = datetime.now(timezone.utc).isoformat()

    for locale in args.batch_locales:
        for index, target in enumerate(targets, start=1):
            output_path = batch_output_path(args.batch_output_dir, locale, target)
            if args.skip_existing and output_path.exists():
                continue

            target_args = copy.copy(args)
            target_args.search = True
            target_args.search_count = False
            target_args.all_pages = True if args.repeat is None and args.target_count is None else args.all_pages
            target_args.locale = locale
            target_args.search_subcategory_id = target["search_subcategory_id"]
            target_args.search_filters_json = compact_json(target.get("filters") or [])
            target_args.search_input_json = None
            target_args.output = output_path

            print(
                f"[{locale} {index}/{len(targets)}] "
                f"subcategory {target_args.search_subcategory_id} -> {output_path}",
                file=sys.stderr,
            )

            result = fetch_search_ads(target_args)
            result["category_target"] = target
            write_json(output_path, result)

            output_files.append(
                {
                    "locale": locale,
                    "path": str(output_path),
                    "search_subcategory_id": target_args.search_subcategory_id,
                    "node_id": target.get("node_id"),
                    "node_type": target.get("node_type"),
                    "count": result["count"],
                    "site_count": result.get("site_count"),
                }
            )
            total_ads += result["count"]

    index_payload = {
        "source": "999.md",
        "mode": "searchAdsAllCategories",
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "started_at": batch_started_at,
        "categories_json": str(args.categories_json),
        "output_dir": str(args.batch_output_dir),
        "locales": args.batch_locales,
        "summary": target_summary,
        "total_ads": total_ads,
        "files": output_files,
        "request": {
            "only_with_phone": args.only_with_phone,
            "phone_mode": args.phone_mode,
            "with_body": args.with_body,
            "include_owner": args.include_owner,
            "include_cars_features": args.include_cars_features,
            "include_redirect_targets": args.include_redirect_targets,
            "include_symlink_targets": args.include_symlink_targets,
        },
    }
    index_path = args.batch_output_dir / "index.json"
    write_json(index_path, index_payload)
    print(f"Saved batch index to {index_path}", file=sys.stderr)
    return index_payload


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Fetch and normalize public ads from 999.md GraphQL.")
    parser.add_argument("--endpoint", default=os.getenv("NINE_MD_GRAPHQL_ENDPOINT", GRAPHQL_ENDPOINT))
    parser.add_argument("--search", action="store_true", help="Use the regular searchAds listing endpoint.")
    parser.add_argument("--search-count", action="store_true", help="Fetch only searchAds count for the selected search.")
    parser.add_argument(
        "--search-all-categories",
        action="store_true",
        help="Read categoryTree JSON and fetch searchAds for every real subcategory.",
    )
    parser.add_argument("--categories-json", type=Path, default=DEFAULT_CATEGORIES_PATH)
    parser.add_argument("--categories-dry-run", action="store_true", help="Print category targets without network calls.")
    parser.add_argument("--batch-output-dir", type=Path, default=DEFAULT_BATCH_OUTPUT_DIR)
    parser.add_argument("--batch-locales", nargs="+", default=["ru_RU", "ro_RO"])
    parser.add_argument("--max-categories", type=int, help="Limit category targets for testing batch mode.")
    parser.add_argument("--skip-existing", action="store_true", help="Skip category output files that already exist.")
    parser.add_argument(
        "--include-redirect-targets",
        action="store_true",
        help="Also fetch menu redirects with filters. This can duplicate ads from the base subcategory.",
    )
    parser.add_argument(
        "--include-symlink-targets",
        action="store_true",
        help="Also fetch symlink targets. This can duplicate ads from their real subcategory.",
    )
    parser.add_argument("--category-id", type=int, default=45)
    parser.add_argument("--subcategory-id", dest="subcategory_ids", type=int, action="append", default=[])
    parser.add_argument("--search-subcategory-id", type=int, default=659)
    parser.add_argument("--search-input-json", help="Full search input JSON object or path to a JSON file.")
    parser.add_argument("--search-filters-json", default="[]", help="Search filters JSON array or path to a JSON file.")
    parser.add_argument("--search-source", default=DEFAULT_SEARCH_SOURCE)
    parser.add_argument("--search-sort", default=DEFAULT_SEARCH_SORT)
    parser.add_argument("--search-limit", type=int, default=78)
    parser.add_argument("--search-skip", type=int, default=0)
    parser.add_argument("--all-pages", action="store_true", help="Fetch every searchAds page for the selected search.")
    parser.add_argument("--only-with-phone", action="store_true", help="Keep only ads where the phone feature is present.")
    parser.add_argument(
        "--phone-mode",
        choices=("full", "redacted", "none"),
        default="full",
        help="How to write phone data: full number data, redacted presence metadata, or no phone field.",
    )
    parser.add_argument("--include-owner", action=argparse.BooleanOptionalAction, default=True)
    parser.add_argument("--include-cars-features", action=argparse.BooleanOptionalAction, default=True)
    parser.add_argument("--include-boost", action="store_true")
    parser.add_argument("--exclude-id", dest="exclude_ids", action="append", default=[])
    parser.add_argument("--filter-json", help="Full filter JSON object or path to a JSON file.")
    parser.add_argument("--features-json", help="Filter features JSON array or path to a JSON file.")
    parser.add_argument("--locale", default=DEFAULT_LOCALE)
    parser.add_argument("--placement", default=DEFAULT_PLACEMENT)
    parser.add_argument("--source", default=DEFAULT_SOURCE)
    parser.add_argument("--chunks", type=int, default=3)
    parser.add_argument("--chunk-size", type=int, default=5)
    parser.add_argument(
        "--repeat",
        type=int,
        help="Maximum request count. Defaults to 1, or an estimated safe cap when --target-count is set.",
    )
    parser.add_argument("--target-count", type=int, help="Stop after collecting this many unique ads.")
    parser.add_argument("--delay", type=float, default=2.0)
    parser.add_argument("--timeout", type=float, default=20.0)
    parser.add_argument("--with-body", action="store_true")
    parser.add_argument("--include-raw-ad", action="store_true")
    parser.add_argument(
        "--image-base-url",
        default=os.getenv("NINE_MD_IMAGE_BASE_URL", DEFAULT_IMAGE_BASE_URL),
        help="Optional image CDN base URL. Raw image refs are always exported.",
    )
    parser.add_argument(
        "--public-url-template",
        default="https://999.md/{lang}/{id}",
        help="Template for source_url. Available fields: {id}, {locale}, {lang}.",
    )
    parser.add_argument("--output", type=Path, help="Output JSON path. Prints to stdout when omitted.")
    return parser.parse_args(argv)


def fetch_booster_ads(args: argparse.Namespace) -> dict[str, Any]:
    base_filter = make_filter(args)
    seen_ids: set[str] = {str(ad_id) for ad_id in args.exclude_ids}
    normalized_by_id: dict[str, dict[str, Any]] = {}

    per_request = args.chunks * args.chunk_size
    if args.repeat is not None:
        request_limit = args.repeat
    elif args.target_count:
        estimated_requests = (args.target_count + per_request - 1) // per_request
        request_limit = max(estimated_requests * 2, estimated_requests + 10)
    else:
        request_limit = 1

    for index in range(request_limit):
        request_filter = merge_exclude_ids(base_filter, seen_ids)
        payload = make_payload(args, request_filter)
        response = request_graphql(args.endpoint, payload, args.timeout)
        extracted_ads = extract_ads(response)
        added_count = 0

        for ad in extracted_ads:
            ad_id = str(ad.get("id") or "")
            if not ad_id or ad_id in normalized_by_id:
                continue
            phones = feature_value(ad.get("phones"))
            if args.only_with_phone and not has_phone(phones):
                continue
            normalized_by_id[ad_id] = normalize_ad(
                ad,
                image_base_url=args.image_base_url,
                public_url_template=args.public_url_template,
                locale=args.locale,
                include_raw_ad=args.include_raw_ad,
                phone_mode=args.phone_mode,
            )
            seen_ids.add(ad_id)
            added_count += 1

            if args.target_count and len(normalized_by_id) >= args.target_count:
                break

        if args.output or args.target_count:
            target = f"/{args.target_count}" if args.target_count else ""
            print(
                f"Request {index + 1}/{request_limit}: fetched {len(extracted_ads)}, "
                f"added {added_count}, total {len(normalized_by_id)}{target}",
                file=sys.stderr,
            )

        if args.target_count and len(normalized_by_id) >= args.target_count:
            break

        if index + 1 < request_limit:
            time.sleep(args.delay)

    ads = list(normalized_by_id.values())
    if args.target_count:
        ads = ads[: args.target_count]

    result = {
        "source": "999.md",
        "mode": "boostersRandomChunks",
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "endpoint": args.endpoint,
        "request": {
            "category_id": args.category_id,
            "subcategory_ids": args.subcategory_ids or [1378],
            "locale": args.locale,
            "chunks": args.chunks,
            "chunk_size": args.chunk_size,
            "repeat": request_limit,
            "target_count": args.target_count,
            "with_body": args.with_body,
            "only_with_phone": args.only_with_phone,
            "phone_mode": args.phone_mode,
        },
        "count": len(ads),
        "ads": ads,
    }

    return result


def fetch_search_ads(args: argparse.Namespace) -> dict[str, Any]:
    normalized_by_id: dict[str, dict[str, Any]] = {}
    site_count: int | None = None
    site_reseted: int | None = None
    limit = 1 if args.search_count else args.search_limit
    skip = args.search_skip

    if args.repeat is not None:
        request_limit: int | None = args.repeat
    elif args.all_pages:
        request_limit = None
    elif args.target_count:
        request_limit = (args.target_count + limit - 1) // limit
    else:
        request_limit = 1

    index = 0
    while request_limit is None or index < request_limit:
        payload = make_search_payload(args, skip, limit)
        response = request_graphql(args.endpoint, payload, args.timeout)
        extracted_ads, response_count, response_reseted = extract_search_ads(response)
        added_count = 0

        if response_count is not None:
            site_count = response_count
        if response_reseted is not None:
            site_reseted = response_reseted

        if args.search_count:
            break

        for ad in extracted_ads:
            ad_id = str(ad.get("id") or "")
            if not ad_id or ad_id in normalized_by_id:
                continue
            phones = feature_value(ad.get("phones"))
            if args.only_with_phone and not has_phone(phones):
                continue
            normalized_by_id[ad_id] = normalize_ad(
                ad,
                image_base_url=args.image_base_url,
                public_url_template=args.public_url_template,
                locale=args.locale,
                include_raw_ad=args.include_raw_ad,
                phone_mode=args.phone_mode,
            )
            added_count += 1

            if args.target_count and len(normalized_by_id) >= args.target_count:
                break

        if args.output or args.target_count:
            target = f"/{args.target_count}" if args.target_count else ""
            site_total = f", site_count {site_count}" if site_count is not None else ""
            request_total = "all" if request_limit is None else str(request_limit)
            print(
                f"Search request {index + 1}/{request_total}: skip {skip}, fetched {len(extracted_ads)}, "
                f"added {added_count}, total {len(normalized_by_id)}{target}{site_total}",
                file=sys.stderr,
            )

        index += 1

        if args.target_count and len(normalized_by_id) >= args.target_count:
            break

        if len(extracted_ads) < limit:
            break

        if site_count is not None and skip + limit >= site_count:
            break

        skip += limit
        if request_limit is None or index < request_limit:
            time.sleep(args.delay)

    ads = list(normalized_by_id.values())
    if args.target_count:
        ads = ads[: args.target_count]

    return {
        "source": "999.md",
        "mode": "searchAds",
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "endpoint": args.endpoint,
        "site_count": site_count,
        "site_reseted": site_reseted,
        "request": {
            "subcategory_id": args.search_subcategory_id,
            "locale": args.locale,
            "limit": limit,
            "start_skip": args.search_skip,
            "repeat": request_limit,
            "all_pages": args.all_pages,
            "target_count": args.target_count,
            "with_body": args.with_body,
            "include_owner": args.include_owner,
            "include_cars_features": args.include_cars_features,
            "only_with_phone": args.only_with_phone,
            "phone_mode": args.phone_mode,
        },
        "count": len(ads),
        "ads": ads,
    }


def main(argv: list[str]) -> int:
    configure_stdio()
    args = parse_args(argv)
    if args.chunks < 1 or args.chunk_size < 1:
        raise ValueError("--chunks and --chunk-size must be positive")
    if args.search_limit < 1 or args.search_skip < 0:
        raise ValueError("--search-limit must be positive and --search-skip must be zero or positive")
    if args.repeat is not None and args.repeat < 1:
        raise ValueError("--repeat must be positive")
    if args.target_count is not None and args.target_count < 1:
        raise ValueError("--target-count must be positive")
    if args.max_categories is not None and args.max_categories < 1:
        raise ValueError("--max-categories must be positive")

    if args.search_all_categories:
        result = fetch_all_category_ads(args)
    elif args.search or args.search_count:
        result = fetch_search_ads(args)
    else:
        result = fetch_booster_ads(args)

    if args.output:
        write_json(args.output, result)
        saved_count = result.get("count")
        saved_label = "ads"
        if saved_count is None and isinstance(result.get("summary"), dict):
            saved_count = result["summary"].get("target_count")
            saved_label = "targets"
        if saved_count is None:
            saved_count = result.get("total_ads", 0)
        print(f"Saved {saved_count} {saved_label} to {args.output}", file=sys.stderr)
    else:
        print(json.dumps(result, ensure_ascii=False, indent=2))

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        raise SystemExit(1)
