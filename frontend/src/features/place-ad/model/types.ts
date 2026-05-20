export type PlaceAdStep = 1 | 2;

export interface PlaceAdState {
  step: PlaceAdStep;
  categoryId: number | null;
  subcategoryId: number | null;
  title: string;
  price: string;
  description: string;
  files: File[];
  existingPhotoUrl: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  submitting: boolean;
  error: string | null;
}

export interface PrefillPayload {
  categoryId: number | null;
  subcategoryId: number | null;
  title: string;
  price: string;
  description: string;
  address: string;
  photoUrl?: string | null;
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
  | { type: "PREFILL"; payload: PrefillPayload }
  | { type: "CLEAR_EXISTING_PHOTO" }
  | { type: "GO_TO_PREVIEW" }
  | { type: "GO_TO_EDIT" }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_FAILURE"; payload: string }
  | { type: "RESET" };
