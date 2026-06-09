"use client";

import { useRouter } from "next/navigation";
import { FeedState } from "@/src/shared/ui/FeedState";
import { AdGrid } from "@/src/shared/ui/AdGrid";
import { type Advertisement } from "@/src/entities/advertisement";
import { useFavorite, useFavorites } from "@/src/features/favorite";
import { buildAdvertisementUrl } from "@/src/shared/lib/slug";

export const FavoritesFeed = () => {
  const router = useRouter();
  const { items, loading, error, patchItem } = useFavorites();
  const { toggle, pendingIds } = useFavorite();

  const handleCardClick = (ad: Advertisement) => {
    router.push(buildAdvertisementUrl(ad.id, ad.title));
  };

  const handleFavorite = async (ad: Advertisement) => {
    const updated = await toggle(ad);
    if (updated) patchItem(updated);
  };

  return (
    <FeedState
      loading={loading}
      error={error}
      empty={items.length === 0}
      emptyText="В избранном пока ничего нет"
    >
      <AdGrid
        items={items}
        onClick={handleCardClick}
        onToggleFavorite={handleFavorite}
        pendingIds={pendingIds}
      />
    </FeedState>
  );
};
