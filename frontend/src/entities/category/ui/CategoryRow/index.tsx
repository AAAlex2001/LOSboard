import ArrowRightIcon from "@/src/shared/ui/Icons/ArrowRightIcon";
import style from "./style.module.scss";

interface CategoryRowProps {
  label: string;
  variant?: "boxed" | "plain";
  bold?: boolean;
  urgent?: boolean;
  showArrow?: boolean;
  onClick?: () => void;
}

export const CategoryRow = ({
  label,
  variant = "boxed",
  bold = false,
  urgent = false,
  showArrow = true,
  onClick,
}: CategoryRowProps) => {
  const classes = [
    style.row,
    variant === "boxed" ? style.boxed : style.plain,
    bold ? style.bold : "",
    urgent ? style.urgent : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={classes} onClick={onClick}>
      <span className={style.label}>{label}</span>
      {showArrow && (
        <span className={style.arrow}>
          <ArrowRightIcon />
        </span>
      )}
    </button>
  );
};
