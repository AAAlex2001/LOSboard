import classNames from "classnames";
import style from "./style.module.scss";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
}

export const Toggle = ({
  checked,
  onChange,
  title,
  description,
  disabled = false,
  className,
  name,
}: ToggleProps) => (
  <label
    className={classNames(style.toggle, className, {
      [style.disabled]: disabled,
    })}
  >
    <input
      className={style.input}
      type="checkbox"
      name={name}
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span className={style.switch} aria-hidden="true" />
    <span className={style.text}>
      <span className={style.title}>{title}</span>
      {description && <span className={style.description}>{description}</span>}
    </span>
  </label>
);
