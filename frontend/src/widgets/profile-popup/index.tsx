"use client";

import { useEffect, useRef, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import MyAdsIcon from "@/src/shared/ui/Icons/MyAdsIcon";
import AdPromoIcon from "@/src/shared/ui/Icons/AdPromoIcon";
import SettingsIcon from "@/src/shared/ui/Icons/SettingsIcon";
import LogoutIcon from "@/src/shared/ui/Icons/LogoutIcon";
import { logout } from "@/src/shared/auth/auth-storage";
import style from "./style.module.scss";

interface ProfilePopupProps {
  open: boolean;
  onClose: () => void;
}

interface MenuItem {
  label: string;
  Icon: ComponentType<{ className?: string }>;
  onClick: () => void;
}

export const ProfilePopup = ({ open, onClose }: ProfilePopupProps) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  const navigate = (path: string) => () => {
    onClose();
    router.push(path);
  };

  const handleLogout = () => {
    logout();
    onClose();
    router.replace("/login");
  };

  const items: MenuItem[] = [
    { label: "Мои объявления", Icon: MyAdsIcon, onClick: navigate("/my-ads") },
    {
      label: "Размещение рекламы на сайте LOS",
      Icon: AdPromoIcon,
      onClick: navigate("/place-ad"),
    },
    { label: "Настройки аккаунта", Icon: SettingsIcon, onClick: navigate("/profile") },
    { label: "Выйти", Icon: LogoutIcon, onClick: handleLogout },
  ];

  return (
    <div className={style.popup} ref={ref} role="menu">
      {items.map(({ label, Icon, onClick }) => (
        <button
          key={label}
          type="button"
          className={style.item}
          onClick={onClick}
          role="menuitem"
        >
          <span className={style.icon} aria-hidden="true">
            <Icon />
          </span>
          <span className={style.label}>{label}</span>
        </button>
      ))}
    </div>
  );
};
