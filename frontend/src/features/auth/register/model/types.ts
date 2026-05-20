import type { LoginResponse } from "@/src/shared/auth/auth-api";

export interface RegisterState {
  loading: boolean;
  error: string | null;
  user: LoginResponse | null;
}

export type RegisterAction =
  | { type: "REGISTER_START" }
  | { type: "REGISTER_SUCCESS"; payload: LoginResponse }
  | { type: "REGISTER_FAILURE"; payload: string };
