import type {
  SearchAdvertisementAction,
  SearchAdvertisementState,
} from "./types";

export const initialSearchState: SearchAdvertisementState = {
  query: "",
  suggestions: [],
  loading: false,
  error: null,
  open: false,
};

export function searchAdvertisementReducer(
  state: SearchAdvertisementState,
  action: SearchAdvertisementAction
): SearchAdvertisementState {
  switch (action.type) {
    case "SET_QUERY":
      return { ...state, query: action.payload };
    case "OPEN":
      return { ...state, open: true };
    case "CLOSE":
      return { ...state, open: false };
    case "FETCH_START":
      return { ...state, loading: true, error: null, open: true, suggestions: [] };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, suggestions: action.payload, error: null };
    case "FETCH_FAILURE":
      return { ...state, loading: false, error: action.payload, suggestions: [] };
    case "RESET":
      return initialSearchState;
    default:
      return state;
  }
}
