import { LoginInfo } from "@/src/shared/ui/LoginInfo";
import { BackToHome } from "@/src/shared/ui/BackToHome";
import { LoginWidget } from "@/src/widgets/auth/login/LoginWidget";
import style from "./page.module.scss";

export default function LoginPage() {
  return (
    <div className={style.container}>
      <div className={style.content}>
        <LoginInfo />
        <div className={style.formColumn}>
          <LoginWidget />
          <BackToHome />
        </div>
      </div>
    </div>
  );
}
