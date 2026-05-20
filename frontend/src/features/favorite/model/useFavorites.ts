"use client";

import { useEffect, useState } from "react";
import type { Advertisement } from "@/src/entities/advertisement";
import { getFavorites, type GetFavoritesParams } from "@/src/entities/favorite";

export function useFavorites(params: GetFavoritesParams = {}) {
  const [items, setItems] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { skip = 0, limit = 20 } = params;

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setItems([]);

    getFavorites({ skip, limit, signal: controller.signal })
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

  const patchItem = (ad: Advertisement) => {
    setItems((prev) =>
      ad.is_liked
        ? prev.map((i) => (i.id === ad.id ? ad : i))
        : prev.filter((i) => i.id !== ad.id)
    );
  };

  return { items, loading, error, patchItem };
}
