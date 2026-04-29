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

export async function refreshToken(): Promise<LoginResponse> {
  const currentRefreshToken = getRefreshToken();

  if (!currentRefreshToken) {
    logout();
    throw new Error("Нет refresh токена");
  }

  const response = await fetch(`${config.API_BASE_URL}auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: currentRefreshToken }),
  });

  if (!response.ok) {
    logout();
    throw new Error("Не удалось обновить токен");
  }

  const data: LoginResponse = await response.json();

  setTokens(data.access_token, data.refresh_token);

  return data;
}