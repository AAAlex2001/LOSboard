"use client";

import { useReducer } from "react";
import { registerAndLogin } from "@/src/shared/auth/register-api";
import { initialRegisterState, registerReducer } from "./registerReducer";

export function useRegister() {
  const [state, dispatch] = useReducer(registerReducer, initialRegisterState);

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
