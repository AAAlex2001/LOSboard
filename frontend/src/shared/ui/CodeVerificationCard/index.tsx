"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/src/shared/ui/Input";
import { Button } from "@/src/shared/ui/Button";
import { Loader } from "@/src/shared/ui/Loader";
import style from "./style.module.scss";

interface CodeVerificationCardProps {
  title: string;
  subtitle: string;
  email: string;
  loading: boolean;
  submitText?: string;
  onSubmit: (code: string) => void;
  onResend: () => void;
  onBack?: () => void;
}

export function CodeVerificationCard({
  title,
  subtitle,
  email,
  loading,
  submitText = "Подтвердить",
  onSubmit,
  onResend,
  onBack,
}: CodeVerificationCardProps) {
  const router = useRouter();
  const [code, setCode] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(code);
  };

  return (
    <form className={style.card} onSubmit={handleSubmit}>
      <div className={style.heading}>
        <h1 className={style.title}>{title}</h1>
        <span className={style.subtitle}>{subtitle}</span>
      </div>

      <p className={style.sentTo}>Мы отправили код на {email}</p>

      <Input
        type="text"
        placeholder="Код из письма"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        name="code"
        maxLength={6}
      />

      <div className={style.center}>
        <Button type="link" onClick={onResend}>
          Отправить ещё раз
        </Button>
      </div>

      <div className={style.actions}>
        {onBack && (
          <Button type="button" variant="outlined" color="gray" onClick={onBack}>
            Назад
          </Button>
        )}
        <Button type="submit" color="blue" disabled={code.length !== 6 || loading}>
          {loading ? <Loader /> : submitText}
        </Button>
      </div>

      <div className={style.center}>
        <Button type="link" onClick={() => router.push("/")}>
          Вернуться на главную
        </Button>
      </div>
    </form>
  );
}
