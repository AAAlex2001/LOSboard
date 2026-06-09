"use client";

import { useEffect, useReducer } from "react";
import {
  getAdvertisements,
  type Advertisement,
} from "@/src/entities/advertisement";
import {
  advertisementListReducer,
  initialAdvertisementListState,
} from "./advertisementListReducer";
import type { AdvertisementFilters } from "./types";

interface UseAdvertisementListOptions {
  enabled?: boolean;
}

export function useAdvertisementList({
  enabled = true,
}: UseAdvertisementListOptions = {}) {
  const [state, dispatch] = useReducer(
    advertisementListReducer,
    initialAdvertisementListState
  );

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    dispatch({ type: "FETCH_START" });

    getAdvertisements({
      categoryId: state.categoryId,
      subcategoryId: state.subcategoryId,
      urgentOnly: state.urgentOnly,
      signal: controller.signal,
    })
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
  }, [enabled, state.categoryId, state.subcategoryId, state.urgentOnly]);

  const setFilters = (filters: AdvertisementFilters) =>
    dispatch({ type: "SET_FILTERS", payload: filters });

  const reset = () => dispatch({ type: "RESET_FILTER" });

  const patchItem = (ad: Advertisement) =>
    dispatch({ type: "PATCH_ITEM", payload: ad });

  return {
    state,
    setFilters,
    reset,
    patchItem,
  };
}
