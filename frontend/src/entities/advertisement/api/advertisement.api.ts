import { config } from "@/src/shared/config/config";
import { apiFetch } from "@/src/shared/auth/api-fetch";
import type { Advertisement, CreateAdvertisementPayload } from "../model/types";

export interface GetAdvertisementsParams {
  categoryId?: number | null;
  subcategoryId?: number | null;
  skip?: number;
  limit?: number;
  signal?: AbortSignal;
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

async function readErrorDetail(response: Response, fallback: string): Promise<string> {
  const errorData = await response.json().catch(() => ({}));
  const detail = errorData.detail;
  if (Array.isArray(detail)) {
    return detail.map((d) => d.msg).join("; ");
  }
  return typeof detail === "string" ? detail : fallback;
}

export async function uploadAdvertisementImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const response = await apiFetch("uploads/image", {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось загрузить фото"));
  }

  const data = (await response.json()) as { url: string };
  return data.url;
}

export async function createAdvertisement(
  payload: CreateAdvertisementPayload
): Promise<Advertisement> {
  const response = await apiFetch("advertisements/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось создать объявление"));
  }

  return response.json();
}

export async function getAdvertisements(
  params: GetAdvertisementsParams = {}
): Promise<Advertisement[]> {
  const { categoryId, subcategoryId, skip = 0, limit = 20, signal } = params;

  const search = new URLSearchParams();
  search.set("skip", String(skip));
  search.set("limit", String(limit));
  if (categoryId != null) search.set("category_id", String(categoryId));
  if (subcategoryId != null) search.set("subcategory_id", String(subcategoryId));

  const response = await apiFetch(`advertisements/?${search.toString()}`, {
    method: "GET",
    signal,
  });

  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось загрузить объявления"));
  }

  return response.json();
}

export interface GetMyAdvertisementsParams {
  skip?: number;
  limit?: number;
  signal?: AbortSignal;
}

export async function getMyAdvertisements(
  params: GetMyAdvertisementsParams = {}
): Promise<Advertisement[]> {
  const { skip = 0, limit = 20, signal } = params;

  const search = new URLSearchParams();
  search.set("skip", String(skip));
  search.set("limit", String(limit));

  const response = await apiFetch(`advertisements/my?${search.toString()}`, {
    method: "GET",
    signal,
  });

  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось загрузить ваши объявления"));
  }

  return response.json();
}

export async function getAdvertisement(
  id: number,
  options: { signal?: AbortSignal } = {}
): Promise<Advertisement> {
  const response = await apiFetch(`advertisements/${id}`, {
    method: "GET",
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось загрузить объявление"));
  }

  return response.json();
}

export type UpdateAdvertisementPayload = Partial<{
  title: string;
  description: string | null;
  price: number;
  category_id: number;
  subcategory_id: number;
  location: string;
  photo_urls: string[];
  is_active: boolean;
}>;

export async function updateAdvertisement(
  id: number,
  payload: UpdateAdvertisementPayload
): Promise<Advertisement> {
  const response = await apiFetch(`advertisements/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось обновить объявление"));
  }

  return response.json();
}

export async function deleteAdvertisement(id: number): Promise<void> {
  const response = await apiFetch(`advertisements/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось удалить объявление"));
  }
}
