"use client";

import { useCallback, useEffect, useReducer } from "react";

export interface ListState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
}

type ListAction<T> =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: T[] }
  | { type: "FETCH_FAILURE"; payload: string }
  | { type: "PATCH_ITEM"; payload: T; key: (item: T) => string | number };

export function listReducer<T>(
  state: ListState<T>,
  action: ListAction<T>
): ListState<T> {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { items: action.payload, loading: false, error: null };
    case "FETCH_FAILURE":
      return { items: [], loading: false, error: action.payload };
    case "PATCH_ITEM": {
      const key = action.key(action.payload);
      return {
        ...state,
        items: state.items.map((item) =>
          action.key(item) === key ? action.payload : item
        ),
      };
    }
  }
}

export interface UseListResourceOptions<T> {
  enabled?: boolean;
  fetcher: (signal: AbortSignal) => Promise<T[]>;
  itemKey: (item: T) => string | number;
}

const initialState = { items: [], loading: true, error: null };

export function useListResource<T>({
  enabled = true,
  fetcher,
  itemKey,
}: UseListResourceOptions<T>) {
  const [state, dispatch] = useReducer(
    listReducer as React.Reducer<ListState<T>, ListAction<T>>,
    initialState as ListState<T>
  );

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    dispatch({ type: "FETCH_START" });
    fetcher(controller.signal)
      .then((items) => {
        if (controller.signal.aborted) return;
        dispatch({ type: "FETCH_SUCCESS", payload: items });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        dispatch({
          type: "FETCH_FAILURE",
          payload: err instanceof Error ? err.message : String(err),
        });
      });
    return () => controller.abort();
  }, [enabled, fetcher]);

  const patchItem = useCallback(
    (item: T) => dispatch({ type: "PATCH_ITEM", payload: item, key: itemKey }),
    [itemKey]
  );

  return { state, patchItem };
}
