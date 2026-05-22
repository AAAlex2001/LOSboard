"use client";

import { useEffect, useState } from "react";
import style from "./style.module.scss";

type ViewportMode = "desktop" | "mobile";

const STORAGE_KEY = "losboard.viewport-mode";
const MOBILE_VIEWPORT = "width=device-width, initial-scale=1, viewport-fit=cover";
const DESKTOP_VIEWPORT = "width=1440, initial-scale=1, viewport-fit=cover";

function getViewportMeta(): HTMLMetaElement {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "viewport";
    document.head.appendChild(meta);
  }
  return meta;
}

function applyViewportMode(mode: ViewportMode) {
  getViewportMeta().content = mode === "desktop" ? DESKTOP_VIEWPORT : MOBILE_VIEWPORT;
  document.documentElement.dataset.viewportMode = mode;
}

function getInitialMode(): ViewportMode {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "desktop" || saved === "mobile") {
    return saved;
  }
  return window.screen.width < 850 ? "desktop" : "mobile";
}

export function ViewportModeToggle() {
  const [mode, setMode] = useState<ViewportMode>("mobile");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const initialMode = getInitialMode();
    setMode(initialMode);
    applyViewportMode(initialMode);
    setVisible(window.screen.width < 850 || initialMode === "desktop");
  }, []);

  const toggleMode = () => {
    const nextMode = mode === "desktop" ? "mobile" : "desktop";
    setMode(nextMode);
    window.localStorage.setItem(STORAGE_KEY, nextMode);
    applyViewportMode(nextMode);
  };

  return (
    <button
      type="button"
      className={`${style.toggle} ${visible ? style.toggleVisible : ""}`}
      onClick={toggleMode}
      aria-label={mode === "desktop" ? "Включить мобильную версию" : "Включить ПК-версию"}
      title={mode === "desktop" ? "Включить мобильную версию" : "Включить ПК-версию"}
    >
      <span className={style.icon} aria-hidden="true">
        {mode === "desktop" ? (
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="5" y="2.5" width="14" height="19" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M10 18.5H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M9 20H15M12 16V20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </span>
      <span className={style.label}>{mode === "desktop" ? "Моб. версия" : "ПК-версия"}</span>
    </button>
  );
}
