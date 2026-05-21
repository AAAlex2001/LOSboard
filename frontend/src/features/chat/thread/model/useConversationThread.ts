"use client";

import { useEffect, useReducer } from "react";
import { getConversation, sendMessage } from "@/src/entities/chat";
import {
  conversationThreadReducer,
  initialConversationThreadState,
} from "./conversationThreadReducer";

export function useConversationThread(conversationId: number) {
  const [state, dispatch] = useReducer(
    conversationThreadReducer,
    initialConversationThreadState
  );

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: "FETCH_START" });

    getConversation(conversationId, { signal: controller.signal })
      .then((conv) => {
        if (controller.signal.aborted) return;
        dispatch({ type: "FETCH_SUCCESS", payload: conv });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        dispatch({
          type: "FETCH_FAILURE",
          payload: err instanceof Error ? err.message : String(err),
        });
      });

    return () => controller.abort();
  }, [conversationId]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    dispatch({ type: "SEND_START" });
    try {
      const msg = await sendMessage(conversationId, trimmed);
      dispatch({ type: "SEND_SUCCESS", payload: msg });
    } catch (err: unknown) {
      dispatch({
        type: "SEND_FAILURE",
        payload: err instanceof Error ? err.message : String(err),
      });
    }
  };

  return { ...state, send };
}
