import { config } from "@/src/shared/config/config";

export type BannerPlacement = "main_top" | "sidebar";

export interface Banner {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  video_url: string | null;
  link_url: string | null;
  sort_order: number;
  placement: BannerPlacement;
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
  options: { signal?: AbortSignal; placement?: BannerPlacement } = {}
): Promise<Banner[]> {
  const url = new URL(`${config.API_BASE_URL}/banners/`);
  if (options.placement) {
    url.searchParams.set("placement", options.placement);
  }
  const response = await fetch(url.toString(), {
    method: "GET",
    signal: options.signal,
  });
  if (!response.ok) {
    throw new Error(await readErrorDetail(response, "Не удалось загрузить баннеры"));
  }
  return response.json();
}
