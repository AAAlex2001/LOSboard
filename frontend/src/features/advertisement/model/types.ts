import type { Advertisement } from "@/src/entities/advertisement";

export interface AdvertisementListState {
  categoryId: number | null;
  subcategoryId: number | null;
  urgentOnly: boolean;
  items: Advertisement[];
  skip: number;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
}

export interface AdvertisementFilters {
  categoryId: number | null;
  subcategoryId: number | null;
  urgentOnly: boolean;
}

export interface AdvertisementPage {
  items: Advertisement[];
  hasMore: boolean;
}

export type AdvertisementListAction =
  | { type: "SET_FILTERS"; payload: AdvertisementFilters }
  | { type: "RESET_FILTER" }
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: AdvertisementPage }
  | { type: "FETCH_FAILURE"; payload: string }
  | { type: "LOAD_MORE_START" }
  | { type: "LOAD_MORE_FAILURE"; payload: string }
  | { type: "APPEND_ITEMS"; payload: AdvertisementPage }
  | { type: "PATCH_ITEM"; payload: Advertisement };
