"use client";

import { useEffect, useReducer } from "react";
import { useRouter } from "next/navigation";
import { searchAdvertisements } from "@/src/entities/advertisement";
import {
  initialSearchState,
  searchAdvertisementReducer,
} from "./searchAdvertisementReducer";

const DEBOUNCE_MS = 350;
const MIN_QUERY_LENGTH = 2;

export function useSearchAdvertisement() {
  const router = useRouter();
  const [state, dispatch] = useReducer(
    searchAdvertisementReducer,
    initialSearchState
  );

  useEffect(() => {
    const query = state.query.trim();

    if (query.length < MIN_QUERY_LENGTH) {
      dispatch({ type: "CLOSE" });
      return;
    }

    const controller = new AbortController();
    dispatch({ type: "FETCH_START" });

    const timer = setTimeout(() => {
      searchAdvertisements({ q: query, limit: 8, signal: controller.signal })
        .then((items) => {
          if (controller.signal.aborted) return;
          dispatch({ type: "FETCH_SUCCESS", payload: items });
        })
        .catch((err: unknown) => {
          if (controller.signal.aborted) return;
          if ((err as Error).name === "AbortError") return;
          dispatch({
            type: "FETCH_FAILURE",
            payload: err instanceof Error ? err.message : String(err),
          });
        });
    }, DEBOUNCE_MS);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [state.query]);

  const setQuery = (value: string) =>
    dispatch({ type: "SET_QUERY", payload: value });

  const close = () => dispatch({ type: "CLOSE" });
  const open = () => dispatch({ type: "OPEN" });
  const reset = () => dispatch({ type: "RESET" });

  const goToAdvertisement = (id: number) => {
    close();
    router.push(`/advertisements/${id}`);
  };

  const submit = () => {
    const query = state.query.trim();
    if (!query) return;
    close();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return {
    state,
    setQuery,
    open,
    close,
    reset,
    goToAdvertisement,
    submit,
  };
}
