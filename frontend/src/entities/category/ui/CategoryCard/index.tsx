"use client";

import { getCategoryIcon } from "@/src/shared/ui/Icons/Categories";
import type { Category } from "../../model/types";
import style from "./style.module.scss";

interface CategoryCardProps {
  category: Category;
  active?: boolean;
  urgentTone?: boolean;
  onClick?: (category: Category) => void;
}

export const CategoryCard = ({
  category,
  active,
  urgentTone,
  onClick,
}: CategoryCardProps) => {
  const Icon = getCategoryIcon(category.slug);
  const urgent = category.slug === "urgent" || urgentTone;

  return (
    <button
      type="button"
      className={`${style.card} ${urgent ? style.cardUrgent : ""} ${
        active ? style.cardActive : ""
      }`}
      onClick={() => onClick?.(category)}
      title={category.name}
    >
      <span className={style.iconWrap} aria-hidden="true">
        {Icon ? (
          <Icon className={style.icon} />
        ) : (
          <span className={style.iconFallback}>
            {category.name.charAt(0).toUpperCase()}
          </span>
        )}
      </span>
      <span className={style.label}>{category.name}</span>
    </button>
  );
};
