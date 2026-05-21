"use client";

import { useEffect, useReducer } from "react";
import {
  getMyAdvertisements,
  type GetMyAdvertisementsParams,
} from "@/src/entities/advertisement";
import {
  initialMyAdvertisementsState,
  myAdvertisementsReducer,
} from "./myAdvertisementsReducer";

export function useMyAdvertisements(params: GetMyAdvertisementsParams = {}) {
  const [state, dispatch] = useReducer(
    myAdvertisementsReducer,
    initialMyAdvertisementsState
  );

  const { skip = 0, limit = 20 } = params;

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: "FETCH_START" });

    getMyAdvertisements({ skip, limit, signal: controller.signal })
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

  return state;
}
