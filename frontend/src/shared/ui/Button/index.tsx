import classNames from "classnames";
import style from "./style.module.scss";

type ButtonProps = {
  text?: string;
  type?: "button" | "submit" | "reset" | "link";
  variant?: "filled" | "outlined";
  color?: "blue" | "gray" | "green" | "delete";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
};

export const Button = (props: ButtonProps) => {
  const isLink = props.type === "link";
  const color = props.color ?? (isLink ? "gray" : "blue");
  const variant = props.variant ?? "filled";

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
        [style.blue]: !isLink && color === "blue",
        [style.green]: !isLink && color === "green",
        [style.gray]: !isLink && color === "gray",
        [style.delete]: !isLink && color === "delete",
        [style.fullWidth]: props.fullWidth,
      })}
      type={buttonType}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.text}
      {props.children}
    </button>
  );
};
