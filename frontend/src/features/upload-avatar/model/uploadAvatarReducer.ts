import type { UploadAvatarAction, UploadAvatarState } from "./types";

export const initialUploadAvatarState: UploadAvatarState = {
  uploading: false,
  error: null,
};

export function uploadAvatarReducer(
  state: UploadAvatarState,
  action: UploadAvatarAction
): UploadAvatarState {
  switch (action.type) {
    case "UPLOAD_START":
      return { uploading: true, error: null };
    case "UPLOAD_SUCCESS":
      return { uploading: false, error: null };
    case "UPLOAD_FAILURE":
      return { uploading: false, error: action.payload };
    default:
      return state;
  }
}
