"use client";

import { useEffect, useReducer } from "react";
import type { Advertisement } from "@/src/entities/advertisement";
import { getFavorites, type GetFavoritesParams } from "@/src/entities/favorite";
import {
  favoritesReducer,
  initialFavoritesState,
} from "./favoritesReducer";

export function useFavorites(params: GetFavoritesParams = {}) {
  const [state, dispatch] = useReducer(favoritesReducer, initialFavoritesState);

  const { skip = 0, limit = 20 } = params;

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: "FETCH_START" });

    getFavorites({ skip, limit, signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return;
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        dispatch({
          type: "FETCH_FAILURE",
          payload: err instanceof Error ? err.message : String(err),
        });
      });

    return () => controller.abort();
  }, [skip, limit]);

  const patchItem = (ad: Advertisement) =>
    dispatch({ type: "PATCH_ITEM", payload: ad });

  return { ...state, patchItem };
}
