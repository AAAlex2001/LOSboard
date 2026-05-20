import type { LoginResponse } from "@/src/shared/auth/auth-api";

export interface LoginState {
  loading: boolean;
  error: string | null;
  user: LoginResponse | null;
}

export type LoginAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: LoginResponse }
  | { type: "LOGIN_FAILURE"; payload: string };
