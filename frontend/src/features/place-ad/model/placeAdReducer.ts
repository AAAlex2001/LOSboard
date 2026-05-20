import type { PlaceAdAction, PlaceAdState } from "./types";

export const TITLE_MAX = 50;
export const DESCRIPTION_MAX = 1000;

export const initialPlaceAdState: PlaceAdState = {
  categoryId: null,
  subcategoryId: null,
  title: "",
  price: "",
  description: "",
  files: [],
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
