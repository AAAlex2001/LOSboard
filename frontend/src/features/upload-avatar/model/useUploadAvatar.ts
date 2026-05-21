"use client";

import { useReducer } from "react";
import { uploadAvatar, useMeContext } from "@/src/entities/user";
import {
  initialUploadAvatarState,
  uploadAvatarReducer,
} from "./uploadAvatarReducer";

export function useUploadAvatar() {
  const { user, setUser } = useMeContext();
  const [state, dispatch] = useReducer(
    uploadAvatarReducer,
    initialUploadAvatarState
  );

  const upload = async (file: File) => {
    if (state.uploading) return;
    dispatch({ type: "UPLOAD_START" });
    try {
      const { avatar_url } = await uploadAvatar(file);
      if (user) setUser({ ...user, avatar_url });
      dispatch({ type: "UPLOAD_SUCCESS" });
    } catch (err: unknown) {
      dispatch({
        type: "UPLOAD_FAILURE",
        payload: err instanceof Error ? err.message : String(err),
      });
    }
  };

  return { state, upload };
}
