"use client";

import { useEffect, useRef, useState } from "react";
import { SearchBar } from "@/src/shared/ui/SearchBar";
import style from "./style.module.scss";

export interface AddressSuggestion {
  label: string;
  lat: number;
  lon: number;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (suggestion: AddressSuggestion) => void;
  placeholder?: string;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

export const AddressAutocomplete = ({
  value,
  onChange,
  onSelect,
  placeholder = "Введите адрес",
}: AddressAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const skipFetchRef = useRef(false);
  const userTypedRef = useRef(false);

  useEffect(() => {
    if (skipFetchRef.current) {
      skipFetchRef.current = false;
      return;
    }

    if (!userTypedRef.current) return;
    if (!value || value.trim().length < 3) return;

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const url =
          `${NOMINATIM_URL}?q=${encodeURIComponent(value)}` +
          `&format=json&limit=5&accept-language=ru`;
        const res = await fetch(url, { signal: controller.signal });
        const data: NominatimResult[] = await res.json();
        const items = data.map((item) => ({
          label: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
        }));
        setSuggestions(items);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setSuggestions([]);
        }
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = (s: AddressSuggestion) => {
    skipFetchRef.current = true;
    onChange(s.label);
    onSelect?.(s);
    setOpen(false);
    setSuggestions([]);
  };

  const handleInputChange = (next: string) => {
    userTypedRef.current = true;
    if (!next || next.trim().length < 3) {
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
    } else {
      setLoading(true);
      setSuggestions([]);
      setOpen(true);
    }
    onChange(next);
  };

  return (
    <div className={style.wrap} ref={wrapRef}>
      <SearchBar
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onSubmit={() => suggestions[0] && handleSelect(suggestions[0])}
      />

      {open && (
        <div className={style.dropdown}>
          {loading ? (
            <div className={style.loading}>
              <span className={style.spinner} />
              <span>Поиск адресов…</span>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((s, i) => (
              <button
                key={`${s.lat}-${s.lon}-${i}`}
                type="button"
                className={style.suggestion}
                onClick={() => handleSelect(s)}
              >
                {s.label}
              </button>
            ))
          ) : (
            <div className={style.empty}>Ничего не найдено</div>
          )}
        </div>
      )}
    </div>
  );
};
