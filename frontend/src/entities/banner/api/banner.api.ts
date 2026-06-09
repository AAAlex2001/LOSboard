import { config } from "@/src/shared/config/config";
import { apiJson } from "@/src/shared/lib/http";

export type BannerPlacement = "main_top" | "sidebar";

export interface Banner {
  id: number;
  title: string;
  description: string | null;
  age_label: string | null;
  image_url: string | null;
  video_url: string | null;
  link_url: string | null;
  sort_order: number;
  placement: BannerPlacement;
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
  return apiJson<Banner[]>(response, "Не удалось загрузить баннеры");
}
