import type {
  ConversationThreadAction,
  ConversationThreadState,
} from "./types";

export const initialConversationThreadState: ConversationThreadState = {
  conversation: null,
  loading: true,
  sending: false,
  error: null,
  sendError: null,
};

export function conversationThreadReducer(
  state: ConversationThreadState,
  action: ConversationThreadAction
): ConversationThreadState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        conversation: action.payload,
        error: null,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        loading: false,
        conversation: null,
        error: action.payload,
      };
    case "SEND_START":
      return { ...state, sending: true, sendError: null };
    case "SEND_SUCCESS": {
      if (!state.conversation) {
        return { ...state, sending: false };
      }
      const exists = state.conversation.messages.some(
        (m) => m.id === action.payload.id
      );
      const messages = exists
        ? state.conversation.messages
        : [...state.conversation.messages, action.payload];
      return {
        ...state,
        sending: false,
        sendError: null,
        conversation: { ...state.conversation, messages },
      };
    }
    case "SEND_FAILURE":
      return { ...state, sending: false, sendError: action.payload };
    default:
      return state;
  }
}
