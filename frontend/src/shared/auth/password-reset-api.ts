import { config } from "@/src/shared/config/config";
import { type LoginResponse } from "@/src/shared/auth/auth-api";
import { setTokens } from "@/src/shared/auth/auth-storage";
import { readErrorDetail } from "@/src/shared/lib/http";

export async function forgotPassword(email: string): Promise<void> {
  const response = await fetch(`${config.API_BASE_URL}auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось отправить код"));
  }
}

export async function verifyResetCode(email: string, code: string): Promise<void> {
  const response = await fetch(`${config.API_BASE_URL}auth/verify-reset-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });

  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Неверный код"));
  }
}

export async function resetPassword(
  email: string,
  code: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(`${config.API_BASE_URL}auth/reset-password`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, password }),
  });

  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось сменить пароль"));
  }

  const data: LoginResponse = await response.json();
  setTokens(data.access_token, data.refresh_token);
  return data;
}
