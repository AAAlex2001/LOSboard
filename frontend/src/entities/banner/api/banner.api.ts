import { config } from "@/src/shared/config/config";

export interface Banner {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  link_url: string | null;
  sort_order: number;
}

async function readErrorDetail(
  response: Response,
  fallback: string
): Promise<string> {
  const errorData = await response.json().catch(() => ({}));
  const detail = errorData.detail;
  return typeof detail === "string" ? detail : fallback;
}

export async function getActiveBanners(
  options: { signal?: AbortSignal } = {}
): Promise<Banner[]> {
  const response = await fetch(`${config.API_BASE_URL}/banners/`, {
    method: "GET",
    signal: options.signal,
  });
  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось загрузить баннеры"));
  }
  return response.json();
}
