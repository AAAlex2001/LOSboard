import type { FavoritesAction, FavoritesState } from "./types";

export const initialFavoritesState: FavoritesState = {
  items: [],
  loading: true,
  error: null,
};

export function favoritesReducer(
  state: FavoritesState,
  action: FavoritesAction
): FavoritesState {
  switch (action.type) {
    case "FETCH_START":
      return { items: [], loading: true, error: null };
    case "FETCH_SUCCESS":
      return { items: action.payload, loading: false, error: null };
    case "FETCH_FAILURE":
      return { items: [], loading: false, error: action.payload };
    case "PATCH_ITEM":
      return {
        ...state,
        items: action.payload.is_liked
          ? state.items.map((i) =>
              i.id === action.payload.id ? action.payload : i
            )
          : state.items.filter((i) => i.id !== action.payload.id),
      };
    default:
      return state;
  }
}
