"use client";

import { useEffect, useReducer, useRef } from "react";
import { viewAdvertisement } from "@/src/entities/advertisement";
import { isAuthenticated } from "@/src/shared/auth/auth-storage";
import {
  createInitialViewState,
  viewAdvertisementReducer,
} from "./viewAdvertisementReducer";

interface UseViewAdvertisementParams {
  advertisementId: number;
  initialViewsCount?: number;
  initialIsViewed?: boolean;
}

export function useViewAdvertisement({
  advertisementId,
  initialViewsCount = 0,
  initialIsViewed = false,
}: UseViewAdvertisementParams) {
  const [state, dispatch] = useReducer(
    viewAdvertisementReducer,
    createInitialViewState(initialViewsCount, initialIsViewed)
  );
  const registeredRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) return;
    if (registeredRef.current === advertisementId) return;
    registeredRef.current = advertisementId;

    viewAdvertisement(advertisementId)
      .then((ad) => {
        dispatch({
          type: "VIEW_REGISTERED",
          payload: {
            is_viewed: ad.is_viewed ?? true,
            views_count: ad.views_count ?? 0,
          },
        });
      })
      .catch((err: unknown) => {
        dispatch({
          type: "FAILURE",
          payload: err instanceof Error ? err.message : String(err),
        });
      });
  }, [advertisementId]);

  return state;
}
