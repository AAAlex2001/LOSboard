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

  const toggle = async (ad: Advertisement): Promise<Advertisement | null> => {
    if (state.pendingIds.has(ad.id)) return null;
    dispatch({ type: "TOGGLE_START", payload: ad.id });
    try {
      const result = await toggleFavorite(ad.id);
      dispatch({ type: "TOGGLE_END", payload: ad.id });
      return result;
    } catch (err) {
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
