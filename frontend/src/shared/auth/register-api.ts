import { config } from "@/src/shared/config/config";
import { type LoginResponse } from "@/src/shared/auth/auth-api";
import { setTokens } from "@/src/shared/auth/auth-storage";
import { readErrorDetail } from "@/src/shared/lib/http";

export interface CreateAccountResponse {
  message: string;
  email: string;
  id: number;
}

export async function createAccount(
  name: string,
  email: string,
  password: string
): Promise<CreateAccountResponse> {
  const response = await fetch(`${config.API_BASE_URL}auth/create-account`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Ошибка регистрации"));
  }

  return response.json();
}

export async function verifyEmail(
  email: string,
  code: string
): Promise<LoginResponse> {
  const response = await fetch(`${config.API_BASE_URL}auth/verify-email`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });

  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Неверный код"));
  }

  const data: LoginResponse = await response.json();
  setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function resendCode(email: string): Promise<void> {
  const response = await fetch(`${config.API_BASE_URL}auth/resend-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось отправить код"));
  }
}
