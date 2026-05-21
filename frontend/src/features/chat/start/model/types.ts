export interface StartChatState {
  loading: boolean;
  error: string | null;
  conversationId: number | null;
}

export type StartChatAction =
  | { type: "START" }
  | { type: "SUCCESS"; payload: number }
  | { type: "FAILURE"; payload: string };
