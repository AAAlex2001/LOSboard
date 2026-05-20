export type EditableField = "name" | "email" | "phone_number";

export interface EditProfileFieldState {
  activeField: EditableField | null;
  loading: boolean;
  error: string | null;
}

export type EditProfileFieldAction =
  | { type: "OPEN"; payload: EditableField }
  | { type: "CLOSE" }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_FAILURE"; payload: string };

export interface FieldConfig {
  titleEdit: string;
  titleAdd: string;
  subtitle: string;
  placeholder: string;
  inputType: "text" | "email" | "tel";
}
