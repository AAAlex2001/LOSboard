import { apiFetch } from "@/src/shared/auth/api-fetch";
import { apiJson } from "@/src/shared/lib/http";
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

  return apiJson<Advertisement[]>(response, "Не удалось загрузить избранное");
}

export async function toggleFavorite(advertisementId: number): Promise<Advertisement> {
  const response = await apiFetch(`advertisements/${advertisementId}/like`, {
    method: "POST",
  });

  return apiJson<Advertisement>(response, "Не удалось обновить избранное");
}
