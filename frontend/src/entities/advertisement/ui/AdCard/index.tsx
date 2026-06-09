"use client";

import Image from "next/image";
import EditIcon from "@/src/shared/ui/Icons/EditIcon";
import { resolveAssetUrl } from "@/src/shared/lib/asset-url";
import { formatPrice } from "@/src/shared/lib/format";
import type { Advertisement } from "../../model/types";
import style from "./style.module.scss";

interface AdCardProps {
  advertisement: Advertisement;
  onClick?: (ad: Advertisement) => void;
  onToggleFavorite?: (ad: Advertisement) => void;
  onEdit?: (ad: Advertisement) => void;
  favoritePending?: boolean;
}

export const AdCard = ({
  advertisement,
  onClick,
  onToggleFavorite,
  onEdit,
  favoritePending,
}: AdCardProps) => {
  const {
    title,
    price,
    photo_urls,
    is_liked,
    is_urgent,
    moderation_status,
    moderation_reason,
  } = advertisement;
  const photoSrc = resolveAssetUrl(photo_urls?.[0] ?? null);

  const moderationLabel =
    moderation_status === "pending"
      ? "На модерации"
      : moderation_status === "rejected"
      ? "Отклонено"
      : moderation_status === "approved"
      ? "Опубликовано"
      : null;
  const showModeration = Boolean(onEdit) && moderationLabel !== null;

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onToggleFavorite?.(advertisement);
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onEdit?.(advertisement);
  };

  return (
    <article
      className={`${style.card} ${advertisement.is_urgent ? style.cardUrgent : ""}`}
      onClick={onClick ? () => onClick(advertisement) : undefined}
      role={onClick ? "button" : undefined}
    >
      <div className={style.imageWrap}>
        <div className={style.imageClip}>
          {photoSrc ? (
            <Image
              src={photoSrc}
              alt={title}
              fill
              sizes="(max-width: 850px) 50vw, 25vw"
              className={style.image}
            />
          ) : (
            <div className={style.imagePlaceholder}>
              <span className={style.placeholderText}>Фото не добавлено</span>
            </div>
          )}
        </div>

        {(is_urgent || showModeration) && (
          <div className={style.badgesStack}>
            {is_urgent && <span className={style.urgentBadge}>Срочно</span>}
            {showModeration && (
              <span
                className={`${style.moderationBadge} ${
                  moderation_status === "pending"
                    ? style.moderationPending
                    : moderation_status === "rejected"
                    ? style.moderationRejected
                    : style.moderationApproved
                }`}
                title={moderation_reason ?? undefined}
              >
                {moderationLabel}
              </span>
            )}
          </div>
        )}

        {onEdit ? (
          <>
            <button
              type="button"
              className={`${style.cornerBtn} ${style.editBtn}`}
              onClick={handleEditClick}
              aria-label="Редактировать"
            >
              <EditIcon />
            </button>
            <button
              type="button"
              className={style.editPillBtn}
              onClick={handleEditClick}
            >
              Редактировать
            </button>
          </>
        ) : (
          <button
            type="button"
            className={`${style.cornerBtn} ${style.favBtn} ${
              is_liked ? style.favBtnActive : ""
            }`}
            onClick={handleFavoriteClick}
            disabled={favoritePending}
            aria-label={is_liked ? "Удалить из избранного" : "В избранное"}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={is_liked ? "#FF2D55" : "none"}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 21s-7-4.5-9-9c-1.5-3.4 0.7-7 4-7 2 0 3.5 1.2 5 3 1.5-1.8 3-3 5-3 3.3 0 5.5 3.6 4 7-2 4.5-9 9-9 9z"
                stroke={is_liked ? "#FF2D55" : "#1129BD"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      <div className={style.body}>
        <span className={style.price}>{formatPrice(price)}</span>
        <span className={style.title}>{title}</span>
      </div>
    </article>
  );
};
