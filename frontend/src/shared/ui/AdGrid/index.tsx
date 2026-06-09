import { AdCard, type Advertisement } from "@/src/entities/advertisement";
import style from "./style.module.scss";

interface AdGridProps {
  items: Advertisement[];
  onClick?: (ad: Advertisement) => void;
  onToggleFavorite?: (ad: Advertisement) => void;
  onEdit?: (ad: Advertisement) => void;
  pendingIds?: Set<number>;
}

/**
 * Сетка карточек. Передаёт обработчики в AdCard как есть: режим избранного и
 * режим редактирования различаются только набором переданных пропсов.
 */
export const AdGrid = ({
  items,
  onClick,
  onToggleFavorite,
  onEdit,
  pendingIds,
}: AdGridProps) => (
  <div className={style.grid}>
    {items.map((ad) => (
      <AdCard
        key={ad.id}
        advertisement={ad}
        onClick={onClick}
        onToggleFavorite={onToggleFavorite}
        onEdit={onEdit}
        favoritePending={pendingIds?.has(ad.id)}
      />
    ))}
  </div>
);
