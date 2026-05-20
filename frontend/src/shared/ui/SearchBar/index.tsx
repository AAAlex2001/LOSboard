"use client";

import { useState } from "react";
import SearchIcon from "@/src/shared/ui/Icons/SearchIcon";
import style from "./style.module.scss";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  submitText?: string;
}

export const SearchBar = ({
  placeholder = "Поиск по объявлениям",
  value,
  onChange,
  onSubmit,
  submitText,
}: SearchBarProps) => {
  const [internal, setInternal] = useState("");
  const current = value !== undefined ? value : internal;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSubmit?.(current);
  };

  return (
    <div className={style.searchBar}>
      <input
        className={style.input}
        type="text"
        value={current}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {submitText ? (
        <button
          type="button"
          className={style.submitBtn}
          onClick={() => onSubmit?.(current)}
        >
          {submitText}
        </button>
      ) : (
        <button
          type="button"
          className={style.iconBtn}
          onClick={() => onSubmit?.(current)}
        >
          <SearchIcon />
        </button>
      )}
    </div>
  );
};
