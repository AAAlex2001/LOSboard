"use client";

import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import ArrowRightLongIcon from "@/src/shared/ui/Icons/ArrowRightLongIcon";
import style from "./style.module.scss";

interface PhotoGalleryProps {
  photos: string[];
  alt?: string;
  placeholderText?: string;
}

export const PhotoGallery = ({
  photos,
  alt = "",
  placeholderText = "Фото не добавлено",
}: PhotoGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    loop: photos.length > 1,
    slides: { perView: 1 },
    drag: photos.length > 1,
    slideChanged(slider) {
      setCurrentIndex(slider.track.details.rel);
    },
  });

  if (photos.length === 0) {
    return (
      <div className={style.wrap}>
        <div className={style.placeholder}>{placeholderText}</div>
      </div>
    );
  }

  const hasMultiple = photos.length > 1;

  return (
    <div className={style.wrap}>
      <div
        ref={sliderRef}
        className={`keen-slider ${style.slider}`}
      >
        {photos.map((src, i) => (
          <div key={`${src}-${i}`} className={`keen-slider__slide ${style.slide}`}>
            <img
              src={src}
              alt={
                photos.length > 1
                  ? `${alt} — фото ${i + 1} из ${photos.length}`
                  : alt
              }
              className={style.image}
              draggable={false}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
            />
          </div>
        ))}
      </div>

      {hasMultiple && (
        <>
          <button
            type="button"
            className={`${style.navBtn} ${style.navBtnLeft}`}
            onClick={() => instanceRef.current?.prev()}
            aria-label="Предыдущее фото"
          >
            <span className={style.navIcon}>
              <ArrowRightLongIcon />
            </span>
          </button>
          <button
            type="button"
            className={`${style.navBtn} ${style.navBtnRight}`}
            onClick={() => instanceRef.current?.next()}
            aria-label="Следующее фото"
          >
            <span className={style.navIcon}>
              <ArrowRightLongIcon />
            </span>
          </button>

          <div className={style.dots}>
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`${style.dot} ${i === currentIndex ? style.dotActive : ""}`}
                onClick={() => instanceRef.current?.moveToIdx(i)}
                aria-label={`Перейти к фото ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
