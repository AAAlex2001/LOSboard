import type {
  ChatComposerAction,
  ChatComposerState,
  PendingFile,
} from "./types";

export const initialChatComposerState: ChatComposerState = {
  draft: "",
  files: [],
  uploading: false,
  error: null,
};

export function chatComposerReducer(
  state: ChatComposerState,
  action: ChatComposerAction
): ChatComposerState {
  switch (action.type) {
    case "SET_DRAFT":
      return { ...state, draft: action.payload };
    case "ADD_FILES":
      return { ...state, files: [...state.files, ...action.payload], error: null };
    case "REMOVE_FILE":
      return {
        ...state,
        files: state.files.filter((f: PendingFile) => f.id !== action.payload),
      };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "UPLOAD_START":
      return { ...state, uploading: true, error: null };
    case "UPLOAD_END":
      return { ...state, uploading: false };
    case "RESET":
      return { ...initialChatComposerState };
    default:
      return state;
  }
}
