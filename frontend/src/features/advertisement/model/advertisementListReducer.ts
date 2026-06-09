import type {
  AdvertisementListAction,
  AdvertisementListState,
} from "./types";

export const initialAdvertisementListState: AdvertisementListState = {
  categoryId: null,
  subcategoryId: null,
  urgentOnly: false,
  items: [],
  loading: true,
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
        loading: true,
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
        loading: true,
        error: null,
      };
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, items: action.payload, error: null };
    case "FETCH_FAILURE":
      return { ...state, loading: false, items: [], error: action.payload };
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
