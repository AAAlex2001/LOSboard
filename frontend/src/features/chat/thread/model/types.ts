import type { ChatMessage, ConversationDetail } from "@/src/entities/chat";

export interface ConversationThreadState {
  conversation: ConversationDetail | null;
  loading: boolean;
  sending: boolean;
  error: string | null;
  sendError: string | null;
}

export type ConversationThreadAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: ConversationDetail }
  | { type: "FETCH_FAILURE"; payload: string }
  | { type: "SEND_START" }
  | { type: "SEND_SUCCESS"; payload: ChatMessage }
  | { type: "SEND_FAILURE"; payload: string };
