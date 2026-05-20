import type {
  EditProfileFieldAction,
  EditProfileFieldState,
  FieldConfig,
  EditableField,
} from "./types";

export const initialEditProfileFieldState: EditProfileFieldState = {
  activeField: null,
  loading: false,
  error: null,
};

export const FIELD_CONFIG: Record<EditableField, FieldConfig> = {
  name: {
    titleEdit: "Изменить имя",
    titleAdd: "Изменить имя",
    subtitle: "Отображается в профиле",
    placeholder: "Имя",
    inputType: "text",
  },
  email: {
    titleEdit: "Изменить почту",
    titleAdd: "Изменить почту",
    subtitle: "Отправим код для подтверждения",
    placeholder: "Электронная почта",
    inputType: "email",
  },
  phone_number: {
    titleEdit: "Изменить номер телефона",
    titleAdd: "Добавить номер телефона",
    subtitle: "Для связи с продавцом/покупателем",
    placeholder: "Номер телефона",
    inputType: "tel",
  },
};

export function editProfileFieldReducer(
  state: EditProfileFieldState,
  action: EditProfileFieldAction
): EditProfileFieldState {
  switch (action.type) {
    case "OPEN":
      return { activeField: action.payload, loading: false, error: null };
    case "CLOSE":
      return state.loading ? state : initialEditProfileFieldState;
    case "SUBMIT_START":
      return { ...state, loading: true, error: null };
    case "SUBMIT_SUCCESS":
      return initialEditProfileFieldState;
    case "SUBMIT_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
