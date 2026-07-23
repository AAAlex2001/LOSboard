"use client";

import Link from "next/link";
import { Input } from "@/src/shared/ui/Input";
import { Button } from "@/src/shared/ui/Button";
import { useLogin } from "../model/useLogin";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@/src/shared/ui/Loader";
import Typography from "@/src/shared/ui/Typography";
import { useNotifications } from "@/src/shared/ui/Notifications";
import style from "./LoginForm.module.scss";


export function LoginForm() {
  const router = useRouter();
  const { loading, user, performLogin } = useLogin();
  const { showError } = useNotifications();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/profile");
    }
  }, [user, router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    performLogin(email, password, showError);
  };

  return (
    <form className={style.loginForm} onSubmit={handleSubmit}>
      <div className={style.loginContent}>
        <Typography variant="h1">Вход</Typography>
        <div className={style.inputs}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Электронная почта"
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
          />
          <Button type="link" onClick={() => router.push("/forgot-password")}>
            Забыли пароль?
          </Button>
        </div>
        <div className={style.bottom}>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader /> : "Войти"}
          </Button>
          <div className={style.registerContainer}>
            <span className={style.registerText}>
              Нет аккаунта LOS?
            </span>
            <Button type="link" onClick={() => router.push("/register")}>
              Зарегистрироваться
            </Button>
          </div>
          <p className={style.docs}>
            Продолжая, вы принимаете{" "}
            <Link href="/docs/agreement" className={style.docsLink}>
              Пользовательское соглашение
            </Link>{" "}
            и{" "}
            <Link href="/docs/privacy" className={style.docsLink}>
              Политику конфиденциальности
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
}