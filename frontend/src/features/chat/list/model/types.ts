import type { ConversationListItem } from "@/src/entities/chat";

export interface ConversationListState {
  items: ConversationListItem[];
  loading: boolean;
  error: string | null;
}

export type ConversationListAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: ConversationListItem[] }
  | { type: "FETCH_FAILURE"; payload: string };
