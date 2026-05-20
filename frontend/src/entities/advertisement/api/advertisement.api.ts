import { config } from "@/src/shared/config/config";
import { getAccessToken } from "@/src/shared/auth/auth-storage";
import type { Advertisement, CreateAdvertisementPayload } from "../model/types";

export async function createAdvertisement(
  payload: CreateAdvertisementPayload
): Promise<Advertisement> {
  const token = getAccessToken();

  const response = await fetch(`${config.API_BASE_URL}advertisements/create`, {
    method: "POST",
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
    throw new Error(typeof detail === "string" ? detail : "Не удалось создать объявление");
  }

  return response.json();
}
