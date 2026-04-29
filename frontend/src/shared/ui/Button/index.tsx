import style from "./style.module.scss";

type ButtonProps = {
    text?: string;
    type?: "button" | "submit" | "reset";
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    children?: React.ReactNode;
    disabled?: boolean;
};

export const Button = (props: ButtonProps) => {
    return (
        <button
            className={style.button}
            type={props.type}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.text}
            {props.children}
        </button>
    );
};
