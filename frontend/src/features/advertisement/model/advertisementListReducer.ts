import type {
  AdvertisementListAction,
  AdvertisementListState,
} from "./types";

export const ADVERTISEMENT_PAGE_SIZE = 20;

export const initialAdvertisementListState: AdvertisementListState = {
  categoryId: null,
  subcategoryId: null,
  urgentOnly: false,
  items: [],
  skip: 0,
  hasMore: false,
  loading: true,
  loadingMore: false,
  error: null,
};

export function advertisementListReducer(
  state: AdvertisementListState,
  action: AdvertisementListAction
): AdvertisementListState {
  switch (action.type) {
    case "SET_FILTERS": {
      const { categoryId, subcategoryId, urgentOnly } = action.payload;
      if (
        state.categoryId === categoryId &&
        state.subcategoryId === subcategoryId &&
        state.urgentOnly === urgentOnly
      ) {
        return state;
      }
      return {
        ...state,
        categoryId,
        subcategoryId,
        urgentOnly,
        items: [],
        skip: 0,
        hasMore: false,
        loading: true,
        loadingMore: false,
        error: null,
      };
    }
    case "RESET_FILTER":
      if (
        state.categoryId === null &&
        state.subcategoryId === null &&
        !state.urgentOnly
      ) {
        return state;
      }
      return {
        ...state,
        categoryId: null,
        subcategoryId: null,
        urgentOnly: false,
        items: [],
        skip: 0,
        hasMore: false,
        loading: true,
        loadingMore: false,
        error: null,
      };
    case "FETCH_START":
      return { ...state, loading: true, loadingMore: false, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        items: action.payload.items,
        skip: action.payload.items.length,
        hasMore: action.payload.hasMore,
        error: null,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        loading: false,
        loadingMore: false,
        items: [],
        skip: 0,
        hasMore: false,
        error: action.payload,
      };
    case "LOAD_MORE_START":
      return { ...state, loadingMore: true, error: null };
    case "LOAD_MORE_FAILURE":
      return { ...state, loadingMore: false, error: action.payload };
    case "APPEND_ITEMS": {
      const items = [...state.items, ...action.payload.items];
      return {
        ...state,
        loadingMore: false,
        items,
        skip: items.length,
        hasMore: action.payload.hasMore,
        error: null,
      };
    }
    case "PATCH_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    default:
      return state;
  }
}
