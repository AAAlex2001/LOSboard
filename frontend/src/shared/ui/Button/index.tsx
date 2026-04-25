import style from "./style.module.scss";

type ButtonProps = {
    text: string;
    type?: "button" | "submit" | "reset";
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    children?: React.ReactNode;
};

export const Button = (props: ButtonProps) => {
    return (
        <button
            className={style.button}
            type={props.type}
            onClick={props.onClick}
        >
            {props.text}
            {props.children}
        </button>
    );
};
