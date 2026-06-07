"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdvertisementSearch } from "@/src/features/advertisement";
import { Tooltip } from "@/src/shared/ui/Tooltip";
import BurgerIcon from "@/src/shared/ui/Icons/BurgerIcon";
import CategoriesIcon from "@/src/shared/ui/Icons/CategoriesIcon";
import MapIcon from "@/src/shared/ui/Icons/MapIcon";
import ChatIcon from "@/src/shared/ui/Icons/ChatIcon";
import HeartIcon from "@/src/shared/ui/Icons/HeartIcon";
import { UserAvatar, useMeContext } from "@/src/entities/user";
import { CategoriesPanel, type Category, type Subcategory } from "@/src/entities/category";
import { useUnreadTotal } from "@/src/entities/chat";
import { BurgerMenu } from "@/src/widgets/burger-menu";
import { ProfilePopup } from "@/src/widgets/profile/profile-popup";
import { Button } from "@/src/shared/ui/Button";
import { UnreadBadge } from "@/src/shared/ui/UnreadBadge";
import { isAuthenticated as checkAuth } from "@/src/shared/auth/auth-storage";
import style from "./style.module.scss";

interface HeaderProps {
  onMapClick?: () => void;
  onChatClick?: () => void;
  onFavoritesClick?: () => void;
  onAvatarClick?: () => void;
  onSelectCategory?: (category: Category) => void;
  onSelectSubcategory?: (sub: Subcategory, category: Category) => void;
}

export const Header = ({
  onMapClick,
  onChatClick,
  onFavoritesClick,
  onAvatarClick,
  onSelectCategory,
  onSelectSubcategory,
}: HeaderProps) => {
  const router = useRouter();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const categoriesWrapRef = useRef<HTMLDivElement>(null);
  const { total: unreadTotal } = useUnreadTotal();
  const { user: me } = useMeContext();

  useEffect(() => {
    setAuthed(checkAuth());
  }, []);

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

  const handlePlaceAd = () => {
    if (authed) {
      router.push("/place-ad");
    } else {
      router.push("/register");
    }
  };

  const handleAvatarClick = () => {
    if (onAvatarClick) {
      onAvatarClick();
      return;
    }
    if (authed) {
      setProfileOpen((v) => !v);
    } else {
      router.push("/login");
    }
  };

  const handleFavoritesClick = () => {
    if (onFavoritesClick) {
      onFavoritesClick();
    } else if (authed) {
      router.push("/favorites");
    } else {
      router.push("/login");
    }
  };

  const handleChatClick = () => {
    if (onChatClick) {
      onChatClick();
    } else if (authed) {
      router.push("/chats");
    } else {
      router.push("/login");
    }
  };

  return (
    <>
      <div className={style.hero} />
      <header className={style.navbar}>
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
                <AdvertisementSearch />
              </div>
              <div className={style.searchDesktop}>
                <AdvertisementSearch submitText="Найти" />
              </div>
            </div>

            <div className={style.icons}>
              <Tooltip label="Карта">
                <button
                  type="button"
                  className={style.iconBtn}
                  onClick={onMapClick}
                  aria-label="Карта"
                >
                  <MapIcon />
                </button>
              </Tooltip>
              <Tooltip label="Сообщения">
                <button
                  type="button"
                  className={style.iconBtn}
                  onClick={handleChatClick}
                  aria-label="Чат"
                >
                  <ChatIcon />
                  {authed && unreadTotal > 0 && (
                    <UnreadBadge
                      count={unreadTotal}
                      className={style.iconBadge}
                    />
                  )}
                </button>
              </Tooltip>
              <Tooltip label="Избранное">
                <button
                  type="button"
                  className={style.iconBtn}
                  onClick={handleFavoritesClick}
                  aria-label="Избранное"
                >
                  <HeartIcon />
                </button>
              </Tooltip>
            </div>

            <div className={style.actions}>
              <Button
                type="button"
                variant="filled"
                color="green"
                onClick={handlePlaceAd}
              >
                Разместить объявление
              </Button>
              <div className={style.avatarWrap}>
                <button
                  type="button"
                  className={style.avatarBtn}
                  onClick={handleAvatarClick}
                  aria-label="Профиль"
                >
                  <UserAvatar size={39} src={me?.avatar_url ?? undefined} />
                </button>
                <ProfilePopup
                  open={profileOpen}
                  onClose={() => setProfileOpen(false)}
                />
              </div>
            </div>

            <button
              type="button"
              className={style.burger}
              onClick={() => setMenuOpen(true)}
              aria-label="Меню"
            >
              <BurgerIcon />
            </button>
          </div>
      </header>

      <BurgerMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        isAuthenticated={authed}
        onMapClick={onMapClick}
        onChatClick={onChatClick}
        onFavoritesClick={onFavoritesClick}
      />
    </>
  );
};
