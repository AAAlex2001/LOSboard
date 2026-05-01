"use client";

import { useReducer } from "react";
import { login } from "@/src/shared/auth/auth-api";


interface LoginState {
  loading: boolean;
  error: string | null;
  user: {
    id: number;
    email: string;
    name: string;
    access_token: string;
    refresh_token: string;
  } | null;
}

type LoginAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: LoginState["user"] }
  | { type: "LOGIN_FAILURE"; payload: string };

function loginReducer(state: LoginState, action: LoginAction): LoginState {
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

export function useLogin() {
  const [state, dispatch] = useReducer(loginReducer, {
    loading: false,
    error: null,
    user: null,
  });

  const performLogin = async (email: string, password: string, onError?: (message: string) => void) => {
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