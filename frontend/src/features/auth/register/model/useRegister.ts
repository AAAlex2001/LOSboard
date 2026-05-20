"use client";

import { useReducer } from "react";
import { registerAndLogin } from "@/src/shared/auth/register-api";
import type { LoginResponse } from "@/src/shared/auth/auth-api";

interface RegisterState {
  loading: boolean;
  error: string | null;
  user: LoginResponse | null;
}

type RegisterAction =
  | { type: "REGISTER_START" }
  | { type: "REGISTER_SUCCESS"; payload: LoginResponse }
  | { type: "REGISTER_FAILURE"; payload: string };

function registerReducer(state: RegisterState, action: RegisterAction): RegisterState {
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

export function useRegister() {
  const [state, dispatch] = useReducer(registerReducer, {
    loading: false,
    error: null,
    user: null,
  });

  const performRegister = async (
    name: string,
    email: string,
    password: string,
    onError?: (message: string) => void
  ) => {
    dispatch({ type: "REGISTER_START" });
    try {
      const user = await registerAndLogin(name, email, password);
      dispatch({ type: "REGISTER_SUCCESS", payload: user });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      dispatch({ type: "REGISTER_FAILURE", payload: message });
      onError?.(message);
    }
  };

  return { ...state, performRegister };
}
