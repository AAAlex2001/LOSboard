import { BackToHome } from "@/src/shared/ui/BackToHome";
import { ForgotPasswordForm } from "@/src/features/auth/forgot-password/ui/ForgotPasswordForm";
import style from "./page.module.scss";

export default function ForgotPasswordPage() {
  return (
    <div className={style.container}>
      <div className={style.formColumn}>
        <ForgotPasswordForm />
        <BackToHome />
      </div>
    </div>
  );
}
