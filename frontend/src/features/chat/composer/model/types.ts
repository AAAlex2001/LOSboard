export interface PendingFile {
  id: string;
  file: File;
  previewUrl?: string;
}

export interface ChatComposerState {
  draft: string;
  files: PendingFile[];
  uploading: boolean;
  error: string | null;
}

export type ChatComposerAction =
  | { type: "SET_DRAFT"; payload: string }
  | { type: "ADD_FILES"; payload: PendingFile[] }
  | { type: "REMOVE_FILE"; payload: string }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "UPLOAD_START" }
  | { type: "UPLOAD_END" }
  | { type: "RESET" };
