import { config } from "@/src/shared/config/config";
import { login, type LoginResponse } from "@/src/shared/auth/auth-api";

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
    const errorData = await response.json().catch(() => ({}));
    const detail = errorData.detail;
    if (Array.isArray(detail)) {
      throw new Error(detail.map((d) => d.msg).join("; "));
    }
    throw new Error(typeof detail === "string" ? detail : "Ошибка регистрации");
  }

  return response.json();
}

export async function registerAndLogin(
  name: string,
  email: string,
  password: string
): Promise<LoginResponse> {
  await createAccount(name, email, password);
  return login(email, password);
}
