"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import style from "./style.module.scss";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnBackdrop?: boolean;
}

export const Modal = ({
  open,
  onClose,
  children,
  closeOnBackdrop = true,
}: ModalProps) => {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [open, onClose]);

  if (!open || typeof window === "undefined") return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className={style.backdrop} onClick={handleBackdropClick}>
      <div className={style.content}>{children}</div>
    </div>,
    document.body
  );
};
