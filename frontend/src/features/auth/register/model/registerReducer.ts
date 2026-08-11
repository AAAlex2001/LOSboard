import type { RegisterAction, RegisterState } from "./types";

export const initialRegisterState: RegisterState = {
  loading: false,
  error: null,
  step: "form",
  email: "",
  user: null,
};

export function registerReducer(
  state: RegisterState,
  action: RegisterAction
): RegisterState {
  switch (action.type) {
    case "REGISTER_START":
      return { ...state, loading: true, error: null };
    case "CODE_SENT":
      return { ...state, loading: false, step: "verify", email: action.payload };
    case "REGISTER_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "BACK_TO_FORM":
      return { ...state, step: "form", error: null };
    case "VERIFY_START":
      return { ...state, loading: true, error: null };
    case "VERIFY_SUCCESS":
      return { ...state, loading: false, user: action.payload };
    case "VERIFY_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
