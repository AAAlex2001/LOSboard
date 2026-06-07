"use client";

import { useEffect, useState } from "react";
import style from "./style.module.scss";

const VIEW_MODE_COOKIE = "view-mode";
const ORIGIN_COOKIE = "view-mode-origin";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

type Origin = "mobile" | "tablet";
type Mode = "mobile" | "tablet" | "desktop";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

function detectViewport(): Origin {
  if (typeof window === "undefined") return "mobile";
  if (window.innerWidth < 850) return "mobile";
  return "tablet";
}

export const ViewModeToggle = () => {
  const [mode, setMode] = useState<Mode>("mobile");
  const [origin, setOrigin] = useState<Origin | null>(null);

  useEffect(() => {
    const stored = getCookie(VIEW_MODE_COOKIE);
    const storedOrigin = getCookie(ORIGIN_COOKIE);
    if (stored === "desktop") {
      setMode("desktop");
      setOrigin(storedOrigin === "tablet" ? "tablet" : "mobile");
    } else {
      setMode(detectViewport());
      setOrigin(null);
    }
  }, []);

  const handleClick = () => {
    if (mode === "desktop") {
      deleteCookie(VIEW_MODE_COOKIE);
      deleteCookie(ORIGIN_COOKIE);
    } else {
      const currentViewport = detectViewport();
      setCookie(ORIGIN_COOKIE, currentViewport, COOKIE_MAX_AGE);
      setCookie(VIEW_MODE_COOKIE, "desktop", COOKIE_MAX_AGE);
    }
    window.location.reload();
  };

  let label: string;
  if (mode !== "desktop") {
    label = "Переключиться на десктопную версию";
  } else if (origin === "tablet") {
    label = "Переключиться на планшетную версию";
  } else {
    label = "Переключиться на мобильную версию";
  }

  return (
    <button type="button" className={style.toggle} onClick={handleClick}>
      {label}
    </button>
  );
};
