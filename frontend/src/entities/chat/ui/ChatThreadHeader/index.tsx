"use client";

import CloseIcon from "@/src/shared/ui/Icons/CloseIcon";
import { resolveAssetUrl } from "@/src/entities/advertisement";
import type { ChatAdvertisement } from "../../model/types";
import style from "./style.module.scss";

interface ChatThreadHeaderProps {
  advertisement: ChatAdvertisement;
  price?: number | null;
  onAdClick?: () => void;
  onClose?: () => void;
}

const formatPrice = (price: number) => `${price.toLocaleString("ru-RU")} ₽`;

export const ChatThreadHeader = ({
  advertisement,
  price,
  onAdClick,
  onClose,
}: ChatThreadHeaderProps) => {
  const photo = resolveAssetUrl(advertisement.photo_url);

  return (
    <header className={style.header}>
      <button
        type="button"
        className={style.info}
        onClick={onAdClick}
        disabled={!onAdClick}
      >
        <div className={style.image}>
          {photo ? (
            <img src={photo} alt={advertisement.title} className={style.imageImg} />
          ) : (
            <div className={style.imagePlaceholder} />
          )}
        </div>
        <div className={style.text}>
          <span className={style.title}>{advertisement.title}</span>
          {price != null && (
            <span className={style.price}>{formatPrice(price)}</span>
          )}
        </div>
      </button>

      {onClose && (
        <button
          type="button"
          className={style.closeBtn}
          onClick={onClose}
          aria-label="Закрыть"
        >
          <CloseIcon />
        </button>
      )}
    </header>
  );
};
