import type { Metadata } from "next";
import { BackToHome } from "@/src/shared/ui/BackToHome";
import { ForgotPasswordForm } from "@/src/features/auth/forgot-password/ui/ForgotPasswordForm";
import style from "./page.module.scss";

export const metadata: Metadata = {
  title: "Забыли пароль?",
  robots: { index: false, follow: false },
};

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
