import { config } from "@/src/shared/config/config";
import { getAccessToken } from "@/src/shared/auth/auth-storage";
import {
  refreshToken,
  RefreshAuthError,
} from "@/src/shared/auth/auth-api";

function buildHeaders(
  accessToken: string | null,
  body: BodyInit | null | undefined,
  override?: HeadersInit
): Record<string, string> {
  const headers: Record<string, string> = {};

  // JSON Content-Type только если body есть и это НЕ FormData
  if (body != null && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  if (override) {
    if (override instanceof Headers) {
      override.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(override)) {
      override.forEach(([k, v]) => {
        headers[k] = v;
      });
    } else {
      Object.assign(headers, override);
    }
  }

  return headers;
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const response = await fetch(`${config.API_BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(getAccessToken(), options.body, options.headers),
  });

  if (response.status !== 401) {
    return response;
  }

  try {
    const refreshed = await refreshToken();
    return await fetch(`${config.API_BASE_URL}${path}`, {
      ...options,
      headers: buildHeaders(refreshed.access_token, options.body, options.headers),
    });
  } catch (err) {
    if (err instanceof RefreshAuthError) {
      // только реальная auth-ошибка отправляет на логин;
      // logout уже вызван внутри refreshToken
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    // на сетевую ошибку refresh'а отдаём оригинальный 401 — пусть caller решит
    return response;
  }
}
