"use client";

import { useSyncExternalStore } from "react";
import style from "./style.module.scss";

const VIEW_MODE_COOKIE = "view-mode";
const ORIGIN_COOKIE = "view-mode-origin";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

type Origin = "mobile" | "tablet";
type Mode = "mobile" | "tablet" | "desktop";

interface ViewState {
  mode: Mode;
  origin: Origin | null;
}

const SERVER_STATE: ViewState = { mode: "mobile", origin: null };

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

function readViewState(): ViewState {
  const stored = getCookie(VIEW_MODE_COOKIE);
  if (stored === "desktop") {
    const storedOrigin = getCookie(ORIGIN_COOKIE);
    return { mode: "desktop", origin: storedOrigin === "tablet" ? "tablet" : "mobile" };
  }
  return { mode: detectViewport(), origin: null };
}

let cachedKey: string | null = null;
let cachedState: ViewState = SERVER_STATE;

/** Кэширует снапшот по строке cookie, чтобы useSyncExternalStore не зациклился на новой ссылке. */
function getSnapshot(): ViewState {
  const key = typeof document === "undefined" ? "" : document.cookie;
  if (key !== cachedKey) {
    cachedKey = key;
    cachedState = readViewState();
  }
  return cachedState;
}

function getServerSnapshot(): ViewState {
  return SERVER_STATE;
}

/** Переключение версии происходит через перезагрузку страницы, поэтому живая подписка не нужна. */
function subscribe(): () => void {
  return () => {};
}

export const ViewModeToggle = () => {
  const { mode, origin } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

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

  const isDesktop = mode === "desktop";
  let label: string;
  if (isDesktop) {
    label =
      origin === "tablet"
        ? "Переключиться на планшетную версию"
        : "Переключиться на мобильную версию";
  } else {
    label = "Переключиться на десктопную версию";
  }

  return (
    <button type="button" className={style.toggle} onClick={handleClick}>
      {label}
    </button>
  );
};
