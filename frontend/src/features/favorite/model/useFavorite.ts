"use client";

import { useReducer } from "react";
import type { Advertisement } from "@/src/entities/advertisement";
import { toggleFavorite } from "@/src/entities/favorite";
import {
  favoriteToggleReducer,
  initialFavoriteToggleState,
} from "./favoriteToggleReducer";

export function useFavorite() {
  const [state, dispatch] = useReducer(
    favoriteToggleReducer,
    initialFavoriteToggleState
  );

  const toggle = async (
    ad: Advertisement,
    onOptimistic?: (next: Advertisement) => void,
    onRevert?: (prev: Advertisement) => void
  ): Promise<Advertisement | null> => {
    if (state.pendingIds.has(ad.id)) return null;
    const optimistic: Advertisement = {
      ...ad,
      is_liked: !ad.is_liked,
      likes_count: Math.max(0, (ad.likes_count ?? 0) + (ad.is_liked ? -1 : 1)),
    };
    onOptimistic?.(optimistic);
    dispatch({ type: "TOGGLE_START", payload: ad.id });
    try {
      const result = await toggleFavorite(ad.id);
      dispatch({ type: "TOGGLE_END", payload: ad.id });
      return result;
    } catch (err) {
      onRevert?.(ad);
      dispatch({
        type: "TOGGLE_FAILURE",
        payload: {
          id: ad.id,
          error: err instanceof Error ? err.message : String(err),
        },
      });
      return null;
    }
  };

  return { toggle, ...state };
}
