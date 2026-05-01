import classNames from "classnames";
import style from "./style.module.scss";

type ButtonProps = {
  text?: string;
  type?: "button" | "submit" | "reset" | "link";
  color?: "blue" | "gray";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  disabled?: boolean;
};

export const Button = (props: ButtonProps) => {
  const isLink = props.type === "link";
  const color = props.color ?? "gray";

  let buttonType: "button" | "submit" | "reset" = "button";

    if (props.type === "submit") {
    buttonType = "submit";
    }

    if (props.type === "reset") {
    buttonType = "reset";
    }

  return (
    <button
      className={classNames(style.button, {
        [style.link]: isLink,
        [style.linkBlue]: isLink && color === "blue",
        [style.linkGray]: isLink && color === "gray",
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