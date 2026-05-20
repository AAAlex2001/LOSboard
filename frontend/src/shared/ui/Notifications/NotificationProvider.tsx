"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Toast, type ToastType } from "./Toast";
import s from "./Toast.module.scss";

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface NotificationContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

const Ctx = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<ToastItem | null>(null);

  const dismiss = (id: string) => {
    setItem((prev) => (prev && prev.id === id ? null : prev));
  };

  const push = (type: ToastType, message: string) => {
    setItem({ id: `${Date.now()}-${Math.random()}`, type, message });
  };

  return (
    <Ctx.Provider
      value={{
        showSuccess: (message) => push("success", message),
        showError: (message) => push("error", message),
      }}
    >
      {children}
      <div className={s.stack}>
        {item && (
          <Toast
            key={item.id}
            message={item.message}
            type={item.type}
            onDismiss={() => dismiss(item.id)}
          />
        )}
      </div>
    </Ctx.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return ctx;
}
