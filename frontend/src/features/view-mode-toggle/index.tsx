"use client";

import { useEffect, useState } from "react";
import style from "./style.module.scss";

const COOKIE_NAME = "view-mode";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export const ViewModeToggle = () => {
  const [mode, setMode] = useState<"mobile" | "desktop">("mobile");

  useEffect(() => {
    setMode(getCookie(COOKIE_NAME) === "desktop" ? "desktop" : "mobile");
  }, []);

  const handleClick = () => {
    const next = mode === "desktop" ? "mobile" : "desktop";
    setCookie(COOKIE_NAME, next, COOKIE_MAX_AGE);
    window.location.reload();
  };

  const label =
    mode === "desktop" ? "Вернуться на мобильную версию" : "Десктопная версия";

  return (
    <button type="button" className={style.toggle} onClick={handleClick}>
      {label}
    </button>
  );
};
