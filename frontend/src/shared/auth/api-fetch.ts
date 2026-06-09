import { config } from "@/src/shared/config/config";
import { getAccessToken } from "@/src/shared/auth/auth-storage";
import {
  refreshToken,
  RefreshAuthError,
} from "@/src/shared/auth/auth-api";
import { apiJson } from "@/src/shared/lib/http";

function buildHeaders(
  accessToken: string | null,
  body: BodyInit | null | undefined,
  override?: HeadersInit
): Record<string, string> {
  const headers: Record<string, string> = {};

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
    credentials: "include",
    headers: buildHeaders(getAccessToken(), options.body, options.headers),
  });

  if (response.status !== 401) {
    return response;
  }

  try {
    const refreshed = await refreshToken();
    return await fetch(`${config.API_BASE_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: buildHeaders(refreshed.access_token, options.body, options.headers),
    });
  } catch (err) {
    if (err instanceof RefreshAuthError) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return response;
    }
    throw err;
  }
}

export async function apiFetchJson<T>(
  path: string,
  init: RequestInit = {},
  fallbackError: string
): Promise<T> {
  return apiJson<T>(await apiFetch(path, init), fallbackError);
}
