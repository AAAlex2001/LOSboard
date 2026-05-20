"use client";

import { useState } from "react";
import style from "./style.module.scss";

interface TooltipProps {
  label: string;
  children: React.ReactNode;
}

export const Tooltip = ({ label, children }: TooltipProps) => {
  const [open, setOpen] = useState(false);

  return (
    <span
      className={style.wrap}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <span
        className={`${style.tip} ${open ? style.tipVisible : ""}`}
        role="tooltip"
      >
        {label}
      </span>
    </span>
  );
};
