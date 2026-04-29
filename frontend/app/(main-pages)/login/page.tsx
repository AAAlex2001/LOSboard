import { LoginWidget } from "@/src/widgets/login/LoginWidget";
import { LoginInfo } from "@/src/shared/ui/LoginInfo";
import style from "./page.module.scss";

export default function LoginPage() {
    return (
        <div className={style.container}>
            <LoginInfo />
            <LoginWidget />
        </div>
    );
}