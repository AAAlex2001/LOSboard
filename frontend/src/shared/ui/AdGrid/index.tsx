import { Fragment } from "react";
import { AdCard, type Advertisement } from "@/src/entities/advertisement";
import style from "./style.module.scss";

interface AdGridProps {
  items: Advertisement[];
  onClick?: (ad: Advertisement) => void;
  onToggleFavorite?: (ad: Advertisement) => void;
  onEdit?: (ad: Advertisement) => void;
  pendingIds?: Set<number>;
  feedBanners?: React.ReactNode[];
  feedInterval?: number;
}

export const AdGrid = ({
  items,
  onClick,
  onToggleFavorite,
  onEdit,
  pendingIds,
  feedBanners,
  feedInterval,
}: AdGridProps) => (
  <div className={style.grid}>
    {items.map((ad, index) => {
      const bannerIndex =
        feedBanners && feedInterval && (index + 1) % feedInterval === 0
          ? Math.floor((index + 1) / feedInterval) - 1
          : -1;
      const banner =
        bannerIndex >= 0 ? feedBanners?.[bannerIndex] : undefined;

      return (
        <Fragment key={ad.id}>
          <AdCard
            advertisement={ad}
            onClick={onClick}
            onToggleFavorite={onToggleFavorite}
            onEdit={onEdit}
            favoritePending={pendingIds?.has(ad.id)}
          />
          {banner && <div className={style.feedBanner}>{banner}</div>}
        </Fragment>
      );
    })}
  </div>
);
