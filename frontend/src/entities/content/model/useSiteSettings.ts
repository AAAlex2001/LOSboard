"use client";

import { useEffect, useState } from "react";
import { getSiteSettings, type SiteSettings } from "../api/content.api";

export function useSiteSettings(): SiteSettings | null {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getSiteSettings({ signal: controller.signal })
      .then(setSettings)
      .catch(() => setSettings(null));
    return () => controller.abort();
  }, []);

  return settings;
}
