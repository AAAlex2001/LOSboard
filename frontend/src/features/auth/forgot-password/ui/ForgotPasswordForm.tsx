"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/src/shared/ui/Input";
import { Button } from "@/src/shared/ui/Button";
import Typography from "@/src/shared/ui/Typography";
import style from "./ForgotPasswordForm.module.scss";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <form
      className={style.form}
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
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
          <Button type="submit" disabled fullWidth>
            Отправить
          </Button>
          <Button type="link" onClick={() => router.push("/login")}>
            Вернуться ко входу
          </Button>
        </div>
      </div>
    </form>
  );
}
