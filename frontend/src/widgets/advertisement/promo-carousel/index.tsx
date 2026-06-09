"use client";

import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { AdBanner } from "@/src/entities/ad-banner";
import type { Banner } from "@/src/entities/banner";
import ArrowLeftIcon from "@/src/shared/ui/Icons/ArrowLeftIcon";
import ArrowRightIcon from "@/src/shared/ui/Icons/ArrowRightIcon";
import style from "./style.module.scss";

interface PromoCarouselProps {
  banners: Banner[];
  ageLabel?: string;
  siteLabel?: string;
  placeholderText?: string;
}

function fillSlots(arr: Banner[], min: number): Array<Banner | null> {
  if (arr.length >= min) return arr;
  return [...arr, ...Array(min - arr.length).fill(null)];
}

export const PromoCarousel = ({
  banners,
  ageLabel,
  siteLabel,
  placeholderText,
}: PromoCarouselProps) => {
  const slots = fillSlots(banners, 3);

  const [rel, setRel] = useState(0);
  const [maxIdx, setMaxIdx] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: false,
    slides: { perView: 1, spacing: 25 },
    breakpoints: {
      "(min-width: 1440px)": {
        slides: { perView: 3, spacing: 25 },
      },
    },
    detailsChanged: (slider) => {
      setRel(slider.track.details.rel);
      setMaxIdx(slider.track.details.maxIdx);
    },
  });

  const canRotate = maxIdx > 0;
  const isAtStart = rel <= 0;
  const isAtEnd = rel >= maxIdx;

  if (slots.length === 0) return null;

  return (
    <div className={style.carousel}>
      {canRotate && !isAtStart && (
        <button
          type="button"
          className={`${style.arrow} ${style.arrowPrev}`}
          onClick={() => instanceRef.current?.prev()}
          aria-label="Предыдущий баннер"
        >
          <ArrowLeftIcon />
        </button>
      )}
      <div ref={sliderRef} className="keen-slider">
        {slots.map((banner, i) => (
          <div key={banner?.id ?? `empty-${i}`} className="keen-slider__slide">
            <AdBanner
              variant="carousel"
              banner={banner}
              ageLabel={ageLabel}
              siteLabel={siteLabel}
              placeholderText={placeholderText}
            />
          </div>
        ))}
      </div>
      {canRotate && !isAtEnd && (
        <button
          type="button"
          className={`${style.arrow} ${style.arrowNext}`}
          onClick={() => instanceRef.current?.next()}
          aria-label="Следующий баннер"
        >
          <ArrowRightIcon />
        </button>
      )}
    </div>
  );
};
