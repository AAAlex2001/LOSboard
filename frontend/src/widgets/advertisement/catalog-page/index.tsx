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

function buildUrl(opts: {
  urgent?: boolean;
  categorySlug?: string | null;
  subcategorySlug?: string | null;
}): string {
  const params = new URLSearchParams();
  if (opts.urgent) params.set("urgent", "1");
  if (opts.categorySlug) params.set("cat", opts.categorySlug);
  if (opts.subcategorySlug) params.set("sub", opts.subcategorySlug);
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

export const CatalogPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urgentParam = searchParams.get("urgent") === "1";
  const categorySlugParam = searchParams.get("cat");
  const subcategorySlugParam = searchParams.get("sub");

  const { categories } = useCategories();

  const activeCategory = categorySlugParam
    ? categories.find((c) => c.slug === categorySlugParam) ?? null
    : null;
  const activeSubcategory =
    activeCategory && subcategorySlugParam
      ? activeCategory.subcategories.find(
          (s) => s.slug === subcategorySlugParam
        ) ?? null
      : null;

  const filtersReady = !categorySlugParam || activeCategory !== null;

  const { state, setFilters, patchItem, loadMore } = useAdvertisementList({
    enabled: filtersReady,
  });

  useEffect(() => {
    if (!filtersReady) return;
    setFilters({
      categoryId: activeCategory?.id ?? null,
      subcategoryId: activeSubcategory?.id ?? null,
      urgentOnly: urgentParam,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filtersReady,
    urgentParam,
    activeCategory?.id,
    activeSubcategory?.id,
  ]);

  const navigate = (href: string) => router.push(href, { scroll: false });

  const handleSelectCategory = (cat: Category | null) => {
    if (!cat) {
      navigate(buildUrl({ urgent: urgentParam }));
      return;
    }
    if (cat.id === URGENT_CATEGORY_ID) {
      navigate(buildUrl({ urgent: true }));
      return;
    }
    navigate(buildUrl({ urgent: urgentParam, categorySlug: cat.slug }));
  };

  const handleSelectSubcategory = (
    sub: Subcategory | null,
    cat: Category | null
  ) => {
    if (!cat) {
      navigate(buildUrl({ urgent: urgentParam }));
      return;
    }
    if (cat.id === URGENT_CATEGORY_ID) {
      navigate(buildUrl({ urgent: true }));
      return;
    }
    navigate(
      buildUrl({
        urgent: urgentParam,
        categorySlug: cat.slug,
        subcategorySlug: sub?.slug,
      })
    );
  };

  const handleReset = () => {
    navigate("/");
  };

  const hasFilter = Boolean(activeCategory || activeSubcategory || urgentParam);

  const feedTitle = (() => {
    if (urgentParam && activeSubcategory) {
      return `Срочные · ${activeCategory?.name ?? ""} · ${activeSubcategory.name}`;
    }
    if (urgentParam && activeCategory) {
      return `Срочные · ${activeCategory.name}`;
    }
    if (urgentParam) return "Срочные объявления";
    if (activeSubcategory) return `${activeCategory?.name ?? ""} · ${activeSubcategory.name}`;
    if (activeCategory) return activeCategory.name;
    return "Все объявления";
  })();

  const crumbItems: BreadcrumbItem[] = hasFilter
    ? [
        { label: "Главная", onClick: handleReset },
        ...(urgentParam
          ? [
              {
                label: URGENT_CATEGORY.name,
                onClick:
                  activeCategory || activeSubcategory
                    ? () => navigate(buildUrl({ urgent: true }))
                    : undefined,
              },
            ]
          : []),
        ...(activeCategory
          ? [
              {
                label: activeCategory.name,
                onClick: activeSubcategory
                  ? () =>
                      navigate(
                        buildUrl({
                          urgent: urgentParam,
                          categorySlug: activeCategory.slug,
                        })
                      )
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
              category={activeCategory}
              subcategory={activeSubcategory}
              urgentOnly={urgentParam}
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
              onLoadMore={loadMore}
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
