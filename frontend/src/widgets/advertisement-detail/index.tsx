"use client";

import { useState } from "react";
import { Button } from "@/src/shared/ui/Button";
import ArrowRightLongIcon from "@/src/shared/ui/Icons/ArrowRightLongIcon";
import {
  resolveAssetUrl,
  type Advertisement,
} from "@/src/entities/advertisement";
import { useFavorite } from "@/src/features/favorite";
import { formatPostedAt } from "@/src/shared/lib/date";
import style from "./style.module.scss";

interface AdvertisementDetailProps {
  advertisement: Advertisement;
  categoryName?: string;
  subcategoryName?: string;
}

const formatPrice = (price: number) => `${price.toLocaleString("ru-RU")} ₽`;

export const AdvertisementDetail = ({
  advertisement,
  categoryName,
  subcategoryName,
}: AdvertisementDetailProps) => {
  const [item, setItem] = useState<Advertisement>(advertisement);
  const [photoIndex, setPhotoIndex] = useState(0);
  const { toggle, pendingIds } = useFavorite();

  const photos = item.photo_urls ?? [];
  const currentPhoto = photos[photoIndex] ?? null;
  const photoSrc = resolveAssetUrl(currentPhoto);
  const hasMultiplePhotos = photos.length > 1;
  const phoneTel = item.seller_phone ?? "";
  const isPending = pendingIds.has(item.id);

  const handleFavorite = async () => {
    const updated = await toggle(item);
    if (updated) {
      setItem({
        ...item,
        is_liked: updated.is_liked,
        likes_count: updated.likes_count ?? item.likes_count,
      });
    }
  };

  const showPrev = () =>
    setPhotoIndex((i) => (i - 1 + photos.length) % photos.length);
  const showNext = () => setPhotoIndex((i) => (i + 1) % photos.length);

  return (
    <div className={style.detail}>
      <section className={style.photoSection}>
        <div className={style.titleRow}>
          <h1 className={style.title}>{item.title}</h1>
          <button
            type="button"
            className={`${style.favBtn} ${item.is_liked ? style.favBtnActive : ""}`}
            onClick={handleFavorite}
            disabled={isPending}
            aria-label={item.is_liked ? "Удалить из избранного" : "В избранное"}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={item.is_liked ? "#FF2D55" : "none"}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 21s-7-4.5-9-9c-1.5-3.4 0.7-7 4-7 2 0 3.5 1.2 5 3 1.5-1.8 3-3 5-3 3.3 0 5.5 3.6 4 7-2 4.5-9 9-9 9z"
                stroke={item.is_liked ? "#FF2D55" : "#1129BD"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className={style.photoWrap}>
          {photoSrc ? (
            <img src={photoSrc} alt={item.title} className={style.photo} />
          ) : (
            <div className={style.photoPlaceholder}>
              <span>Фото не добавлено</span>
            </div>
          )}
          {hasMultiplePhotos && (
            <>
              <button
                type="button"
                className={`${style.navBtn} ${style.navBtnLeft}`}
                onClick={showPrev}
                aria-label="Предыдущее фото"
              >
                <span className={style.navIcon}>
                  <ArrowRightLongIcon />
                </span>
              </button>
              <button
                type="button"
                className={`${style.navBtn} ${style.navBtnRight}`}
                onClick={showNext}
                aria-label="Следующее фото"
              >
                <ArrowRightLongIcon />
              </button>
            </>
          )}
        </div>
      </section>

      <section className={style.info}>
        <div className={style.group}>
          <Row label="Цена" value={formatPrice(item.price)} bold />
          <Row label="Местоположение" value={item.location} />
          {item.description && (
            <Row label="Описание" value={item.description} multiline />
          )}
        </div>

        {(categoryName || subcategoryName) && (
          <div className={style.group}>
            {categoryName && <Row label="Категория" value={categoryName} />}
            {subcategoryName && (
              <Row label="Подкатегория" value={subcategoryName} />
            )}
          </div>
        )}

        <div className={style.group}>
          {item.seller_name && (
            <Row label="Имя продавца" value={item.seller_name} />
          )}

          <div className={style.contactsBlock}>
            <span className={style.label}>Узнайте больше</span>
            <div className={style.contactButtons}>
              {phoneTel ? (
                <a href={`tel:${phoneTel}`} className={style.callLink}>
                  <Button type="button" variant="filled" color="blue" fullWidth>
                    Позвонить продавцу
                  </Button>
                </a>
              ) : (
                <Button
                  type="button"
                  variant="filled"
                  color="blue"
                  fullWidth
                  disabled
                >
                  Позвонить продавцу
                </Button>
              )}
              <button type="button" className={style.messageBtn}>
                Написать продавцу
              </button>
            </div>
          </div>
        </div>

        <div className={style.stats}>
          <StatRow label="В избранном" value={String(item.likes_count ?? 0)} />
          <StatRow label="Просмотры" value="—" />
          <StatRow
            label="Размещено"
            value={item.created_at ? formatPostedAt(item.created_at) : "—"}
          />
        </div>

        <button type="button" className={style.reportBtn}>
          Пожаловаться
        </button>
      </section>
    </div>
  );
};

interface RowProps {
  label: string;
  value: string;
  bold?: boolean;
  multiline?: boolean;
}

const Row = ({ label, value, bold, multiline }: RowProps) => (
  <div className={style.row}>
    <span className={style.label}>{label}</span>
    <span
      className={`${style.value} ${bold ? style.valueBold : ""} ${
        multiline ? style.valueMultiline : ""
      }`}
    >
      {value}
    </span>
  </div>
);

const StatRow = ({ label, value }: { label: string; value: string }) => (
  <div className={style.statRow}>
    <span className={style.statLabel}>{label}</span>
    <span className={style.statValue}>{value}</span>
  </div>
);
