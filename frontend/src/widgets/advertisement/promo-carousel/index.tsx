"use client";

import { useRef, useState } from "react";
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

const SLIDE_GAP = 25;

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
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const syncArrows = (track: HTMLDivElement) => {
    setAtStart(track.scrollLeft <= 1);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 1);
  };

  const attachTrack = (track: HTMLDivElement | null) => {
    trackRef.current = track;
    if (track) syncArrows(track);
  };

  const scrollBySlide = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const firstSlide = track.firstElementChild as HTMLElement | null;
    const step = (firstSlide?.clientWidth ?? track.clientWidth) + SLIDE_GAP;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <div className={style.carousel}>
      {!atStart && (
        <button
          type="button"
          className={`${style.arrow} ${style.arrowPrev}`}
          onClick={() => scrollBySlide(-1)}
          aria-label="Предыдущий баннер"
        >
          <ArrowLeftIcon />
        </button>
      )}

      <div
        ref={attachTrack}
        className={style.track}
        onScroll={(e) => syncArrows(e.currentTarget)}
      >
        {slots.map((banner, i) => (
          <div key={banner?.id ?? `empty-${i}`} className={style.slide}>
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

      {!atEnd && (
        <button
          type="button"
          className={`${style.arrow} ${style.arrowNext}`}
          onClick={() => scrollBySlide(1)}
          aria-label="Следующий баннер"
        >
          <ArrowRightIcon />
        </button>
      )}
    </div>
  );
};
