"use client";

import { useEffect, useRef, useState } from "react";
import { SearchBar } from "@/src/shared/ui/SearchBar";
import BurgerIcon from "@/src/shared/ui/Icons/BurgerIcon";
import CategoriesIcon from "@/src/shared/ui/Icons/CategoriesIcon";
import MapIcon from "@/src/shared/ui/Icons/MapIcon";
import ChatIcon from "@/src/shared/ui/Icons/ChatIcon";
import HeartIcon from "@/src/shared/ui/Icons/HeartIcon";
import { UserAvatar } from "@/src/entities/user";
import { CategoriesPanel, type Category, type Subcategory } from "@/src/entities/category";
import style from "./style.module.scss";

interface HeaderProps {
  onSearch?: (value: string) => void;
  onMenuClick?: () => void;
  onMapClick?: () => void;
  onChatClick?: () => void;
  onFavoritesClick?: () => void;
  onPlaceAdClick?: () => void;
  onAvatarClick?: () => void;
  onSelectCategory?: (category: Category) => void;
  onSelectSubcategory?: (sub: Subcategory, category: Category) => void;
}

export const Header = ({
  onSearch,
  onMenuClick,
  onMapClick,
  onChatClick,
  onFavoritesClick,
  onPlaceAdClick,
  onAvatarClick,
  onSelectCategory,
  onSelectSubcategory,
}: HeaderProps) => {
  const [query, setQuery] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const categoriesWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!categoriesOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        categoriesWrapRef.current &&
        !categoriesWrapRef.current.contains(e.target as Node)
      ) {
        setCategoriesOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCategoriesOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [categoriesOpen]);

  const handleSelectCategory = (cat: Category) => {
    setCategoriesOpen(false);
    onSelectCategory?.(cat);
  };

  const handleSelectSubcategory = (sub: Subcategory, cat: Category) => {
    setCategoriesOpen(false);
    onSelectSubcategory?.(sub, cat);
  };

  return (
    <header className={style.header}>
      <div className={style.hero} />

      <div className={style.navbar}>
        <div className={style.navInner}>
          <div className={style.categoriesWrap} ref={categoriesWrapRef}>
            <button
              type="button"
              className={style.categoriesBtn}
              onClick={() => setCategoriesOpen((v) => !v)}
            >
              <CategoriesIcon />
              <span className={style.categoriesText}>Категории</span>
            </button>

            {categoriesOpen && (
              <div className={style.categoriesDropdown}>
                <CategoriesPanel
                  onSelectCategory={handleSelectCategory}
                  onSelectSubcategory={handleSelectSubcategory}
                />
              </div>
            )}
          </div>

          <div className={style.searchTab}>
            <div className={style.searchMobile}>
              <SearchBar
                placeholder="Поиск по объявлениям"
                value={query}
                onChange={setQuery}
                onSubmit={onSearch}
              />
            </div>
            <div className={style.searchDesktop}>
              <SearchBar
                placeholder="Поиск по объявлениям"
                value={query}
                onChange={setQuery}
                onSubmit={onSearch}
                submitText="Найти"
              />
            </div>
          </div>

          <div className={style.icons}>
            <button
              type="button"
              className={style.iconBtn}
              onClick={onMapClick}
              aria-label="Карта"
            >
              <MapIcon />
            </button>
            <button
              type="button"
              className={style.iconBtn}
              onClick={onChatClick}
              aria-label="Чат"
            >
              <ChatIcon />
            </button>
            <button
              type="button"
              className={style.iconBtn}
              onClick={onFavoritesClick}
              aria-label="Избранное"
            >
              <HeartIcon />
            </button>
          </div>

          <div className={style.actions}>
            <button
              type="button"
              className={style.placeAdBtn}
              onClick={onPlaceAdClick}
            >
              Разместить объявление
            </button>
            <button
              type="button"
              className={style.avatarBtn}
              onClick={onAvatarClick}
              aria-label="Профиль"
            >
              <UserAvatar size={39} />
            </button>
          </div>

          <button
            type="button"
            className={style.burger}
            onClick={onMenuClick}
            aria-label="Меню"
          >
            <BurgerIcon />
          </button>
        </div>
      </div>
    </header>
  );
};
