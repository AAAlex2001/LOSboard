import type { Advertisement } from "@/src/entities/advertisement";

export interface AdvertisementListState {
  categoryId: number | null;
  subcategoryId: number | null;
  urgentOnly: boolean;
  items: Advertisement[];
  loading: boolean;
  error: string | null;
}

export interface AdvertisementFilters {
  categoryId: number | null;
  subcategoryId: number | null;
  urgentOnly: boolean;
}

export type AdvertisementListAction =
  | { type: "SET_FILTERS"; payload: AdvertisementFilters }
  | { type: "RESET_FILTER" }
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Advertisement[] }
  | { type: "FETCH_FAILURE"; payload: string }
  | { type: "PATCH_ITEM"; payload: Advertisement };
