"use client";

import { useState } from "react";
import { Modal } from "@/src/shared/ui/Modal";
import { Button } from "@/src/shared/ui/Button";
import SearchIcon from "@/src/shared/ui/Icons/SearchIcon";
import {
  CategoriesPanel,
  type Category,
  type Subcategory,
} from "@/src/entities/category";
import { CategoriesStrip } from "@/src/widgets/categories-strip";
import { AdBanner } from "@/src/entities/ad-banner";
import style from "./style.module.scss";

interface CatalogTopBarProps {
  category: Category | null;
  subcategory: Subcategory | null;
  onSelectCategory: (cat: Category | null) => void;
  onSelectSubcategory: (sub: Subcategory | null, cat: Category | null) => void;
  onReset: () => void;
}

export const CatalogTopBar = ({
  category,
  subcategory,
  onSelectCategory,
  onSelectSubcategory,
  onReset,
}: CatalogTopBarProps) => {
  const [pickerOpen, setPickerOpen] = useState(false);

  const handlePickCategory = (cat: Category) => {
    onSelectCategory(cat);
    onSelectSubcategory(null, cat);
    setPickerOpen(false);
  };

  const handlePickSubcategory = (sub: Subcategory, cat: Category) => {
    onSelectSubcategory(sub, cat);
    setPickerOpen(false);
  };

  const headerLabel =
    subcategory?.name ?? category?.name ?? "Выберите категорию";
  const hasFilter = Boolean(category || subcategory);

  return (
    <div className={style.topbar}>
      <div className={style.heroHeading}>
        <h1 className={style.title}>{headerLabel}</h1>
        {hasFilter && (
          <button type="button" className={style.resetBtn} onClick={onReset}>
            Сбросить
          </button>
        )}
      </div>

      <div className={style.mobileBtn}>
        <Button
          type="button"
          variant="filled"
          color="blue"
          onClick={() => setPickerOpen(true)}
          fullWidth
        >
          <SearchIcon color="#FFFFFF" />
          Категории
        </Button>
      </div>

      <div className={style.strip}>
        <CategoriesStrip
          activeCategoryId={category?.id ?? null}
          onSelect={handlePickCategory}
        />
      </div>

      <div className={style.promoTablet}>
        <AdBanner variant="wide" />
      </div>

      <div className={style.promoDesktop}>
        <AdBanner variant="promo" />
        <AdBanner variant="promo" />
        <AdBanner variant="promo" />
      </div>

      <Modal open={pickerOpen} onClose={() => setPickerOpen(false)}>
        <CategoriesPanel
          onSelectCategory={handlePickCategory}
          onSelectSubcategory={handlePickSubcategory}
        />
      </Modal>
    </div>
  );
};
