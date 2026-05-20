"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/src/shared/ui/Input";
import { Button } from "@/src/shared/ui/Button";
import { Loader } from "@/src/shared/ui/Loader";
import Typography from "@/src/shared/ui/Typography";
import { useNotifications } from "@/src/shared/ui/Notifications";
import { useRegister } from "../model/useRegister";
import style from "./RegisterForm.module.scss";

export function RegisterForm() {
  const router = useRouter();
  const { loading, user, performRegister } = useRegister();
  const { showError } = useNotifications();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValid = name.trim().length > 0 && email.includes("@") && password.length >= 8;

  useEffect(() => {
    if (user) {
      router.push("/profile");
    }
  }, [user, router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || loading) return;
    performRegister(name.trim(), email.trim(), password, showError);
  };

  return (
    <form className={style.registerForm} onSubmit={handleSubmit}>
      <div className={style.content}>
        <div className={style.heading}>
          <Typography variant="h1">Регистрация</Typography>
          <span className={style.subtitle}>
            Создайте аккаунт LOS, чтобы размещать объявления
          </span>
        </div>

        <div className={style.inputs}>
          <Input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
            required
            minLength={1}
            maxLength={100}
          />
          <Input
            type="email"
            placeholder="Электронная почта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            required
          />
          <Input
            type="password"
            placeholder="Пароль (минимум 8 символов)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            required
            minLength={8}
            maxLength={128}
          />
        </div>

        <Button type="submit" disabled={!isValid || loading} fullWidth>
          {loading ? <Loader /> : "Зарегистрироваться"}
        </Button>
      </div>

      <div className={style.info}>
        <div className={style.loginRow}>
          <span className={style.loginText}>Уже есть профиль?</span>
          <Button type="link" onClick={() => router.push("/login")}>
            Войти
          </Button>
        </div>

        <p className={style.docs}>
          Регистрируясь, вы принимаете{" "}
          <Link href="/terms" className={style.docsLink}>
            Пользовательское соглашение
          </Link>{" "}
          и{" "}
          <Link href="/privacy" className={style.docsLink}>
            Политику конфиденциальности
          </Link>
        </p>
      </div>
    </form>
  );
}
