import type { FavoriteToggleAction, FavoriteToggleState } from "./types";

export const initialFavoriteToggleState: FavoriteToggleState = {
  pendingIds: new Set<number>(),
  error: null,
};

export function favoriteToggleReducer(
  state: FavoriteToggleState,
  action: FavoriteToggleAction
): FavoriteToggleState {
  switch (action.type) {
    case "TOGGLE_START": {
      const pendingIds = new Set(state.pendingIds);
      pendingIds.add(action.payload);
      return { pendingIds, error: null };
    }
    case "TOGGLE_END": {
      const pendingIds = new Set(state.pendingIds);
      pendingIds.delete(action.payload);
      return { ...state, pendingIds };
    }
    case "TOGGLE_FAILURE": {
      const pendingIds = new Set(state.pendingIds);
      pendingIds.delete(action.payload.id);
      return { pendingIds, error: action.payload.error };
    }
    default:
      return state;
  }
}
