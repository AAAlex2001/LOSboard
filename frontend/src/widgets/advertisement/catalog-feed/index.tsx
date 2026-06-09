"use client";

import { useRouter } from "next/navigation";
import { Loader } from "@/src/shared/ui/Loader";
import { AdCard, type Advertisement } from "@/src/entities/advertisement";
import type { AdvertisementListState } from "@/src/features/advertisement";
import { useFavorite } from "@/src/features/favorite";
import { buildAdvertisementUrl } from "@/src/shared/lib/slug";
import style from "./style.module.scss";

interface CatalogFeedProps {
  state: AdvertisementListState;
  title?: string;
  onItemPatch: (ad: Advertisement) => void;
}

export const CatalogFeed = ({ state, title, onItemPatch }: CatalogFeedProps) => {
  const router = useRouter();
  const { toggle, pendingIds } = useFavorite();

  const handleAdClick = (ad: Advertisement) => {
    router.push(buildAdvertisementUrl(ad.id, ad.title));
  };

  const handleFavorite = async (ad: Advertisement) => {
    const updated = await toggle(ad);
    if (updated) onItemPatch(updated);
  };

  const titleClass = state.urgentOnly
    ? `${style.title} ${style.titleUrgent}`
    : style.title;

  return (
    <div className={style.feed}>
      <h2 className={titleClass}>{title ?? "Все объявления"}</h2>
      {state.urgentOnly && (
        <div className={style.urgentBanner}>
          Показаны только срочные объявления. Выберите подкатегорию выше, чтобы сузить выдачу.
        </div>
      )}

      {state.loading && (
        <div className={style.feedback}>
          <Loader />
        </div>
      )}
      {!state.loading && state.error && (
        <p className={style.feedback}>{state.error}</p>
      )}
      {!state.loading && !state.error && state.items.length === 0 && (
        <p className={style.feedback}>Объявлений пока нет</p>
      )}
      {!state.loading && !state.error && state.items.length > 0 && (
        <div className={style.grid}>
          {state.items.map((ad) => (
            <AdCard
              key={ad.id}
              advertisement={ad}
              onClick={handleAdClick}
              onToggleFavorite={handleFavorite}
              favoritePending={pendingIds.has(ad.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
