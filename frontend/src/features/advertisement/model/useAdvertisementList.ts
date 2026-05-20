"use client";

import { useEffect, useReducer } from "react";
import {
  getAdvertisements,
  type Advertisement,
} from "@/src/entities/advertisement";
import type { Category, Subcategory } from "@/src/entities/category";
import {
  advertisementListReducer,
  initialAdvertisementListState,
} from "./advertisementListReducer";

export function useAdvertisementList() {
  const [state, dispatch] = useReducer(
    advertisementListReducer,
    initialAdvertisementListState
  );

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "FETCH_START" });

    getAdvertisements({
      categoryId: state.categoryId,
      subcategoryId: state.subcategoryId,
    })
      .then((data) => {
        if (!cancelled) dispatch({ type: "FETCH_SUCCESS", payload: data });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        dispatch({
          type: "FETCH_FAILURE",
          payload: err instanceof Error ? err.message : String(err),
        });
      });

    return () => {
      cancelled = true;
    };
  }, [state.categoryId, state.subcategoryId]);

  const setCategory = (cat: Category | null) =>
    dispatch({ type: "SET_CATEGORY", payload: cat?.id ?? null });

  const setSubcategory = (sub: Subcategory | null, cat: Category | null) => {
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
