import type { PlaceAdAction, PlaceAdState } from "./types";

export const TITLE_MAX = 50;
export const DESCRIPTION_MAX = 1000;

export const initialPlaceAdState: PlaceAdState = {
  step: 1,
  categoryId: null,
  subcategoryId: null,
  title: "",
  price: "",
  description: "",
  files: [],
  existingPhotoUrl: null,
  address: "",
  latitude: null,
  longitude: null,
  submitting: false,
  error: null,
};

export function placeAdReducer(
  state: PlaceAdState,
  action: PlaceAdAction
): PlaceAdState {
  switch (action.type) {
    case "SET_CATEGORY":
      return { ...state, categoryId: action.payload, subcategoryId: null };
    case "SET_SUBCATEGORY":
      return { ...state, subcategoryId: action.payload };
    case "SET_TITLE":
      return { ...state, title: action.payload.slice(0, TITLE_MAX) };
    case "SET_PRICE":
      return { ...state, price: action.payload.replace(/[^0-9]/g, "") };
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload.slice(0, DESCRIPTION_MAX) };
    case "SET_FILES":
      return { ...state, files: action.payload };
    case "SET_ADDRESS":
      return { ...state, address: action.payload };
    case "SET_LOCATION":
      return {
        ...state,
        address: action.payload.address,
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
      };
    case "PREFILL":
      return {
        ...state,
        categoryId: action.payload.categoryId,
        subcategoryId: action.payload.subcategoryId,
        title: action.payload.title.slice(0, TITLE_MAX),
        price: action.payload.price.replace(/[^0-9]/g, ""),
        description: action.payload.description.slice(0, DESCRIPTION_MAX),
        address: action.payload.address,
        existingPhotoUrl: action.payload.photoUrl ?? null,
        error: null,
      };
    case "CLEAR_EXISTING_PHOTO":
      return { ...state, existingPhotoUrl: null };
    case "GO_TO_PREVIEW":
      return { ...state, step: 2, error: null };
    case "GO_TO_EDIT":
      return { ...state, step: 1, error: null };
    case "SUBMIT_START":
      return { ...state, submitting: true, error: null };
    case "SUBMIT_SUCCESS":
      return { ...state, submitting: false, error: null };
    case "SUBMIT_FAILURE":
      return { ...state, submitting: false, error: action.payload };
    case "RESET":
      return initialPlaceAdState;
    default:
      return state;
  }
}
