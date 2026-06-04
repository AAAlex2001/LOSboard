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
  existingPhotoUrls: [],
  isUrgent: false,
  address: "",
  latitude: null,
  longitude: null,
  attributeValues: {},
  submitting: false,
  error: null,
};

export function placeAdReducer(
  state: PlaceAdState,
  action: PlaceAdAction
): PlaceAdState {
  switch (action.type) {
    case "SET_CATEGORY":
      return {
        ...state,
        categoryId: action.payload,
        subcategoryId: null,
        attributeValues: {},
      };
    case "SET_SUBCATEGORY":
      return { ...state, subcategoryId: action.payload, attributeValues: {} };
    case "SET_ATTRIBUTE":
      return {
        ...state,
        attributeValues: {
          ...state.attributeValues,
          [action.payload.attributeId]: action.payload.value,
        },
      };
    case "CLEAR_ATTRIBUTES":
      return { ...state, attributeValues: {} };
    case "SET_TITLE":
      return { ...state, title: action.payload.slice(0, TITLE_MAX) };
    case "SET_PRICE":
      return { ...state, price: action.payload.replace(/[^0-9]/g, "") };
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload.slice(0, DESCRIPTION_MAX) };
    case "SET_FILES":
      return { ...state, files: action.payload };
    case "SET_IS_URGENT":
      return { ...state, isUrgent: action.payload };
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
        isUrgent: action.payload.isUrgent ?? false,
        address: action.payload.address,
        existingPhotoUrls: action.payload.photoUrls ?? [],
        attributeValues: action.payload.attributeValues ?? {},
        error: null,
      };
    case "REMOVE_EXISTING_PHOTO":
      return {
        ...state,
        existingPhotoUrls: state.existingPhotoUrls.filter(
          (url) => url !== action.payload
        ),
      };
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
