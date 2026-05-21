"use client";

import { useEffect, useRef } from "react";
import { SearchBar } from "@/src/shared/ui/SearchBar";
import { resolveAssetUrl } from "@/src/entities/advertisement";
import { useSearchAdvertisement } from "../model/useSearchAdvertisement";
import style from "./AdvertisementSearch.module.scss";

interface AdvertisementSearchProps {
  placeholder?: string;
  submitText?: string;
}

const formatPrice = (price: number) => `${price.toLocaleString("ru-RU")} ₽`;

export const AdvertisementSearch = ({
  placeholder = "Поиск по объявлениям",
  submitText,
}: AdvertisementSearchProps) => {
  const { state, setQuery, close, goToAdvertisement, submit } =
    useSearchAdvertisement();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state.open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        close();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [state.open, close]);

  return (
    <div className={style.wrap} ref={wrapRef}>
      <SearchBar
        placeholder={placeholder}
        value={state.query}
        onChange={setQuery}
        onSubmit={submit}
        submitText={submitText}
      />

      {state.open && (
        <div className={style.dropdown}>
          {state.loading ? (
            <div className={style.loading}>
              <span className={style.spinner} />
              <span>Ищем объявления…</span>
            </div>
          ) : state.error ? (
            <div className={style.empty}>{state.error}</div>
          ) : state.suggestions.length === 0 ? (
            <div className={style.empty}>Ничего не найдено</div>
          ) : (
            state.suggestions.map((ad) => {
              const photo = resolveAssetUrl(ad.photo_urls?.[0] ?? null);
              return (
                <button
                  key={ad.id}
                  type="button"
                  className={style.suggestion}
                  onClick={() => goToAdvertisement(ad.id)}
                >
                  <span className={style.thumb}>
                    {photo ? (
                      <img src={photo} alt="" className={style.thumbImg} />
                    ) : (
                      <span className={style.thumbPlaceholder} />
                    )}
                  </span>
                  <span className={style.body}>
                    <span className={style.title}>{ad.title}</span>
                    <span className={style.price}>{formatPrice(ad.price)}</span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
