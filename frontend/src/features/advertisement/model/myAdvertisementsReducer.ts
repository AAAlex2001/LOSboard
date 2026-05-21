import type { Advertisement } from "@/src/entities/advertisement";

export interface MyAdvertisementsState {
  items: Advertisement[];
  loading: boolean;
  error: string | null;
}

export type MyAdvertisementsAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Advertisement[] }
  | { type: "FETCH_FAILURE"; payload: string };

export const initialMyAdvertisementsState: MyAdvertisementsState = {
  items: [],
  loading: true,
  error: null,
};

export function myAdvertisementsReducer(
  state: MyAdvertisementsState,
  action: MyAdvertisementsAction
): MyAdvertisementsState {
  switch (action.type) {
    case "FETCH_START":
      return { items: [], loading: true, error: null };
    case "FETCH_SUCCESS":
      return { items: action.payload, loading: false, error: null };
    case "FETCH_FAILURE":
      return { items: [], loading: false, error: action.payload };
    default:
      return state;
  }
}
