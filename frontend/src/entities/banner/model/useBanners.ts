"use client";

import { useEffect, useState } from "react";
import { getActiveBanners, type Banner } from "../api/banner.api";

export function useBanners(): Banner[] {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    getActiveBanners({ signal: controller.signal })
      .then(setBanners)
      .catch(() => setBanners([]));
    return () => controller.abort();
  }, []);

  return banners;
}
