import type { Advertisement } from "@/src/entities/advertisement";

export interface AdvertisementListState {
  categoryId: number | null;
  subcategoryId: number | null;
  items: Advertisement[];
  loading: boolean;
  error: string | null;
}

export type AdvertisementListAction =
  | { type: "SET_CATEGORY"; payload: number | null }
  | { type: "SET_SUBCATEGORY"; payload: number | null }
  | { type: "RESET_FILTER" }
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Advertisement[] }
  | { type: "FETCH_FAILURE"; payload: string }
  | { type: "PATCH_ITEM"; payload: Advertisement };
