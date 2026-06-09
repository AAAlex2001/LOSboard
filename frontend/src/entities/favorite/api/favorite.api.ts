import { apiFetch } from "@/src/shared/auth/api-fetch";
import { readErrorDetail } from "@/src/shared/lib/http";
import type { Advertisement } from "@/src/entities/advertisement";

export interface GetFavoritesParams {
  skip?: number;
  limit?: number;
  signal?: AbortSignal;
}

export async function getFavorites(
  params: GetFavoritesParams = {}
): Promise<Advertisement[]> {
  const { skip = 0, limit = 20, signal } = params;

  const search = new URLSearchParams();
  search.set("skip", String(skip));
  search.set("limit", String(limit));

  const response = await apiFetch(`advertisements/my-liked?${search.toString()}`, {
    method: "GET",
    signal,
  });

  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось загрузить избранное"));
  }

  return response.json();
}

export async function toggleFavorite(advertisementId: number): Promise<Advertisement> {
  const response = await apiFetch(`advertisements/${advertisementId}/like`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось обновить избранное"));
  }

  return response.json();
}
