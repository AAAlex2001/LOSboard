export interface PlaceAdState {
  categoryId: number | null;
  subcategoryId: number | null;
  title: string;
  price: string;
  description: string;
  files: File[];
  address: string;
  latitude: number | null;
  longitude: number | null;
  submitting: boolean;
  error: string | null;
}

export type PlaceAdAction =
  | { type: "SET_CATEGORY"; payload: number | null }
  | { type: "SET_SUBCATEGORY"; payload: number | null }
  | { type: "SET_TITLE"; payload: string }
  | { type: "SET_PRICE"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "SET_FILES"; payload: File[] }
  | { type: "SET_ADDRESS"; payload: string }
  | { type: "SET_LOCATION"; payload: { address: string; latitude: number; longitude: number } }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_FAILURE"; payload: string }
  | { type: "RESET" };
