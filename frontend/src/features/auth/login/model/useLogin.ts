"use client";

import { useReducer } from "react";
import { login } from "@/src/shared/auth/auth-api";
import { initialLoginState, loginReducer } from "./loginReducer";

export function useLogin() {
  const [state, dispatch] = useReducer(loginReducer, initialLoginState);

  const performLogin = async (
    email: string,
    password: string,
    onError?: (message: string) => void
  ) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const user = await login(email, password);
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      dispatch({ type: "LOGIN_FAILURE", payload: message });
      onError?.(message);
    }
  };

  return { ...state, performLogin };
}
