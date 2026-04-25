"use client";

import { FormEvent, useState } from "react";
import styles from "./page.module.scss";

import { Button } from "@/src/shared/ui/Button";
import { Input } from "@/src/shared/ui/Input";

type LoginForm = {
  email: string;
  password: string;
};

type LoginResponse = {
  message: string;
  id: number;
  email: string;
  name: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState<string>("");
  const [user, setUser] = useState<LoginResponse | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Входим...");

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        const detail = Array.isArray(data.detail)
          ? data.detail.map((d: { msg: string }) => d.msg).join("; ")
          : data.detail;
        setMessage(detail || "Ошибка входа");
        return;
      }

      const loginData = data as LoginResponse;

      localStorage.setItem("access_token", loginData.access_token);
      localStorage.setItem("refresh_token", loginData.refresh_token);

      setUser(loginData);
      setMessage("Успешный вход");
    } catch {
      setMessage("Не удалось подключиться к API");
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>Вход</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={form.email}
            name="email"
            onChange={handleChange}
            required
          />

          <Input
            type="password"
            placeholder="Пароль"
            value={form.password}
            name="password"
            onChange={handleChange}
            required
            minLength={6}
          />

          <Button text="Войти" type="submit" />
        </form>

        {message && <p className={styles.message}>{message}</p>}

        {user && (
          <div className={styles.userInfo}>
            <p>ID: {user.id}</p>
            <p>Email: {user.email}</p>
            <p>Имя: {user.name}</p>
          </div>
        )}
      </section>
    </main>
  );
}