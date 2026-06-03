import style from "./style.module.scss";

type TextareaProps = {
  value?: string;
  placeholder?: string;
  name?: string;
  rows?: number;
  maxLength?: number;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  variant?: "default" | "filled" | "form";
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export const Textarea = (props: TextareaProps) => {
  const variantClass =
    props.variant === "filled"
      ? style.filled
      : props.variant === "form"
      ? style.form
      : style.default;
  const className = `${style.textarea} ${variantClass} ${props.className || ""}`.trim();

  return (
    <textarea
      className={className}
      value={props.value}
      placeholder={props.placeholder}
      name={props.name}
      rows={props.rows ?? 4}
      maxLength={props.maxLength}
      disabled={props.disabled}
      required={props.required}
      autoFocus={props.autoFocus}
      onChange={props.onChange}
    />
  );
};
