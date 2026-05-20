"use client";

import { useEffect, useRef, useState } from "react";
import ChevronRightIcon from "@/src/shared/ui/Icons/ChevronRightIcon";
import { Loader } from "@/src/shared/ui/Loader";
import {
  CategoryCard,
  useCategories,
  type Category,
} from "@/src/entities/category";
import style from "./style.module.scss";

interface CategoriesStripProps {
  activeCategoryId: number | null;
  onSelect: (category: Category) => void;
}

const SCROLL_STEP = 248;

export const CategoriesStrip = ({
  activeCategoryId,
  onSelect,
}: CategoriesStripProps) => {
  const { categories, loading } = useCategories();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const node = scrollRef.current;
    if (!node) return;
    setCanScrollLeft(node.scrollLeft > 0);
    setCanScrollRight(node.scrollLeft + node.clientWidth < node.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollState();
    const node = scrollRef.current;
    if (!node) return;
    node.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      node.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [categories.length]);

  const scrollBy = (direction: -1 | 1) => {
    scrollRef.current?.scrollBy({
      left: SCROLL_STEP * direction,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className={`${style.strip} ${style.stripLoading}`}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={style.strip}>
      <div className={style.scrollWrap} ref={scrollRef}>
        <div className={style.list}>
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              active={activeCategoryId === cat.id}
              onClick={onSelect}
            />
          ))}
        </div>
      </div>

      {canScrollLeft && (
        <button
          type="button"
          className={`${style.navBtn} ${style.navLeft}`}
          onClick={() => scrollBy(-1)}
          aria-label="Прокрутить влево"
        >
          <ChevronRightIcon />
        </button>
      )}
      {canScrollRight && (
        <button
          type="button"
          className={`${style.navBtn} ${style.navRight}`}
          onClick={() => scrollBy(1)}
          aria-label="Прокрутить вправо"
        >
          <ChevronRightIcon />
        </button>
      )}
    </div>
  );
};
