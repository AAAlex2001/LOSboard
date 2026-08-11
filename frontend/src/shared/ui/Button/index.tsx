import classNames from "classnames";
import style from "./style.module.scss";

type ButtonProps = {
  text?: string;
  type?: "button" | "submit" | "reset" | "link";
  variant?: "filled" | "outlined" | "ghost";
  color?: "blue" | "gray" | "green" | "delete";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  title?: string;
};

export const Button = (props: ButtonProps) => {
  const isLink = props.type === "link";
  const color = props.color ?? (isLink ? "gray" : "blue");
  const variant = props.variant ?? "filled";
  const hasColorBg = !isLink && variant !== "ghost";

  let buttonType: "button" | "submit" | "reset" = "button";
  if (props.type === "submit") buttonType = "submit";
  if (props.type === "reset") buttonType = "reset";

  return (
    <button
      className={classNames(style.button, {
        [style.link]: isLink,
        [style.linkBlue]: isLink && color === "blue",
        [style.linkGray]: isLink && color === "gray",
        [style.filled]: !isLink && variant === "filled",
        [style.outlined]: !isLink && variant === "outlined",
        [style.ghost]: !isLink && variant === "ghost",
        [style.blue]: hasColorBg && color === "blue",
        [style.green]: hasColorBg && color === "green",
        [style.gray]: hasColorBg && color === "gray",
        [style.delete]: hasColorBg && color === "delete",
        [style.fullWidth]: props.fullWidth,
      })}
      type={buttonType}
      onClick={props.onClick}
      disabled={props.disabled}
      title={props.title}
    >
      {props.text}
      {props.children}
    </button>
  );
};
