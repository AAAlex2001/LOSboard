"use client";

import { useRouter } from "next/navigation";
import ArrowLeftIcon from "@/src/shared/ui/Icons/ArrowLeftIcon";
import style from "./style.module.scss";

interface BackButtonProps {
  className?: string;
  fallbackHref?: string;
}

export const BackButton = ({ className, fallbackHref = "/" }: BackButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      type="button"
      className={className ?? style.button}
      onClick={handleClick}
      aria-label="Назад"
    >
      <ArrowLeftIcon />
    </button>
  );
};
