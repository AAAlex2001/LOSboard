import { LoginForm } from "@/src/features/auth/login/ui/loginForm";
import style from "./LoginWidget.module.scss";

export function LoginWidget() {
    return (
        <div className={style.loginWidget}>
            <LoginForm />
        </div>
    );
}