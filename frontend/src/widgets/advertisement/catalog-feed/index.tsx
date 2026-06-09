"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/src/shared/ui/Button";
import { FeedState } from "@/src/shared/ui/FeedState";
import { AdGrid } from "@/src/shared/ui/AdGrid";
import { type Advertisement } from "@/src/entities/advertisement";
import type { AdvertisementListState } from "@/src/features/advertisement";
import { useFavorite } from "@/src/features/favorite";
import { buildAdvertisementUrl } from "@/src/shared/lib/slug";
import style from "./style.module.scss";

interface CatalogFeedProps {
  state: AdvertisementListState;
  title?: string;
  onItemPatch: (ad: Advertisement) => void;
  onLoadMore: () => void;
}

export const CatalogFeed = ({
  state,
  title,
  onItemPatch,
  onLoadMore,
}: CatalogFeedProps) => {
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

      <FeedState
        loading={state.loading}
        error={state.error}
        empty={state.items.length === 0}
        emptyText="Объявлений пока нет"
      >
        <></>
      </FeedState>

      {!state.loading && state.items.length > 0 && (
        <>
          <AdGrid
            items={state.items}
            onClick={handleAdClick}
            onToggleFavorite={handleFavorite}
            pendingIds={pendingIds}
          />
          {state.error && <p className={style.feedback}>{state.error}</p>}
          {state.hasMore && (
            <div className={style.loadMore}>
              <Button
                variant="outlined"
                text={state.loadingMore ? "Загрузка…" : "Показать ещё"}
                onClick={onLoadMore}
                disabled={state.loadingMore}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
