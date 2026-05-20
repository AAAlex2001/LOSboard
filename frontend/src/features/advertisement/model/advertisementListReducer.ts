import type {
  AdvertisementListAction,
  AdvertisementListState,
} from "./types";

export const initialAdvertisementListState: AdvertisementListState = {
  categoryId: null,
  subcategoryId: null,
  items: [],
  loading: true,
  error: null,
};

export function advertisementListReducer(
  state: AdvertisementListState,
  action: AdvertisementListAction
): AdvertisementListState {
  switch (action.type) {
    case "SET_CATEGORY":
      return { ...state, categoryId: action.payload, subcategoryId: null };
    case "SET_SUBCATEGORY":
      return { ...state, subcategoryId: action.payload };
    case "RESET_FILTER":
      return { ...state, categoryId: null, subcategoryId: null };
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
