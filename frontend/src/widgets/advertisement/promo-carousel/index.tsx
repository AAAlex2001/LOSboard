"use client";

import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { AdBanner, type AdBannerVariant } from "@/src/entities/ad-banner";
import type { Banner } from "@/src/entities/banner";
import ArrowLeftIcon from "@/src/shared/ui/Icons/ArrowLeftIcon";
import ArrowRightIcon from "@/src/shared/ui/Icons/ArrowRightIcon";
import style from "./style.module.scss";

interface PromoCarouselProps {
  banners: Banner[];
  variant: AdBannerVariant;
  slidesPerView: number;
  ageLabel?: string;
  siteLabel?: string;
  placeholderText?: string;
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
  spacing = 25,
}: PromoCarouselProps) => {
  const slots = fillSlots(banners, slidesPerView);
  const canRotate = banners.length > slidesPerView;

  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: false,
    slides: {
      perView: slidesPerView,
      spacing,
    },
    slideChanged: (s) => setCurrentSlide(s.track.details.rel),
  });

  const isAtStart = currentSlide === 0;
  const isAtEnd = currentSlide >= slots.length - slidesPerView;

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
