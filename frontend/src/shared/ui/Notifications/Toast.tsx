"use client";

import { useEffect, useState } from "react";
import s from "./Toast.module.scss";

export type ToastType = "success" | "error";

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onDismiss: () => void;
}

const EXIT_MS = 320;

export function Toast({ message, type, duration = 4000, onDismiss }: ToastProps) {
  const [phase, setPhase] = useState<"enter" | "shown" | "exit">("enter");

  useEffect(() => {
    const enter = setTimeout(() => setPhase("shown"), 10);
    const exit = setTimeout(() => setPhase("exit"), duration);
    const remove = setTimeout(onDismiss, duration + EXIT_MS);
    return () => {
      clearTimeout(enter);
      clearTimeout(exit);
      clearTimeout(remove);
    };
  }, [duration, onDismiss]);

  return (
    <div
      className={`${s.toast} ${s[type]} ${s[phase]}`}
      role={type === "error" ? "alert" : "status"}
    >
      <span className={s.icon} aria-hidden="true">{type === "success" ? "✓" : "!"}</span>
      <span className={s.message}>{message}</span>
      <button
        type="button"
        className={s.close}
        onClick={() => setPhase("exit")}
        aria-label="Закрыть уведомление"
      >
        ×
      </button>
    </div>
  );
}
