import style from "./style.module.scss";

interface UserInfoRowProps {
  label: string;
  value?: string | null;
  placeholder?: string;
  actionText: string;
  onAction?: () => void;
  noBorder?: boolean;
}

export const UserInfoRow = ({
  label,
  value,
  placeholder,
  actionText,
  onAction,
  noBorder,
}: UserInfoRowProps) => {
  return (
    <div className={`${style.row} ${noBorder ? style.noBorder : ""}`}>
      <div className={style.content}>
        <span className={style.label}>{label}</span>
        <span className={value ? style.value : style.placeholder}>
          {value || placeholder}
        </span>
      </div>
      <button type="button" className={style.action} onClick={onAction}>
        {actionText}
      </button>
    </div>
  );
};
