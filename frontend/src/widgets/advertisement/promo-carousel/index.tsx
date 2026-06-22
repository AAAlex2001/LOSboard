"use client";

import { useEffect, useRef, useState } from "react";
import { useKeenSlider, type KeenSliderInstance } from "keen-slider/react";
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

const AUTOPLAY_INTERVAL_MS = 5000;
const DESKTOP_PER_VIEW = 3;
const DESKTOP_BREAKPOINT_PX = 850;

export const PromoCarousel = ({
  banners,
  ageLabel,
  siteLabel,
  placeholderText,
}: PromoCarouselProps) => {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [maxIdx, setMaxIdx] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1, spacing: 25 },
    breakpoints: {
      [`(min-width: ${DESKTOP_BREAKPOINT_PX}px)`]: {
        slides: { perView: DESKTOP_PER_VIEW, spacing: 25 },
      },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created(slider) {
      setMaxIdx(slider.track.details.maxIdx);
    },
    updated(slider) {
      setMaxIdx(slider.track.details.maxIdx);
    },
  });

  useEffect(() => {
    const slider = instanceRef.current;
    if (!slider || banners.length <= DESKTOP_PER_VIEW) return;

    const startAutoplay = (current: KeenSliderInstance) => {
      stopAutoplay();
      timerRef.current = setInterval(() => {
        current.next();
      }, AUTOPLAY_INTERVAL_MS);
    };
    const stopAutoplay = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    const container = slider.container;
    container.addEventListener("mouseover", stopAutoplay);
    container.addEventListener("mouseout", () => startAutoplay(slider));
    startAutoplay(slider);

    return () => {
      stopAutoplay();
      container.removeEventListener("mouseover", stopAutoplay);
      container.removeEventListener("mouseout", () => startAutoplay(slider));
    };
  }, [banners.length, instanceRef]);

  if (banners.length === 0) return null;

  const showArrows = maxIdx > 0;

  return (
    <div className={style.carousel}>
      {showArrows && (
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
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={`keen-slider__slide ${style.slide}`}
          >
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

      {showArrows && (
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
