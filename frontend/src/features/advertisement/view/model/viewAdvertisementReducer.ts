import type {
  ViewAdvertisementAction,
  ViewAdvertisementState,
} from "./types";

export const createInitialViewState = (
  initialViewsCount = 0,
  initialIsViewed = false
): ViewAdvertisementState => ({
  is_viewed: initialIsViewed,
  views_count: initialViewsCount,
  error: null,
});

export function viewAdvertisementReducer(
  state: ViewAdvertisementState,
  action: ViewAdvertisementAction
): ViewAdvertisementState {
  switch (action.type) {
    case "VIEW_REGISTERED":
      return {
        is_viewed: action.payload.is_viewed,
        views_count: action.payload.views_count,
        error: null,
      };
    case "FAILURE":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
