"use client";

import { useReducer } from "react";
import { updateAccount, type User } from "@/src/entities/user";
import {
  editProfileFieldReducer,
  initialEditProfileFieldState,
  FIELD_CONFIG,
} from "./editProfileFieldReducer";
import type { EditableField } from "./types";

interface UseEditProfileFieldParams {
  user: User;
  onUpdated?: (user: User) => void;
}

export function useEditProfileField({ user, onUpdated }: UseEditProfileFieldParams) {
  const [state, dispatch] = useReducer(
    editProfileFieldReducer,
    initialEditProfileFieldState
  );

  const open = (field: EditableField) => dispatch({ type: "OPEN", payload: field });
  const close = () => dispatch({ type: "CLOSE" });

  const submit = async (value: string) => {
    if (!state.activeField || state.loading) return;
    const trimmed = value.trim();
    if (!trimmed) return;

    dispatch({ type: "SUBMIT_START" });
    try {
      const updated = await updateAccount({ [state.activeField]: trimmed });
      onUpdated?.(updated);
      dispatch({ type: "SUBMIT_SUCCESS" });
    } catch (err) {
      dispatch({
        type: "SUBMIT_FAILURE",
        payload: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const config = state.activeField ? FIELD_CONFIG[state.activeField] : null;
  const isAdding = state.activeField === "phone_number" && !user.phone_number;
  const modalTitle = config
    ? isAdding
      ? config.titleAdd
      : config.titleEdit
    : "";
  const currentValue = state.activeField ? user[state.activeField] ?? "" : "";

  return {
    state,
    open,
    close,
    submit,
    config,
    modalTitle,
    isAdding,
    currentValue: String(currentValue),
  };
}
