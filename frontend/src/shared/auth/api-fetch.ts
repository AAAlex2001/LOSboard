import { config } from "@/src/shared/config/config";
import { getAccessToken, logout } from "@/src/shared/auth/auth-storage";
import { refreshToken } from "@/src/shared/auth/auth-api";

function makeHeaders(accessToken: string | null) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  let response = await fetch(`${config.API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...makeHeaders(getAccessToken()),
      ...options.headers,
    },
  });

  if (response.status !== 401) {
    return response;
  }

  try {
    const refreshed = await refreshToken();

    response = await fetch(`${config.API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...makeHeaders(refreshed.access_token),
        ...options.headers,
      },
    });

    return response;
  } catch {
    logout();
    window.location.href = "/login";
    return response;
  }
}