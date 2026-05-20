import style from "./style.module.scss";

type InputProps = {
    type?: string;
    placeholder?: string;
    value?: string;
    name?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    variant?: "default" | "filled" | "form";
    className?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Input = (props: InputProps) => {
    const variantClass =
        props.variant === "filled" ? style.filled :
        props.variant === "form" ? style.form :
        style.default;
    const className = `${style.input} ${variantClass} ${props.className || ""}`.trim();

    return (
        <input
            className={className}
            type={props.type}
            placeholder={props.placeholder}
            value={props.value}
            name={props.name}
            required={props.required}
            minLength={props.minLength}
            maxLength={props.maxLength}
            pattern={props.pattern}
            autoFocus={props.autoFocus}
            disabled={props.disabled}
            onChange={props.onChange}
        />
    );
};
