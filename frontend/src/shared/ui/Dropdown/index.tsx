"use client";

import { useEffect, useRef, useState } from "react";
import ChevronDownIcon from "@/src/shared/ui/Icons/ChevronDownIcon";
import style from "./style.module.scss";

export interface DropdownOption {
  value: string | number;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string | number | null;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string | number) => void;
}

export const Dropdown = ({
  options,
  value,
  placeholder = "Выберите",
  disabled = false,
  onChange,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className={style.wrap} ref={wrapRef}>
      <button
        type="button"
        className={`${style.box} ${open ? style.boxOpen : ""}`}
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
      >
        <span className={selected ? style.label : style.placeholder}>
          {selected?.label ?? placeholder}
        </span>
        <span className={`${style.chevron} ${open ? style.chevronOpen : ""}`}>
          <ChevronDownIcon />
        </span>
      </button>

      {open && (
        <div className={style.menu}>
          {options.length === 0 ? (
            <span className={style.empty}>Нет вариантов</span>
          ) : (
            options.map((option) => (
              <button
                type="button"
                key={option.value}
                className={`${style.option} ${option.value === value ? style.optionActive : ""}`}
                onClick={() => {
                  onChange?.(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
