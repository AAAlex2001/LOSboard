"use client";

import { useRouter } from "next/navigation";
import { Loader } from "@/src/shared/ui/Loader";
import { AdCard, type Advertisement } from "@/src/entities/advertisement";
import { useFavorite, useFavorites } from "@/src/features/favorite";
import { buildAdvertisementUrl } from "@/src/shared/lib/slug";
import style from "./style.module.scss";

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

  if (loading) {
    return (
      <div className={style.feedback}>
        <Loader />
      </div>
    );
  }
  if (error) {
    return <p className={style.feedback}>{error}</p>;
  }
  if (items.length === 0) {
    return <p className={style.feedback}>В избранном пока ничего нет</p>;
  }

  return (
    <div className={style.grid}>
      {items.map((ad) => (
        <AdCard
          key={ad.id}
          advertisement={ad}
          onClick={handleCardClick}
          onToggleFavorite={handleFavorite}
          favoritePending={pendingIds.has(ad.id)}
        />
      ))}
    </div>
  );
};
