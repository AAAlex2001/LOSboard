import type { LoginResponse } from "@/src/shared/auth/auth-api";

export type RegisterStep = "form" | "verify";

export interface RegisterState {
  loading: boolean;
  error: string | null;
  step: RegisterStep;
  email: string;
  user: LoginResponse | null;
}

export type RegisterAction =
  | { type: "REGISTER_START" }
  | { type: "CODE_SENT"; payload: string }
  | { type: "REGISTER_FAILURE"; payload: string }
  | { type: "BACK_TO_FORM" }
  | { type: "VERIFY_START" }
  | { type: "VERIFY_SUCCESS"; payload: LoginResponse }
  | { type: "VERIFY_FAILURE"; payload: string };
