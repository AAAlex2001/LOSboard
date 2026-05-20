"use client";

import { useState } from "react";
import type { Advertisement } from "@/src/entities/advertisement";
import { toggleFavorite } from "@/src/entities/favorite";

export function useFavorite() {
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const toggle = async (ad: Advertisement): Promise<Advertisement | null> => {
    if (pendingIds.has(ad.id)) return null;

    setPendingIds((prev) => new Set(prev).add(ad.id));
    setError(null);
    try {
      return await toggleFavorite(ad.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return null;
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(ad.id);
        return next;
      });
    }
  };

  return { toggle, pendingIds, error };
}
