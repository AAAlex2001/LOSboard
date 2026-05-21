"use client";

import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { CatalogTopBar } from "@/src/widgets/advertisement/catalog-topbar";
import { CatalogFeed } from "@/src/widgets/advertisement/catalog-feed";
import { PlaceAdSidebar } from "@/src/widgets/advertisement/place-ad-sidebar";
import { useCategories, type Category, type Subcategory } from "@/src/entities/category";
import { useAdvertisementList } from "@/src/features/advertisement";
import style from "./page.module.scss";

export default function HomePage() {
  const { state, setCategory, setSubcategory, reset, patchItem } =
    useAdvertisementList();
  const { categories } = useCategories();

  const activeCategory =
    state.categoryId != null
      ? categories.find((c) => c.id === state.categoryId) ?? null
      : null;
  const activeSubcategory =
    state.subcategoryId != null && activeCategory
      ? activeCategory.subcategories.find((s) => s.id === state.subcategoryId) ?? null
      : null;

  const handleSelectCategory = (cat: Category | null) => {
    setCategory(cat);
  };

  const handleSelectSubcategory = (
    sub: Subcategory | null,
    cat: Category | null
  ) => {
    setSubcategory(sub, cat);
  };

  return (
    <main className={style.page}>
      <Header
        onSelectCategory={handleSelectCategory}
        onSelectSubcategory={handleSelectSubcategory}
      />
      <div className={style.content}>
        <div className={style.layout}>
          <div className={style.topbarSlot}>
            <CatalogTopBar
              category={activeCategory}
              subcategory={activeSubcategory}
              onSelectCategory={handleSelectCategory}
              onSelectSubcategory={handleSelectSubcategory}
              onReset={reset}
            />
          </div>
          <div className={style.feedSlot}>
            <CatalogFeed state={state} onItemPatch={patchItem} />
          </div>
          <div className={style.sidebarSlot}>
            <PlaceAdSidebar />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
