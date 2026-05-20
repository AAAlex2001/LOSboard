"use client";

import { EditFieldModal } from "@/src/shared/ui/EditFieldModal";
import { cleanPhone, formatPhone, isValidPhone } from "@/src/shared/lib/phone";
import { useEditProfileField } from "../model/useEditProfileField";
import type { User } from "@/src/entities/user";

interface EditProfileFieldModalProps {
  user: User;
  onUpdated?: (user: User) => void;
  controller?: ReturnType<typeof useEditProfileField>;
}

export const EditProfileFieldModal = ({
  controller,
  user,
  onUpdated,
}: EditProfileFieldModalProps) => {
  const local = useEditProfileField({ user, onUpdated });
  const ctrl = controller ?? local;
  const { state, close, submit, config, modalTitle, isAdding, currentValue } = ctrl;

  if (!config) return null;

  const isPhone = state.activeField === "phone_number";

  return (
    <EditFieldModal
      open={state.activeField !== null}
      onClose={close}
      onSubmit={submit}
      title={modalTitle}
      subtitle={config.subtitle}
      placeholder={config.placeholder}
      inputType={config.inputType}
      initialValue={currentValue}
      loading={state.loading}
      submitText={isAdding ? "Добавить" : "Сохранить"}
      formatValue={isPhone ? formatPhone : undefined}
      prepareSubmit={isPhone ? cleanPhone : undefined}
      validate={isPhone ? isValidPhone : undefined}
    />
  );
};
