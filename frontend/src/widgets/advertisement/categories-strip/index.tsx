"use client";

import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import ChevronRightIcon from "@/src/shared/ui/Icons/ChevronRightIcon";
import { Loader } from "@/src/shared/ui/Loader";
import {
  CategoryCard,
  URGENT_CATEGORY,
  useCategories,
  type Category,
} from "@/src/entities/category";
import style from "./style.module.scss";

interface CategoriesStripProps {
  activeCategoryId: number | null;
  onSelect: (category: Category) => void;
}

export const CategoriesStrip = ({
  activeCategoryId,
  onSelect,
}: CategoriesStripProps) => {
  const { categories, loading } = useCategories();
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: "auto", spacing: 4 },
    mode: "free-snap",
    drag: true,
    rubberband: false,
    slideChanged(slider) {
      const rel = slider.track.details.rel;
      const max = slider.track.details.maxIdx;
      setAtStart(rel <= 0);
      setAtEnd(rel >= max);
    },
    created(slider) {
      const max = slider.track.details.maxIdx;
      setAtStart(true);
      setAtEnd(max === 0);
    },
    updated(slider) {
      const rel = slider.track.details.rel;
      const max = slider.track.details.maxIdx;
      setAtStart(rel <= 0);
      setAtEnd(rel >= max);
    },
  });

  if (loading) {
    return (
      <div className={`${style.strip} ${style.stripLoading}`}>
        <Loader />
      </div>
    );
  }

  const displayCategories = [URGENT_CATEGORY, ...categories];

  return (
    <div className={style.strip}>
      <div ref={sliderRef} className={`keen-slider ${style.slider}`}>
        {displayCategories.map((cat) => (
          <div key={cat.id} className={`keen-slider__slide ${style.slide}`}>
            <CategoryCard
              category={cat}
              active={activeCategoryId === cat.id}
              onClick={onSelect}
            />
          </div>
        ))}
      </div>

      {!atStart && (
        <button
          type="button"
          className={`${style.navBtn} ${style.navLeft}`}
          onClick={() => instanceRef.current?.prev()}
          aria-label="Прокрутить влево"
        >
          <ChevronRightIcon />
        </button>
      )}
      {!atEnd && (
        <button
          type="button"
          className={`${style.navBtn} ${style.navRight}`}
          onClick={() => instanceRef.current?.next()}
          aria-label="Прокрутить вправо"
        >
          <ChevronRightIcon />
        </button>
      )}
    </div>
  );
};
