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

function buildUrgentUrl(categorySlug?: string, subcategorySlug?: string): string {
  const params = new URLSearchParams();
  params.set("urgent", "1");
  if (categorySlug) params.set("category", categorySlug);
  if (subcategorySlug) params.set("subcategory", subcategorySlug);
  return `/?${params.toString()}`;
}

export const CatalogPage = ({
  initialCategorySlug,
  initialSubcategorySlug,
}: CatalogPageProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urgentParam = searchParams.get("urgent") === "1";
  const urgentCategorySlug = urgentParam ? searchParams.get("category") : null;
  const urgentSubcategorySlug = urgentParam ? searchParams.get("subcategory") : null;

  const { categories } = useCategories();

  const effectiveCategorySlug = initialCategorySlug ?? urgentCategorySlug ?? null;
  const effectiveSubcategorySlug =
    initialSubcategorySlug ?? urgentSubcategorySlug ?? null;

  const activeCategory = effectiveCategorySlug
    ? categories.find((c) => c.slug === effectiveCategorySlug) ?? null
    : null;
  const activeSubcategory =
    activeCategory && effectiveSubcategorySlug
      ? activeCategory.subcategories.find(
          (s) => s.slug === effectiveSubcategorySlug
        ) ?? null
      : null;

  const filtersReady = !effectiveCategorySlug || activeCategory !== null;

  const { state, setFilters, patchItem } = useAdvertisementList({
    enabled: filtersReady,
  });

  useEffect(() => {
    if (!filtersReady) return;
    setFilters({
      categoryId: activeCategory?.id ?? null,
      subcategoryId: activeSubcategory?.id ?? null,
      urgentOnly: urgentParam,
    });
  }, [
    filtersReady,
    urgentParam,
    activeCategory?.id,
    activeSubcategory?.id,
  ]);

  const navigate = (href: string) => router.push(href, { scroll: false });

  const handleSelectCategory = (cat: Category | null) => {
    if (!cat) {
      if (state.urgentOnly) {
        navigate(buildUrgentUrl());
        return;
      }
      navigate("/");
      return;
    }
    if (cat.id === URGENT_CATEGORY_ID) {
      navigate(buildUrgentUrl());
      return;
    }
    if (state.urgentOnly) {
      navigate(buildUrgentUrl(cat.slug));
      return;
    }
    navigate(`/category/${cat.slug}`);
  };

  const handleSelectSubcategory = (
    sub: Subcategory | null,
    cat: Category | null
  ) => {
    if (!cat) {
      if (state.urgentOnly) {
        navigate(buildUrgentUrl());
        return;
      }
      navigate("/");
      return;
    }
    if (cat.id === URGENT_CATEGORY_ID) {
      navigate(buildUrgentUrl());
      return;
    }
    if (state.urgentOnly) {
      navigate(buildUrgentUrl(cat.slug, sub?.slug));
      return;
    }
    if (sub) {
      navigate(`/category/${cat.slug}/${sub.slug}`);
    } else {
      navigate(`/category/${cat.slug}`);
    }
  };

  const handleReset = () => {
    navigate("/");
  };

  const topbarCategory = state.urgentOnly && !activeCategory ? null : activeCategory;
  const topbarSubcategory = activeSubcategory;
  const hasFilter = Boolean(activeCategory || activeSubcategory || state.urgentOnly);

  const feedTitle = (() => {
    if (state.urgentOnly && activeSubcategory) {
      return `Срочные · ${activeCategory?.name ?? ""} · ${activeSubcategory.name}`;
    }
    if (state.urgentOnly && activeCategory) {
      return `Срочные · ${activeCategory.name}`;
    }
    if (state.urgentOnly) return "Срочные объявления";
    if (activeSubcategory) return activeSubcategory.name;
    if (activeCategory) return activeCategory.name;
    return "Все объявления";
  })();

  const crumbItems: BreadcrumbItem[] = hasFilter
    ? [
        { label: "Главная", onClick: handleReset },
        ...(state.urgentOnly
          ? [
              {
                label: URGENT_CATEGORY.name,
                onClick:
                  activeCategory || activeSubcategory
                    ? () => navigate(buildUrgentUrl())
                    : undefined,
              },
            ]
          : []),
        ...(activeCategory
          ? [
              {
                label: activeCategory.name,
                onClick: activeSubcategory
                  ? () => handleSelectSubcategory(null, activeCategory)
                  : undefined,
              },
            ]
          : []),
        ...(activeSubcategory ? [{ label: activeSubcategory.name }] : []),
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
              category={topbarCategory}
              subcategory={topbarSubcategory}
              urgentOnly={state.urgentOnly}
              onSelectCategory={handleSelectCategory}
              onSelectSubcategory={handleSelectSubcategory}
              onResetFilters={handleReset}
            />
          </div>
          <div className={style.feedSlot}>
            <CatalogFeed
              state={state}
              title={feedTitle}
              onItemPatch={patchItem}
            />
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
