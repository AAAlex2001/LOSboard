"use client";

import { useReducer } from "react";
import {
  forgotPassword,
  resetPassword,
  verifyResetCode,
} from "@/src/shared/auth/password-reset-api";
import { forgotReducer, initialForgotState } from "./forgotReducer";

export function useForgotPassword() {
  const [state, dispatch] = useReducer(forgotReducer, initialForgotState);

  const sendCode = async (email: string, onError?: (message: string) => void) => {
    dispatch({ type: "START" });
    try {
      await forgotPassword(email);
      dispatch({ type: "CODE_SENT", payload: email });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      dispatch({ type: "FAILURE", payload: message });
      onError?.(message);
    }
  };

  const checkCode = async (code: string, onError?: (message: string) => void) => {
    dispatch({ type: "START" });
    try {
      await verifyResetCode(state.email, code);
      dispatch({ type: "CODE_OK", payload: code });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      dispatch({ type: "FAILURE", payload: message });
      onError?.(message);
    }
  };

  const savePassword = async (
    password: string,
    onError?: (message: string) => void
  ) => {
    dispatch({ type: "START" });
    try {
      const user = await resetPassword(state.email, state.code, password);
      dispatch({ type: "PASSWORD_OK", payload: user });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      dispatch({ type: "FAILURE", payload: message });
      onError?.(message);
    }
  };

  const resend = async (onError?: (message: string) => void) => {
    try {
      await forgotPassword(state.email);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      onError?.(message);
    }
  };

  const backToEmail = () => dispatch({ type: "BACK_TO_EMAIL" });

  return { ...state, sendCode, checkCode, savePassword, resend, backToEmail };
}
