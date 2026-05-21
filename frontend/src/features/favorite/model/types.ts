import type { Advertisement } from "@/src/entities/advertisement";

export interface FavoritesState {
  items: Advertisement[];
  loading: boolean;
  error: string | null;
}

export type FavoritesAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Advertisement[] }
  | { type: "FETCH_FAILURE"; payload: string }
  | { type: "PATCH_ITEM"; payload: Advertisement };

export interface FavoriteToggleState {
  pendingIds: Set<number>;
  error: string | null;
}

export type FavoriteToggleAction =
  | { type: "TOGGLE_START"; payload: number }
  | { type: "TOGGLE_END"; payload: number }
  | { type: "TOGGLE_FAILURE"; payload: { id: number; error: string } };
