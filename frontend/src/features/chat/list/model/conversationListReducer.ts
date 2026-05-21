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
    case "MARK_AS_READ":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload && item.unread_count > 0
            ? { ...item, unread_count: 0 }
            : item
        ),
      };
    default:
      return state;
  }
}
