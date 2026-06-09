"use client";

import classNames from "classnames";
import style from "./style.module.scss";

export interface SubcategoryChipItem {
  id: number;
  name: string;
  slug: string;
}

interface SubcategoryChipsProps {
  items: SubcategoryChipItem[];
  activeId: number | null;
  onSelect: (item: SubcategoryChipItem | null) => void;
  allLabel?: string;
  variant?: "blue" | "orange";
}

export const SubcategoryChips = ({
  items,
  activeId,
  onSelect,
  allLabel = "Все",
  variant = "blue",
}: SubcategoryChipsProps) => {
  if (items.length === 0) return null;

  return (
    <div className={classNames(style.chips, style[`chips_${variant}`])}>
      <button
        type="button"
        className={classNames(style.chip, {
          [style.chipActive]: activeId === null,
        })}
        onClick={() => onSelect(null)}
      >
        {allLabel}
      </button>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={classNames(style.chip, {
            [style.chipActive]: activeId === item.id,
          })}
          onClick={() => onSelect(item)}
          title={item.name}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};
