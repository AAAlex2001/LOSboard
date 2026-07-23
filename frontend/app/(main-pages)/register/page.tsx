import { BackToHome } from "@/src/shared/ui/BackToHome";
import { RegisterWidget } from "@/src/widgets/auth/register/RegisterWidget";
import style from "./page.module.scss";

export default function RegisterPage() {
  return (
    <div className={style.container}>
      <div className={style.formColumn}>
        <RegisterWidget />
        <BackToHome />
      </div>
    </div>
  );
}
