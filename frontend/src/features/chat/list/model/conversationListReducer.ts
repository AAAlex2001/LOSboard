import type {
  ConversationListAction,
  ConversationListState,
} from "./types";

export const initialConversationListState: ConversationListState = {
  items: [],
  loading: true,
  error: null,
};

export function conversationListReducer(
  state: ConversationListState,
  action: ConversationListAction
): ConversationListState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { items: action.payload, loading: false, error: null };
    case "FETCH_FAILURE":
      return { items: [], loading: false, error: action.payload };
    default:
      return state;
  }
}
