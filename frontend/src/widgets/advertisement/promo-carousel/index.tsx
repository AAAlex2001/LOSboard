"use client";

import { useEffect, useRef } from "react";
import { useKeenSlider, type KeenSliderInstance } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { AdBanner } from "@/src/entities/ad-banner";
import type { Banner } from "@/src/entities/banner";
import style from "./style.module.scss";

interface PromoCarouselProps {
  banners: Banner[];
  ageLabel?: string;
  siteLabel?: string;
  placeholderText?: string;
}

const AUTOPLAY_INTERVAL_MS = 5000;
const PER_VIEW = 3;

export const PromoCarousel = ({
  banners,
  ageLabel,
  siteLabel,
  placeholderText,
}: PromoCarouselProps) => {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    drag: false,
    slides: { perView: PER_VIEW, spacing: 25 },
  });

  useEffect(() => {
    const slider = instanceRef.current;
    if (!slider || banners.length <= PER_VIEW) return;

    const stopAutoplay = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    const startAutoplay = (current: KeenSliderInstance) => {
      stopAutoplay();
      timerRef.current = setInterval(() => {
        current.next();
      }, AUTOPLAY_INTERVAL_MS);
    };

    startAutoplay(slider);

    return () => {
      stopAutoplay();
    };
  }, [banners.length, instanceRef]);

  if (banners.length === 0) return null;

  return (
    <div className={style.carousel}>
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
    </div>
  );
};
