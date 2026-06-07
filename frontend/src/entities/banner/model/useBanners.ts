"use client";

import { useEffect, useState } from "react";
import {
  getActiveBanners,
  type Banner,
  type BannerPlacement,
} from "../api/banner.api";

export function useBanners(options: { placement?: BannerPlacement } = {}): Banner[] {
  const { placement } = options;
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    getActiveBanners({ signal: controller.signal, placement })
      .then(setBanners)
      .catch(() => setBanners([]));
    return () => controller.abort();
  }, [placement]);

  return banners;
}

export function useMainTopBanners(): Banner[] {
  return useBanners({ placement: "main_top" });
}

export function useSidebarBanners(): Banner[] {
  return useBanners({ placement: "sidebar" });
}
