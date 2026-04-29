import { LoginWidget } from "@/src/widgets/login/LoginWidget";
import style from "./page.module.scss";

export default function LoginPage() {
    return (
        <div className={style.container}>
            <LoginWidget />
        </div>
    );
}