export interface UploadAvatarState {
  uploading: boolean;
  error: string | null;
}

export type UploadAvatarAction =
  | { type: "UPLOAD_START" }
  | { type: "UPLOAD_SUCCESS" }
  | { type: "UPLOAD_FAILURE"; payload: string };
