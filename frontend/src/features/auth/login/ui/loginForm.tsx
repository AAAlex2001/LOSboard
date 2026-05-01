"use client";

import { Input } from "@/src/shared/ui/Input";
import { Button } from "@/src/shared/ui/Button";
import { useLogin } from "../model/useLogin";
import { useState } from "react";
import { Loader } from "@/src/shared/ui/Loader";
import Typography from "@/src/shared/ui/Typography";
import { useNotifications } from "@/src/shared/ui/Notifications";
import style from "./LoginForm.module.scss";


export function LoginForm() {
  const { loading, performLogin } = useLogin();
  const { showError } = useNotifications();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
          <Button type="link" onClick={() => window.location.href = "/register"}>
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
            <Button type="link" onClick={() => window.location.href = "/register"}>
              Зарегистрироваться
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}