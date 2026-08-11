import type { ForgotAction, ForgotState } from "./types";

export const initialForgotState: ForgotState = {
  loading: false,
  error: null,
  step: "email",
  email: "",
  code: "",
  user: null,
};

export function forgotReducer(
  state: ForgotState,
  action: ForgotAction
): ForgotState {
  switch (action.type) {
    case "START":
      return { ...state, loading: true, error: null };
    case "CODE_SENT":
      return { ...state, loading: false, step: "code", email: action.payload };
    case "CODE_OK":
      return { ...state, loading: false, step: "password", code: action.payload };
    case "PASSWORD_OK":
      return { ...state, loading: false, user: action.payload };
    case "FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "BACK_TO_EMAIL":
      return { ...state, step: "email", error: null };
    default:
      return state;
  }
}
