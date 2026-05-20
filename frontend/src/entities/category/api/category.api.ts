import { config } from "@/src/shared/config/config";
import type { Category } from "../model/types";

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${config.API_BASE_URL}categories/list`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Не удалось загрузить категории");
  }

  return response.json();
}
