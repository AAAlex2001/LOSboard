"use client";

import { useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { AdBanner, type AdBannerVariant } from "@/src/entities/ad-banner";
import type { Banner } from "@/src/entities/banner";
import ChevronLeftIcon from "@/src/shared/ui/Icons/ChevronLeftIcon";
import ChevronRightIcon from "@/src/shared/ui/Icons/ChevronRightIcon";
import style from "./style.module.scss";

interface PromoCarouselProps {
  banners: Banner[];
  variant: AdBannerVariant;
  slidesPerView: number;
  ageLabel?: string;
  siteLabel?: string;
  placeholderText?: string;
  autoRotateMs?: number;
  spacing?: number;
}

function fillSlots(arr: Banner[], min: number): Array<Banner | null> {
  if (arr.length >= min) return arr;
  return [...arr, ...Array(min - arr.length).fill(null)];
}

export const PromoCarousel = ({
  banners,
  variant,
  slidesPerView,
  ageLabel,
  siteLabel,
  placeholderText,
  autoRotateMs = 2500,
  spacing = 25,
}: PromoCarouselProps) => {
  const slots = fillSlots(banners, slidesPerView);
  const canRotate = banners.length > slidesPerView;

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: canRotate,
    slides: {
      perView: slidesPerView,
      spacing,
    },
  });

  useEffect(() => {
    if (!canRotate) return;
    const id = setInterval(() => {
      instanceRef.current?.next();
    }, autoRotateMs);
    return () => clearInterval(id);
  }, [autoRotateMs, canRotate, instanceRef]);

  if (slots.length === 0) return null;

  return (
    <div className={style.carousel}>
      {canRotate && (
        <button
          type="button"
          className={`${style.arrow} ${style.arrowPrev}`}
          onClick={() => instanceRef.current?.prev()}
          aria-label="Предыдущий баннер"
        >
          <ChevronLeftIcon />
        </button>
      )}
      <div ref={sliderRef} className={`keen-slider ${style.track}`}>
        {slots.map((banner, i) => (
          <div key={banner?.id ?? `empty-${i}`} className="keen-slider__slide">
            <AdBanner
              variant={variant}
              banner={banner}
              ageLabel={ageLabel}
              siteLabel={siteLabel}
              placeholderText={placeholderText}
            />
          </div>
        ))}
      </div>
      {canRotate && (
        <button
          type="button"
          className={`${style.arrow} ${style.arrowNext}`}
          onClick={() => instanceRef.current?.next()}
          aria-label="Следующий баннер"
        >
          <ChevronRightIcon />
        </button>
      )}
    </div>
  );
};
