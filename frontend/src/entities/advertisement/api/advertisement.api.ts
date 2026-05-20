import { config } from "@/src/shared/config/config";
import { getAccessToken } from "@/src/shared/auth/auth-storage";
import type { Advertisement, CreateAdvertisementPayload } from "../model/types";

export interface GetAdvertisementsParams {
  categoryId?: number | null;
  subcategoryId?: number | null;
  skip?: number;
  limit?: number;
}

const apiOrigin = () => {
  try {
    return new URL(config.API_BASE_URL).origin;
  } catch {
    return "";
  }
};

export const resolveAssetUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${apiOrigin()}${path}`;
};

export async function uploadAdvertisementImage(file: File): Promise<string> {
  const token = getAccessToken();
  const form = new FormData();
  form.append("file", file);

  const response = await fetch(`${config.API_BASE_URL}uploads/image`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const detail = errorData.detail;
    throw new Error(typeof detail === "string" ? detail : "Не удалось загрузить фото");
  }

  const data = (await response.json()) as { url: string };
  return data.url;
}

export async function createAdvertisement(
  payload: CreateAdvertisementPayload
): Promise<Advertisement> {
  const token = getAccessToken();

  const response = await fetch(`${config.API_BASE_URL}advertisements/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const detail = errorData.detail;
    if (Array.isArray(detail)) {
      throw new Error(detail.map((d) => d.msg).join("; "));
    }
    throw new Error(typeof detail === "string" ? detail : "Не удалось создать объявление");
  }

  return response.json();
}

export async function getAdvertisements(
  params: GetAdvertisementsParams = {}
): Promise<Advertisement[]> {
  const { categoryId, subcategoryId, skip = 0, limit = 20 } = params;
  const token = getAccessToken();

  const search = new URLSearchParams();
  search.set("skip", String(skip));
  search.set("limit", String(limit));
  if (categoryId != null) search.set("category_id", String(categoryId));
  if (subcategoryId != null) search.set("subcategory_id", String(subcategoryId));

  const response = await fetch(
    `${config.API_BASE_URL}advertisements/?${search.toString()}`,
    {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const detail = errorData.detail;
    throw new Error(typeof detail === "string" ? detail : "Не удалось загрузить объявления");
  }

  return response.json();
}
