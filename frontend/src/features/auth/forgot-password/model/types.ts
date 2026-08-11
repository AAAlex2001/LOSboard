import type { LoginResponse } from "@/src/shared/auth/auth-api";

export type ForgotStep = "email" | "code" | "password";

export interface ForgotState {
  loading: boolean;
  error: string | null;
  step: ForgotStep;
  email: string;
  code: string;
  user: LoginResponse | null;
}

export type ForgotAction =
  | { type: "START" }
  | { type: "CODE_SENT"; payload: string }
  | { type: "CODE_OK"; payload: string }
  | { type: "PASSWORD_OK"; payload: LoginResponse }
  | { type: "FAILURE"; payload: string }
  | { type: "BACK_TO_EMAIL" };
