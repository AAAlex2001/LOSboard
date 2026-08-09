"use client";

import { useRouter } from "next/navigation";
import { FeedState } from "@/src/shared/ui/FeedState";
import { AdGrid } from "@/src/shared/ui/AdGrid";
import { type Advertisement } from "@/src/entities/advertisement";
import { useMyAdvertisements } from "@/src/features/advertisement";
import { buildAdvertisementUrl } from "@/src/shared/lib/slug";

export const MyAdsFeed = () => {
  const router = useRouter();
  const { items, loading, error } = useMyAdvertisements();

  const handleEdit = (ad: Advertisement) => {
    router.push(`/my-ads/${ad.id}/edit`);
  };

  const handleCardClick = (ad: Advertisement) => {
    if (ad.moderation_status !== "approved") {
      router.push(`/my-ads/${ad.id}/edit`);
      return;
    }

    router.push(buildAdvertisementUrl(ad.id, ad.title));
  };

  return (
    <FeedState
      loading={loading}
      error={error}
      empty={items.length === 0}
      emptyText="У вас пока нет объявлений"
    >
      <AdGrid items={items} onClick={handleCardClick} onEdit={handleEdit} />
    </FeedState>
  );
};
