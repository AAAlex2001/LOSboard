"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@/src/shared/ui/Icons/CloseIcon";
import style from "./style.module.scss";

type LightboxKind = "image" | "video";

interface LightboxProps {
  src: string;
  alt?: string;
  kind?: LightboxKind;
  onClose: () => void;
}

export const Lightbox = ({
  src,
  alt,
  kind = "image",
  onClose,
}: LightboxProps) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={style.overlay}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        className={style.closeBtn}
        onClick={onClose}
        aria-label="Закрыть"
      >
        <CloseIcon />
      </button>
      {kind === "video" ? (
        <video
          src={src}
          controls
          autoPlay
          className={style.media}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <img
          src={src}
          alt={alt ?? ""}
          className={style.media}
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>,
    document.body
  );
};
