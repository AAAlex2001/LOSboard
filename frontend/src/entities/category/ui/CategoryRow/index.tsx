import ArrowRightIcon from "@/src/shared/ui/Icons/ArrowRightIcon";
import style from "./style.module.scss";

interface CategoryRowProps {
  label: string;
  variant?: "boxed" | "plain";
  bold?: boolean;
  onClick?: () => void;
}

export const CategoryRow = ({
  label,
  variant = "boxed",
  bold = false,
  onClick,
}: CategoryRowProps) => {
  const classes = [
    style.row,
    variant === "boxed" ? style.boxed : style.plain,
    bold ? style.bold : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={classes} onClick={onClick}>
      <span className={style.label}>{label}</span>
      <span className={style.arrow}>
        <ArrowRightIcon />
      </span>
    </button>
  );
};
