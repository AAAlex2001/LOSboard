import type { StartChatAction, StartChatState } from "./types";

export const initialStartChatState: StartChatState = {
  loading: false,
  error: null,
  conversationId: null,
};

export function startChatReducer(
  state: StartChatState,
  action: StartChatAction
): StartChatState {
  switch (action.type) {
    case "START":
      return { ...state, loading: true, error: null };
    case "SUCCESS":
      return { loading: false, error: null, conversationId: action.payload };
    case "FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
