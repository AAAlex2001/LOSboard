"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/shared/ui/Button";
import { PhotoGallery } from "@/src/shared/ui/PhotoGallery";
import { resolveAssetUrl } from "@/src/shared/lib/asset-url";
import { getAdvertisement, type Advertisement } from "@/src/entities/advertisement";
import { useFavorite } from "@/src/features/favorite";
import { useViewAdvertisement } from "@/src/features/advertisement";
import { useStartChat } from "@/src/features/chat";
import { ReportAdButton } from "@/src/features/report-ad";
import { formatPostedAt } from "@/src/shared/lib/date";
import { isAuthenticated } from "@/src/shared/auth/auth-storage";
import { useMeContext } from "@/src/entities/user";
import style from "./style.module.scss";

interface AdvertisementDetailProps {
  advertisement: Advertisement;
  categoryName?: string;
  subcategoryName?: string;
  canMessageSeller?: boolean;
}

const formatPrice = (price: number) => `${price.toLocaleString("ru-RU")} ₽`;

export const AdvertisementDetail = ({
  advertisement,
  categoryName,
  subcategoryName,
  canMessageSeller = true,
}: AdvertisementDetailProps) => {
  const router = useRouter();
  const [item, setItem] = useState<Advertisement>(advertisement);
  const { toggle, pendingIds } = useFavorite();
  const { loading: startingChat, start } = useStartChat();
  const { user: currentUser, loading: userLoading } = useMeContext();
  const isOwnAd = currentUser?.id === item.owner_id;
  const sellerButtonsDisabled = isOwnAd || userLoading;

  useEffect(() => {
    if (!currentUser) return;
    const controller = new AbortController();
    getAdvertisement(advertisement.id, { signal: controller.signal })
      .then((fresh) => {
        if (controller.signal.aborted) return;
        setItem((prev) => ({
          ...prev,
          is_liked: fresh.is_liked,
          likes_count: fresh.likes_count ?? prev.likes_count,
        }));
      })
      .catch(() => {});
    return () => controller.abort();
  }, [currentUser?.id, advertisement.id]);

  const viewState = useViewAdvertisement({
    advertisementId: item.id,
    initialViewsCount: item.views_count ?? 0,
    initialIsViewed: item.is_viewed ?? false,
  });

  const guardAuth = (): boolean => {
    if (isAuthenticated()) return true;
    router.push("/register");
    return false;
  };

  const photoUrls = (item.photo_urls ?? [])
    .map((url) => resolveAssetUrl(url))
    .filter((url): url is string => Boolean(url));
  const phoneTel = item.seller_phone ?? "";
  const isPending = pendingIds.has(item.id);

  const handleFavorite = async () => {
    if (!guardAuth()) return;
    const updated = await toggle(
      item,
      (optimistic) => setItem(optimistic),
      (prev) => setItem(prev)
    );
    if (updated) {
      setItem((prev) => ({
        ...prev,
        is_liked: updated.is_liked,
        likes_count: updated.likes_count ?? prev.likes_count,
      }));
    }
  };

  const handleCall = (e: React.MouseEvent) => {
    if (!guardAuth()) {
      e.preventDefault();
    }
  };

  const handleMessage = async () => {
    if (!guardAuth()) return;
    const conversationId = await start(item.id);
    if (conversationId != null) {
      router.push(`/chats/${conversationId}`);
    }
  };

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

        <PhotoGallery photos={photoUrls} alt={item.title} />
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
              {phoneTel && !isOwnAd && !userLoading ? (
                <a
                  href={`tel:${phoneTel}`}
                  className={style.callLink}
                  onClick={handleCall}
                >
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
                  title={isOwnAd ? "Это ваше объявление" : undefined}
                >
                  Позвонить продавцу
                </Button>
              )}
              {canMessageSeller && (
                <button
                  type="button"
                  className={style.messageBtn}
                  onClick={handleMessage}
                  disabled={startingChat || sellerButtonsDisabled}
                  title={isOwnAd ? "Это ваше объявление" : undefined}
                >
                  {startingChat ? "Открываем чат…" : "Написать продавцу"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className={style.stats}>
          <StatRow label="В избранном" value={String(item.likes_count ?? 0)} />
          <StatRow
            label="Просмотры"
            value={String(viewState.views_count ?? item.views_count ?? 0)}
          />
          <StatRow
            label="Размещено"
            value={item.created_at ? formatPostedAt(item.created_at) : "—"}
          />
        </div>

        {!isOwnAd && (
          <ReportAdButton advertisementId={item.id} className={style.reportBtn} />
        )}
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
