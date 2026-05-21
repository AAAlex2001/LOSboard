import type { Advertisement } from "@/src/entities/advertisement";

export interface SearchAdvertisementState {
  query: string;
  suggestions: Advertisement[];
  loading: boolean;
  error: string | null;
  open: boolean;
}

export type SearchAdvertisementAction =
  | { type: "SET_QUERY"; payload: string }
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Advertisement[] }
  | { type: "FETCH_FAILURE"; payload: string }
  | { type: "RESET" };
