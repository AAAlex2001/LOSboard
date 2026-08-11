"use client";

import { useState } from "react";
import { Input } from "@/src/shared/ui/Input";
import { Button } from "@/src/shared/ui/Button";
import { Loader } from "@/src/shared/ui/Loader";
import style from "./NewPasswordForm.module.scss";

interface NewPasswordFormProps {
  loading: boolean;
  onSubmit: (password: string) => void;
  onError: (message: string) => void;
}

export function NewPasswordForm({ loading, onSubmit, onError }: NewPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length < 8) {
      onError("Пароль минимум 8 символов");
      return;
    }
    if (password !== confirm) {
      onError("Пароли не совпадают");
      return;
    }
    onSubmit(password);
  };

  return (
    <form className={style.card} onSubmit={handleSubmit}>
      <div className={style.heading}>
        <h1 className={style.title}>Новый пароль</h1>
        <span className={style.subtitle}>Придумайте новый пароль для входа</span>
      </div>

      <Input
        type="password"
        placeholder="Новый пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        name="password"
        minLength={8}
        maxLength={128}
      />
      <Input
        type="password"
        placeholder="Повторите пароль"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        name="confirm"
        minLength={8}
        maxLength={128}
      />

      <Button type="submit" color="blue" fullWidth disabled={loading}>
        {loading ? <Loader /> : "Сохранить пароль"}
      </Button>
    </form>
  );
}
