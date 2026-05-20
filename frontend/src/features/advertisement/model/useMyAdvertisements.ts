"use client";

import { useEffect, useState } from "react";
import {
  getMyAdvertisements,
  type Advertisement,
  type GetMyAdvertisementsParams,
} from "@/src/entities/advertisement";

export function useMyAdvertisements(params: GetMyAdvertisementsParams = {}) {
  const [items, setItems] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { skip = 0, limit = 20 } = params;

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setItems([]);

    getMyAdvertisements({ skip, limit, signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return;
        setItems(data);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        setLoading(false);
      });

    return () => controller.abort();
  }, [skip, limit]);

  return { items, loading, error };
}
