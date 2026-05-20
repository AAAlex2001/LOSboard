"use client";

import { useEffect, useState } from "react";
import type { Advertisement } from "@/src/entities/advertisement";
import { getFavorites, type GetFavoritesParams } from "../api/favorite.api";

export function useFavorites(params: GetFavoritesParams = {}) {
  const [items, setItems] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { skip = 0, limit = 20 } = params;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getFavorites({ skip, limit })
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setItems([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [skip, limit]);

  return { items, loading, error };
}
