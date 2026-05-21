import { config } from "@/src/shared/config/config";
import { getAccessToken } from "@/src/shared/auth/auth-storage";
import type { User } from "../model/types";

export interface UpdateAccountPayload {
  name?: string;
  email?: string;
  password?: string;
  phone_number?: string;
}

export async function getMe(): Promise<User> {
  const token = getAccessToken();

  const response = await fetch(`${config.API_BASE_URL}auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Не удалось загрузить пользователя");
  }

  return response.json();
}

export async function uploadAvatar(file: File): Promise<{ avatar_url: string }> {
  const token = getAccessToken();
  const form = new FormData();
  form.append("file", file);

  const response = await fetch(`${config.API_BASE_URL}auth/avatar`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: form,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const detail = errorData.detail;
    if (Array.isArray(detail)) {
      throw new Error(detail.map((d) => d.msg).join("; "));
    }
    throw new Error(
      typeof detail === "string" ? detail : "Не удалось загрузить аватар"
    );
  }

  return response.json();
}

export async function updateAccount(payload: UpdateAccountPayload): Promise<User> {
  const token = getAccessToken();

  const response = await fetch(`${config.API_BASE_URL}auth/update-account`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const detail = errorData.detail;
    if (Array.isArray(detail)) {
      throw new Error(detail.map((d) => d.msg).join("; "));
    }
    throw new Error(typeof detail === "string" ? detail : "Не удалось обновить");
  }

  return response.json();
}
