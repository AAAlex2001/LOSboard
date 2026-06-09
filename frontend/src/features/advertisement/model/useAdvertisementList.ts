"use client";

import { useEffect, useReducer } from "react";
import {
  getAdvertisements,
  type Advertisement,
} from "@/src/entities/advertisement";
import {
  ADVERTISEMENT_PAGE_SIZE,
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
      skip: 0,
      limit: ADVERTISEMENT_PAGE_SIZE,
      signal: controller.signal,
    })
      .then((data) => {
        if (controller.signal.aborted) return;
        dispatch({
          type: "FETCH_SUCCESS",
          payload: { items: data, hasMore: data.length === ADVERTISEMENT_PAGE_SIZE },
        });
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

  const loadMore = async () => {
    if (!enabled || state.loading || state.loadingMore || !state.hasMore) return;
    dispatch({ type: "LOAD_MORE_START" });
    try {
      const data = await getAdvertisements({
        categoryId: state.categoryId,
        subcategoryId: state.subcategoryId,
        urgentOnly: state.urgentOnly,
        skip: state.skip,
        limit: ADVERTISEMENT_PAGE_SIZE,
      });
      dispatch({
        type: "APPEND_ITEMS",
        payload: { items: data, hasMore: data.length === ADVERTISEMENT_PAGE_SIZE },
      });
    } catch (err: unknown) {
      dispatch({
        type: "LOAD_MORE_FAILURE",
        payload: err instanceof Error ? err.message : String(err),
      });
    }
  };

  return {
    state,
    setFilters,
    reset,
    patchItem,
    loadMore,
  };
}
