"use client";

import { useState } from "react";
import { Modal } from "@/src/shared/ui/Modal";
import { Input } from "@/src/shared/ui/Input";
import style from "./style.module.scss";

interface EditFieldModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void | Promise<void>;
  title: string;
  subtitle: string;
  placeholder?: string;
  initialValue?: string;
  inputType?: "text" | "email" | "tel" | "password";
  cancelText?: string;
  submitText?: string;
  loading?: boolean;
  formatValue?: (raw: string) => string;
  prepareSubmit?: (value: string) => string;
  validate?: (value: string) => boolean;
}

type EditFieldFormProps = Omit<EditFieldModalProps, "open">;

export const EditFieldModal = ({ open, ...rest }: EditFieldModalProps) => {
  return (
    <Modal open={open} onClose={rest.onClose}>
      <EditFieldForm key={rest.initialValue ?? ""} {...rest} />
    </Modal>
  );
};

/** Выделено в отдельный компонент: модалка размонтируется при закрытии, поэтому ленивая инициализация value заменяет сброс через эффект. */
const EditFieldForm = ({
  onClose,
  onSubmit,
  title,
  subtitle,
  placeholder = "",
  initialValue = "",
  inputType = "text",
  cancelText = "Отмена",
  submitText = "Сохранить",
  loading = false,
  formatValue,
  prepareSubmit,
  validate,
}: EditFieldFormProps) => {
  const [value, setValue] = useState(() =>
    formatValue ? formatValue(initialValue) : initialValue
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = formatValue ? formatValue(e.target.value) : e.target.value;
    setValue(next);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    const prepared = prepareSubmit ? prepareSubmit(value) : value.trim();
    if (validate && !validate(prepared)) return;
    if (!prepared) return;
    onSubmit(prepared);
  };

  const isInvalid = validate
    ? !validate(prepareSubmit ? prepareSubmit(value) : value.trim())
    : false;

  return (
    <form className={style.card} onSubmit={handleSubmit}>
      <div className={style.body}>
        <h2 className={style.title}>{title}</h2>
        <p className={style.subtitle}>{subtitle}</p>

        <Input
          variant="filled"
          type={inputType}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          autoFocus
        />

        <div className={style.buttons}>
          <button
            type="button"
            className={style.cancel}
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="submit"
            className={style.submit}
            disabled={loading || isInvalid}
          >
            {submitText}
          </button>
        </div>
      </div>
    </form>
  );
};
