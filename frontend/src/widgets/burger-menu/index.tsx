"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import HomeIcon from "@/src/shared/ui/Icons/HomeIcon";
import MapIcon from "@/src/shared/ui/Icons/MapIcon";
import ChatIcon from "@/src/shared/ui/Icons/ChatIcon";
import HeartIcon from "@/src/shared/ui/Icons/HeartIcon";
import UserIcon from "@/src/shared/ui/Icons/UserIcon";
import LogoutIcon from "@/src/shared/ui/Icons/LogoutIcon";
import MyAdsIcon from "@/src/shared/ui/Icons/MyAdsIcon";
import AdPromoIcon from "@/src/shared/ui/Icons/AdPromoIcon";
import { Button } from "@/src/shared/ui/Button";
import { UnreadBadge } from "@/src/shared/ui/UnreadBadge";
import { useUnreadTotal } from "@/src/entities/chat";
import { logout } from "@/src/shared/auth/auth-storage";
import style from "./style.module.scss";

interface BurgerMenuProps {
  open: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onMapClick?: () => void;
  onChatClick?: () => void;
  onFavoritesClick?: () => void;
}

export const BurgerMenu = ({
  open,
  onClose,
  isAuthenticated,
  onMapClick,
  onChatClick,
  onFavoritesClick,
}: BurgerMenuProps) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { total: unreadTotal } = useUnreadTotal();

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

  const handleChat = () => {
    onClose();
    if (onChatClick) {
      onChatClick();
    } else {
      router.push("/chats");
    }
  };

  const handleLogin = () => {
    onClose();
    router.push("/login");
  };

  const handleAdvertising = () => {
    onClose();
    router.push("/advertising");
  };

  const handleHome = () => {
    onClose();
    router.push("/");
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
              onClick={handleHome}
            >
              <span className={style.menuIcon}><HomeIcon /></span>
              <span className={style.menuLabel}>Все объявления</span>
            </button>

            <button
              type="button"
              className={style.menuItem}
              onClick={wrap(onMapClick)}
            >
              <span className={style.menuIcon}><MapIcon /></span>
              <span className={style.menuLabel}>Карта</span>
            </button>

            <button
              type="button"
              className={style.menuItem}
              onClick={handleAdvertising}
            >
              <span className={style.menuIcon}><AdPromoIcon /></span>
              <span className={style.menuLabel}>Размещение рекламы</span>
            </button>

            {isAuthenticated && (
              <>
                <button
                  type="button"
                  className={style.menuItem}
                  onClick={handleChat}
                >
                  <span className={style.menuIcon}><ChatIcon /></span>
                  <span className={style.menuLabel}>Чат</span>
                  <UnreadBadge count={unreadTotal} />
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
