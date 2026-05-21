"use client";

import { useReducer } from "react";
import { startConversation } from "@/src/entities/chat";
import {
  initialStartChatState,
  startChatReducer,
} from "./startChatReducer";

export function useStartChat() {
  const [state, dispatch] = useReducer(startChatReducer, initialStartChatState);

  const start = async (
    advertisementId: number,
    text?: string
  ): Promise<number | null> => {
    dispatch({ type: "START" });
    try {
      const conv = await startConversation(advertisementId, text);
      dispatch({ type: "SUCCESS", payload: conv.id });
      return conv.id;
    } catch (err: unknown) {
      dispatch({
        type: "FAILURE",
        payload: err instanceof Error ? err.message : String(err),
      });
      return null;
    }
  };

  return { ...state, start };
}
