"use client";

import { useEffect, useReducer } from "react";
import {
  getAdvertisements,
  type Advertisement,
} from "@/src/entities/advertisement";
import {
  URGENT_CATEGORY_ID,
  type Category,
  type Subcategory,
} from "@/src/entities/category";
import {
  advertisementListReducer,
  initialAdvertisementListState,
} from "./advertisementListReducer";

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

  const setCategory = (cat: Category | null) => {
    if (cat?.id === URGENT_CATEGORY_ID) {
      dispatch({ type: "SET_URGENT_ONLY", payload: true });
      return;
    }
    dispatch({ type: "SET_CATEGORY", payload: cat?.id ?? null });
  };

  const setSubcategory = (sub: Subcategory | null, cat: Category | null) => {
    if (cat?.id === URGENT_CATEGORY_ID) {
      dispatch({ type: "SET_URGENT_ONLY", payload: true });
      return;
    }
    if (cat) dispatch({ type: "SET_CATEGORY", payload: cat.id });
    dispatch({ type: "SET_SUBCATEGORY", payload: sub?.id ?? null });
  };

  const reset = () => dispatch({ type: "RESET_FILTER" });

  const patchItem = (ad: Advertisement) =>
    dispatch({ type: "PATCH_ITEM", payload: ad });

  return {
    state,
    setCategory,
    setSubcategory,
    reset,
    patchItem,
  };
}
