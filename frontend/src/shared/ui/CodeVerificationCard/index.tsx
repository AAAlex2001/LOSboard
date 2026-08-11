"use client";

import { useRef, useState } from "react";
import { Button } from "@/src/shared/ui/Button";
import { Loader } from "@/src/shared/ui/Loader";
import style from "./style.module.scss";

const LENGTH = 6;

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
  const boxes = useRef<Array<HTMLInputElement | null>>([]);
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(""));
  const code = digits.join("");

  const setChar = (index: number, char: string) => {
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (char && index < LENGTH - 1) boxes.current[index + 1]?.focus();
  };

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

      <div className={style.boxes}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              boxes.current[index] = el;
            }}
            className={style.box}
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => setChar(index, e.target.value.replace(/\D/g, "").slice(-1))}
          />
        ))}
      </div>

      <div className={style.center}>
        <Button type="button" variant="ghost" onClick={onResend}>
          Отправить ещё раз
        </Button>
      </div>

      <Button
        type="submit"
        color="blue"
        fullWidth
        disabled={code.length !== LENGTH || loading}
      >
        {loading ? <Loader /> : submitText}
      </Button>

      {onBack && (
        <div className={style.center}>
          <Button type="link" onClick={onBack}>
            Назад
          </Button>
        </div>
      )}
    </form>
  );
}
