import type { RegisterAction, RegisterState } from "./types";

export const initialRegisterState: RegisterState = {
  loading: false,
  error: null,
  user: null,
};

export function registerReducer(
  state: RegisterState,
  action: RegisterAction
): RegisterState {
  switch (action.type) {
    case "REGISTER_START":
      return { ...state, loading: true, error: null };
    case "REGISTER_SUCCESS":
      return { ...state, loading: false, user: action.payload };
    case "REGISTER_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
