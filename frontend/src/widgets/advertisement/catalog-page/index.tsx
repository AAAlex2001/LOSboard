"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { CatalogTopBar } from "@/src/widgets/advertisement/catalog-topbar";
import { CatalogFeed } from "@/src/widgets/advertisement/catalog-feed";
import { PlaceAdSidebar } from "@/src/widgets/advertisement/place-ad-sidebar";
import { CrumbsBar } from "@/src/shared/ui/PageBar";
import type { BreadcrumbItem } from "@/src/shared/ui/Breadcrumbs";
import {
  URGENT_CATEGORY,
  URGENT_CATEGORY_ID,
  useCategories,
  type Category,
  type Subcategory,
} from "@/src/entities/category";
import { useAdvertisementList } from "@/src/features/advertisement";
import style from "./style.module.scss";

interface CatalogPageProps {
  initialCategorySlug?: string;
  initialSubcategorySlug?: string;
}

export const CatalogPage = ({
  initialCategorySlug,
  initialSubcategorySlug,
}: CatalogPageProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urgentParam = searchParams.get("urgent") === "1";
  const { categories } = useCategories();
  const activeCategory = initialCategorySlug
    ? categories.find((c) => c.slug === initialCategorySlug) ?? null
    : null;
  const activeSubcategory =
    activeCategory && initialSubcategorySlug
      ? activeCategory.subcategories.find(
          (s) => s.slug === initialSubcategorySlug
        ) ?? null
      : null;

  const filtersReady = !initialCategorySlug || activeCategory !== null;

  const { state, setCategory, setSubcategory, reset, patchItem } =
    useAdvertisementList({ enabled: filtersReady });

  useEffect(() => {
    if (!filtersReady) return;
    if (urgentParam && !initialCategorySlug) {
      setCategory(URGENT_CATEGORY);
      return;
    }
    if (!initialCategorySlug) {
      reset();
      return;
    }
    if (activeSubcategory) {
      setSubcategory(activeSubcategory, activeCategory);
    } else if (activeCategory) {
      setCategory(activeCategory);
    }
  }, [
    filtersReady,
    urgentParam,
    activeCategory?.id,
    activeSubcategory?.id,
    initialCategorySlug,
  ]);

  const handleSelectCategory = (cat: Category | null) => {
    if (!cat) {
      router.push("/");
      return;
    }
    if (cat.id === URGENT_CATEGORY_ID) {
      router.push("/?urgent=1");
      return;
    }
    router.push(`/category/${cat.slug}`);
  };

  const handleSelectSubcategory = (
    sub: Subcategory | null,
    cat: Category | null
  ) => {
    if (!cat) {
      router.push("/");
      return;
    }
    if (cat.id === URGENT_CATEGORY_ID) {
      router.push("/?urgent=1");
      return;
    }
    if (sub) {
      router.push(`/category/${cat.slug}/${sub.slug}`);
    } else {
      router.push(`/category/${cat.slug}`);
    }
  };

  const handleReset = () => {
    router.push("/");
  };

  const displayCategory = state.urgentOnly ? URGENT_CATEGORY : activeCategory;
  const displaySubcategory = state.urgentOnly ? null : activeSubcategory;
  const hasFilter = Boolean(displayCategory || displaySubcategory);

  const crumbItems: BreadcrumbItem[] = hasFilter
    ? [
        { label: "Главная", onClick: handleReset },
        ...(displayCategory
          ? [
              {
                label: displayCategory.name,
                onClick: displaySubcategory
                  ? () => handleSelectSubcategory(null, displayCategory)
                  : undefined,
              },
            ]
          : []),
        ...(displaySubcategory ? [{ label: displaySubcategory.name }] : []),
      ]
    : [];

  return (
    <main className={style.page}>
      <Header
        onSelectCategory={handleSelectCategory}
        onSelectSubcategory={handleSelectSubcategory}
      />
      {hasFilter && <CrumbsBar items={crumbItems} />}
      <div className={style.content}>
        <div className={style.layout}>
          <div className={style.topbarSlot}>
            <CatalogTopBar
              category={displayCategory}
              subcategory={displaySubcategory}
              onSelectCategory={handleSelectCategory}
              onSelectSubcategory={handleSelectSubcategory}
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
};
