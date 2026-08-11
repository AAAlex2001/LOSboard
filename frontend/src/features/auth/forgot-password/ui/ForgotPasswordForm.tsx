"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/src/shared/ui/Input";
import { Button } from "@/src/shared/ui/Button";
import { Loader } from "@/src/shared/ui/Loader";
import Typography from "@/src/shared/ui/Typography";
import { useNotifications } from "@/src/shared/ui/Notifications";
import { CodeVerificationCard } from "@/src/shared/ui/CodeVerificationCard";
import { useForgotPassword } from "../model/useForgotPassword";
import { NewPasswordForm } from "./NewPasswordForm";
import style from "./ForgotPasswordForm.module.scss";

export function ForgotPasswordForm() {
  const router = useRouter();
  const { showError } = useNotifications();
  const {
    loading,
    step,
    email: sentEmail,
    user,
    sendCode,
    checkCode,
    savePassword,
    resend,
    backToEmail,
  } = useForgotPassword();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) router.push("/profile");
  }, [user, router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.includes("@") || loading) return;
    sendCode(email.trim(), showError);
  };

  if (step === "code") {
    return (
      <CodeVerificationCard
        title="Восстановление пароля"
        subtitle="Введите код из письма"
        email={sentEmail}
        loading={loading}
        onSubmit={(code) => checkCode(code, showError)}
        onResend={() => resend(showError)}
        onBack={backToEmail}
      />
    );
  }

  if (step === "password") {
    return (
      <NewPasswordForm
        loading={loading}
        onSubmit={(password) => savePassword(password, showError)}
        onError={showError}
      />
    );
  }

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <div className={style.content}>
        <div className={style.heading}>
          <Typography variant="h1">Забыли пароль?</Typography>
          <span className={style.subtitle}>
            Введите электронную почту для восстановления доступа
          </span>
        </div>

        <div className={style.inputs}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Электронная почта"
            name="email"
            required
          />
        </div>

        <div className={style.actions}>
          <Button
            type="submit"
            color="blue"
            disabled={!email.includes("@") || loading}
            fullWidth
          >
            {loading ? <Loader /> : "Отправить"}
          </Button>
          <Button type="link" onClick={() => router.push("/login")}>
            Вернуться ко входу
          </Button>
        </div>
      </div>
    </form>
  );
}
