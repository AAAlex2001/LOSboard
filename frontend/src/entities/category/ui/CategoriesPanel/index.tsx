"use client";

import { useState } from "react";
import { Loader } from "@/src/shared/ui/Loader";
import ArrowLeftIcon from "@/src/shared/ui/Icons/ArrowLeftIcon";
import { CategoryRow } from "../CategoryRow";
import { useCategories } from "../../model/useCategories";
import type { Category, Subcategory } from "../../model/types";
import style from "./style.module.scss";

interface CategoriesPanelProps {
  onSelectSubcategory?: (subcategory: Subcategory, category: Category) => void;
  onSelectCategory?: (category: Category) => void;
}

export const CategoriesPanel = ({
  onSelectSubcategory,
  onSelectCategory,
}: CategoriesPanelProps) => {
  const { categories, loading, error } = useCategories();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selected = selectedId
    ? categories.find((c) => c.id === selectedId) || null
    : null;

  if (loading) {
    return (
      <div className={style.panel}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={style.panel}>
        <p className={style.error}>{error}</p>
      </div>
    );
  }

  if (selected) {
    return (
      <div className={style.panel}>
        <div className={style.subcategory}>
          <div className={style.subcategoryHeader}>
            <button
              type="button"
              className={style.backBtn}
              onClick={() => setSelectedId(null)}
              aria-label="Назад"
            >
              <ArrowLeftIcon />
            </button>
            <span className={style.subcategoryTitle}>{selected.name}</span>
          </div>

          <div className={style.subcategoryList}>
            {selected.subcategories.length === 0 ? (
              <span className={style.empty}>Подкатегорий нет</span>
            ) : (
              selected.subcategories.map((sub) => (
                <CategoryRow
                  key={sub.id}
                  label={sub.name}
                  variant="plain"
                  onClick={() => onSelectSubcategory?.(sub, selected)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={style.panel}>
      <div className={style.list}>
        {categories.map((cat) => (
          <CategoryRow
            key={cat.id}
            label={cat.name}
            variant="boxed"
            onClick={() => {
              if (cat.subcategories.length > 0) {
                setSelectedId(cat.id);
              } else {
                onSelectCategory?.(cat);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};
