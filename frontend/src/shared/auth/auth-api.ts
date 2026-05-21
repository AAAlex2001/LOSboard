import { config } from "@/src/shared/config/config";
import { setTokens, getRefreshToken, logout } from "@/src/shared/auth/auth-storage";

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  id: number;
  email: string;
  name: string;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(`${config.API_BASE_URL}auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Ошибка входа");
  }

  const data: LoginResponse = await response.json();

  setTokens(data.access_token, data.refresh_token);

  return data;
}

export class RefreshAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RefreshAuthError";
  }
}

export class RefreshNetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RefreshNetworkError";
  }
}

let inflightRefresh: Promise<LoginResponse> | null = null;

async function doRefresh(): Promise<LoginResponse> {
  const currentRefreshToken = getRefreshToken();

  if (!currentRefreshToken) {
    throw new RefreshAuthError("Нет refresh токена");
  }

  let response: Response;
  try {
    response = await fetch(`${config.API_BASE_URL}auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: currentRefreshToken }),
    });
  } catch (err) {
    throw new RefreshNetworkError(
      err instanceof Error ? err.message : "network error"
    );
  }

  if (response.status === 401 || response.status === 403 || response.status === 422) {
    logout();
    throw new RefreshAuthError("Refresh token rejected");
  }

  if (!response.ok) {
    throw new RefreshNetworkError(`refresh status ${response.status}`);
  }

  const data: LoginResponse = await response.json();
  setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function refreshToken(): Promise<LoginResponse> {
  if (!inflightRefresh) {
    inflightRefresh = doRefresh().finally(() => {
      inflightRefresh = null;
    });
  }
  return inflightRefresh;
}