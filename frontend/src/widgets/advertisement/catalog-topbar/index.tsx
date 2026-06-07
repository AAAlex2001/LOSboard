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
import { CategoriesStrip } from "@/src/widgets/advertisement/categories-strip";
import { PromoCarousel } from "@/src/widgets/advertisement/promo-carousel";
import { useMainTopBanners } from "@/src/entities/banner";
import { useSiteSettings } from "@/src/entities/content";
import { Breadcrumbs } from "@/src/shared/ui/Breadcrumbs";
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
  const banners = useMainTopBanners();
  const settings = useSiteSettings();
  const ageLabel = settings?.ad_age_label;
  const siteLabel = settings?.ad_site_label;
  const placeholderText = settings?.ad_placeholder_text;

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
      {hasFilter ? (
        <div className={style.breadcrumbs}>
          <Breadcrumbs
            items={[
              { label: "Главная", onClick: onReset },
              ...(category
                ? [
                    {
                      label: category.name,
                      onClick: subcategory
                        ? () => onSelectSubcategory(null, category)
                        : undefined,
                    },
                  ]
                : []),
              ...(subcategory ? [{ label: subcategory.name }] : []),
            ]}
          />
        </div>
      ) : (
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
          activeCategoryId={category?.id ?? null}
          onSelect={handlePickCategory}
        />
      </div>

      <div className={style.promoTablet}>
        <PromoCarousel
          banners={banners}
          variant="wide"
          slidesPerView={1}
          ageLabel={ageLabel}
          siteLabel={siteLabel}
          placeholderText={placeholderText}
        />
      </div>

      <div className={style.promoDesktop}>
        <PromoCarousel
          banners={banners}
          variant="promo"
          slidesPerView={3}
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
