import { apiFetch } from "@/src/shared/auth/api-fetch";
import { apiJson } from "@/src/shared/lib/http";
import type { User } from "../model/types";

export interface UpdateAccountPayload {
  name?: string;
  email?: string;
  password?: string;
  phone_number?: string;
}

export async function getMe(): Promise<User> {
  const response = await apiFetch("auth/me", { method: "GET" });

  return apiJson<User>(response, "Не удалось загрузить пользователя");
}

export async function uploadAvatar(file: File): Promise<{ avatar_url: string }> {
  const form = new FormData();
  form.append("file", file);

  const response = await apiFetch("auth/avatar", {
    method: "POST",
    body: form,
  });

  return apiJson<{ avatar_url: string }>(response, "Не удалось загрузить аватар");
}

export async function updateAccount(payload: UpdateAccountPayload): Promise<User> {
  const response = await apiFetch("auth/update-account", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return apiJson<User>(response, "Не удалось обновить");
}
