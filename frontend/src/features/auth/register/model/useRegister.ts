"use client";

import { useReducer } from "react";
import {
  createAccount,
  resendCode,
  verifyEmail,
} from "@/src/shared/auth/register-api";
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
      const account = await createAccount(name, email, password);
      dispatch({ type: "CODE_SENT", payload: account.email });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      dispatch({ type: "REGISTER_FAILURE", payload: message });
      onError?.(message);
    }
  };

  const performVerify = async (
    code: string,
    onError?: (message: string) => void
  ) => {
    dispatch({ type: "VERIFY_START" });
    try {
      const user = await verifyEmail(state.email, code);
      dispatch({ type: "VERIFY_SUCCESS", payload: user });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      dispatch({ type: "VERIFY_FAILURE", payload: message });
      onError?.(message);
    }
  };

  const performResend = async (
    onError?: (message: string) => void
  ): Promise<boolean> => {
    try {
      await resendCode(state.email);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      onError?.(message);
      return false;
    }
  };

  const backToForm = () => dispatch({ type: "BACK_TO_FORM" });

  return { ...state, performRegister, performVerify, performResend, backToForm };
}
