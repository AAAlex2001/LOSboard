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

  const switchTo = (next: "mobile" | "desktop") => {
    setCookie(COOKIE_NAME, next, COOKIE_MAX_AGE);
    setMode(next);
    window.location.reload();
  };

  return (
    <div className={style.wrapper}>
      <button
        type="button"
        onClick={() => switchTo(mode === "desktop" ? "mobile" : "desktop")}
        style={{
          background: "none",
          border: "1px solid #1129BD",
          borderRadius: 8,
          padding: "8px 14px",
          color: "#1129BD",
          fontFamily: "Inter",
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        {mode === "desktop" ? "Мобильная версия" : "Десктопная версия"}
      </button>
    </div>
  );
};
