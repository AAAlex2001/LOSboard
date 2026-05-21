"use client";

import { useEffect, useReducer } from "react";
import { getConversations } from "@/src/entities/chat";
import {
  conversationListReducer,
  initialConversationListState,
} from "./conversationListReducer";

export function useConversationList() {
  const [state, dispatch] = useReducer(
    conversationListReducer,
    initialConversationListState
  );

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: "FETCH_START" });

    getConversations({ signal: controller.signal })
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
  }, []);

  const markAsRead = (conversationId: number) => {
    dispatch({ type: "MARK_AS_READ", payload: conversationId });
  };

  return { ...state, markAsRead };
}
