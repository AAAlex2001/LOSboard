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
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Input = (props: InputProps) => {
    return (
        <input
            className={style.input}
            type={props.type}
            placeholder={props.placeholder}
            value={props.value}
            name={props.name}
            required={props.required}
            minLength={props.minLength}
            maxLength={props.maxLength}
            pattern={props.pattern}
            onChange={props.onChange}
        />
    );
};
