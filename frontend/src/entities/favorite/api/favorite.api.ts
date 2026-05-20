import { config } from "@/src/shared/config/config";
import { getAccessToken } from "@/src/shared/auth/auth-storage";
import type { Advertisement } from "@/src/entities/advertisement";

export interface GetFavoritesParams {
  skip?: number;
  limit?: number;
}

export async function getFavorites(
  params: GetFavoritesParams = {}
): Promise<Advertisement[]> {
  const { skip = 0, limit = 20 } = params;
  const token = getAccessToken();
  if (!token) {
    throw new Error("Войдите, чтобы посмотреть избранное");
  }

  const search = new URLSearchParams();
  search.set("skip", String(skip));
  search.set("limit", String(limit));

  const response = await fetch(
    `${config.API_BASE_URL}advertisements/my-liked?${search.toString()}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const detail = errorData.detail;
    throw new Error(typeof detail === "string" ? detail : "Не удалось загрузить избранное");
  }

  return response.json();
}

export async function toggleFavorite(advertisementId: number): Promise<Advertisement> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Войдите, чтобы добавлять в избранное");
  }

  const response = await fetch(
    `${config.API_BASE_URL}advertisements/${advertisementId}/like`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const detail = errorData.detail;
    throw new Error(typeof detail === "string" ? detail : "Не удалось обновить избранное");
  }

  return response.json();
}
