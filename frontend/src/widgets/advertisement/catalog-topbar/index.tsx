"use client";

import { useState } from "react";
import { Modal } from "@/src/shared/ui/Modal";
import { Button } from "@/src/shared/ui/Button";
import SearchIcon from "@/src/shared/ui/Icons/SearchIcon";
import {
  CategoriesPanel,
  URGENT_CATEGORY_ID,
  useCategories,
  type Category,
  type Subcategory,
} from "@/src/entities/category";
import { CategoriesStrip } from "@/src/widgets/advertisement/categories-strip";
import { PromoCarousel } from "@/src/widgets/advertisement/promo-carousel";
import {
  SubcategoryChips,
  type SubcategoryChipItem,
} from "@/src/widgets/advertisement/subcategory-chips";
import { useMainTopBanners } from "@/src/entities/banner";
import { useSiteSettings } from "@/src/entities/content";
import style from "./style.module.scss";

interface CatalogTopBarProps {
  category: Category | null;
  subcategory: Subcategory | null;
  urgentOnly: boolean;
  onSelectCategory: (cat: Category | null) => void;
  onSelectSubcategory: (sub: Subcategory | null, cat: Category | null) => void;
}

export const CatalogTopBar = ({
  category,
  subcategory,
  urgentOnly,
  onSelectCategory,
  onSelectSubcategory,
}: CatalogTopBarProps) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const banners = useMainTopBanners();
  const settings = useSiteSettings();
  const { categories } = useCategories();
  const ageLabel = settings?.ad_age_label;
  const siteLabel = settings?.ad_site_label;
  const placeholderText = settings?.ad_placeholder_text;

  const handlePickCategory = (cat: Category) => {
    setPickerOpen(false);
    onSelectCategory(cat);
  };

  const handlePickSubcategory = (sub: Subcategory, cat: Category) => {
    setPickerOpen(false);
    onSelectSubcategory(sub, cat);
  };

  const headerLabel =
    subcategory?.name ?? category?.name ?? "Выберите категорию";
  const hasFilter = Boolean(category || subcategory || urgentOnly);

  const showCategoryChips = urgentOnly && !category;
  const showSubcategoryChips = !showCategoryChips && Boolean(category);

  let chipsItems: SubcategoryChipItem[] = [];
  let chipsActiveId: number | null = null;
  let chipsAllLabel = "Все";

  if (showCategoryChips) {
    chipsItems = categories
      .filter((c) => c.id !== URGENT_CATEGORY_ID)
      .map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
    chipsActiveId = null;
    chipsAllLabel = "Все категории";
  } else if (showSubcategoryChips && category) {
    chipsItems = category.subcategories.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
    }));
    chipsActiveId = subcategory?.id ?? null;
    chipsAllLabel = "Все подкатегории";
  }

  const handlePickChip = (item: SubcategoryChipItem | null) => {
    if (showCategoryChips) {
      if (!item) {
        onSelectCategory(null);
        return;
      }
      const cat = categories.find((c) => c.id === item.id) ?? null;
      onSelectCategory(cat);
      return;
    }
    if (!category) return;
    if (!item) {
      onSelectSubcategory(null, category);
      return;
    }
    const sub =
      category.subcategories.find((s) => s.id === item.id) ?? null;
    onSelectSubcategory(sub, category);
  };

  const chipsVariant = urgentOnly ? "orange" : "blue";

  return (
    <div className={style.topbar}>
      {!hasFilter && (
        <div className={style.heroHeading}>
          <h1 className={style.title}>{headerLabel}</h1>
        </div>
      )}

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
          activeCategoryId={
            urgentOnly && !category ? URGENT_CATEGORY_ID : category?.id ?? null
          }
          urgentTone={urgentOnly}
          onSelect={handlePickCategory}
        />
      </div>

      {chipsItems.length > 0 && (
        <div className={style.chips}>
          <SubcategoryChips
            items={chipsItems}
            activeId={chipsActiveId}
            onSelect={handlePickChip}
            allLabel={chipsAllLabel}
            variant={chipsVariant}
          />
        </div>
      )}

      <div className={style.promo}>
        <PromoCarousel
          banners={banners}
          ageLabel={ageLabel}
          siteLabel={siteLabel}
          placeholderText={placeholderText}
        />
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
