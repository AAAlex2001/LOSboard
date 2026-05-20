import type { LoginAction, LoginState } from "./types";

export const initialLoginState: LoginState = {
  loading: false,
  error: null,
  user: null,
};

export function loginReducer(state: LoginState, action: LoginAction): LoginState {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return { ...state, loading: false, user: action.payload };
    case "LOGIN_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
