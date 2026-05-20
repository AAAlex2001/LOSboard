"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import CategoriesIcon from "@/src/shared/ui/Icons/CategoriesIcon";
import MapIcon from "@/src/shared/ui/Icons/MapIcon";
import ChatIcon from "@/src/shared/ui/Icons/ChatIcon";
import HeartIcon from "@/src/shared/ui/Icons/HeartIcon";
import UserIcon from "@/src/shared/ui/Icons/UserIcon";
import LogoutIcon from "@/src/shared/ui/Icons/LogoutIcon";
import MyAdsIcon from "@/src/shared/ui/Icons/MyAdsIcon";
import { Button } from "@/src/shared/ui/Button";
import { logout } from "@/src/shared/auth/auth-storage";
import style from "./style.module.scss";

interface BurgerMenuProps {
  open: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onCategoriesClick?: () => void;
  onMapClick?: () => void;
  onChatClick?: () => void;
  onFavoritesClick?: () => void;
}

export const BurgerMenu = ({
  open,
  onClose,
  isAuthenticated,
  onCategoriesClick,
  onMapClick,
  onChatClick,
  onFavoritesClick,
}: BurgerMenuProps) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!isMounted) return null;

  const handlePlaceAd = () => {
    onClose();
    router.push(isAuthenticated ? "/place-ad" : "/register");
  };

  const wrap = (fn?: () => void) => () => {
    onClose();
    fn?.();
  };

  const handleLogout = () => {
    logout();
    onClose();
    router.replace("/login");
  };

  const handleProfile = () => {
    onClose();
    router.push("/profile");
  };

  const handleMyAds = () => {
    onClose();
    router.push("/my-ads");
  };

  const handleFavorites = () => {
    onClose();
    if (onFavoritesClick) {
      onFavoritesClick();
    } else {
      router.push("/favorites");
    }
  };

  const handleLogin = () => {
    onClose();
    router.push("/login");
  };

  return createPortal(
    <div
      className={`${style.overlay} ${open ? style.overlayOpen : ""}`}
      onClick={onClose}
    >
      <div
        className={`${style.menu} ${open ? style.menuOpen : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={style.topGroup}>
          <Button
            type="button"
            variant="filled"
            color="green"
            onClick={handlePlaceAd}
            fullWidth
          >
            Разместить объявление
          </Button>

          <div className={style.menuItems}>
            <button
              type="button"
              className={style.menuItem}
              onClick={wrap(onCategoriesClick)}
            >
              <span className={style.menuIcon}><CategoriesIcon /></span>
              <span className={style.menuLabel}>Категории</span>
            </button>

            <button
              type="button"
              className={style.menuItem}
              onClick={wrap(onMapClick)}
            >
              <span className={style.menuIcon}><MapIcon /></span>
              <span className={style.menuLabel}>Карта</span>
            </button>

            {isAuthenticated && (
              <>
                <button
                  type="button"
                  className={style.menuItem}
                  onClick={wrap(onChatClick)}
                >
                  <span className={style.menuIcon}><ChatIcon /></span>
                  <span className={style.menuLabel}>Чат</span>
                </button>

                <button
                  type="button"
                  className={style.menuItem}
                  onClick={handleMyAds}
                >
                  <span className={style.menuIcon}><MyAdsIcon /></span>
                  <span className={style.menuLabel}>Мои объявления</span>
                </button>

                <button
                  type="button"
                  className={style.menuItem}
                  onClick={handleFavorites}
                >
                  <span className={style.menuIcon}><HeartIcon /></span>
                  <span className={style.menuLabel}>Избранное</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className={style.bottomGroup}>
          {isAuthenticated ? (
            <>
              <button
                type="button"
                className={style.menuItem}
                onClick={handleProfile}
              >
                <span className={style.menuIcon}><UserIcon /></span>
                <span className={style.menuLabel}>Профиль</span>
              </button>

              <button
                type="button"
                className={style.menuItem}
                onClick={handleLogout}
              >
                <span className={style.menuIcon}><LogoutIcon /></span>
                <span className={style.menuLabel}>Выйти</span>
              </button>
            </>
          ) : (
            <Button
              type="button"
              variant="filled"
              color="blue"
              onClick={handleLogin}
              fullWidth
            >
              Войти
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
