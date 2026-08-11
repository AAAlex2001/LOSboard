"use client";

import { resolveAssetUrl } from "@/src/shared/lib/asset-url";
import type { Banner } from "@/src/entities/banner";
import style from "./style.module.scss";

export type AdBannerVariant =
  | "rectangle"
  | "halfpage"
  | "leaderboard"
  | "wide"
  | "promo"
  | "carousel";

const DEFAULT_PLACEHOLDER_TEXT = "Рекламный баннер сдается";

interface AdBannerProps {
  banner?: Banner | null;
  ageLabel?: string;
  siteLabel?: string;
  placeholderText?: string;
  variant?: AdBannerVariant;
}

export const AdBanner = ({
  banner,
  ageLabel,
  siteLabel,
  placeholderText = DEFAULT_PLACEHOLDER_TEXT,
  variant = "rectangle",
}: AdBannerProps) => {
  const variantClass =
    variant === "halfpage"
      ? style.bannerHalfPage
      : variant === "leaderboard"
      ? style.bannerLeaderboard
      : variant === "wide"
      ? style.bannerWide
      : variant === "promo"
      ? style.bannerPromo
      : variant === "carousel"
      ? style.bannerCarousel
      : style.bannerRectangle;

  const videoUrl = banner?.video_url ? resolveAssetUrl(banner.video_url) : null;
  const imageUrl = banner?.image_url ? resolveAssetUrl(banner.image_url) : null;
  const href = banner?.link_url || undefined;
  const title = banner?.title;
  const description = banner?.description ?? null;
  const hasMedia = Boolean(videoUrl || imageUrl);
  const finalAgeLabel = banner?.age_label || ageLabel;

  const content = (
    <>
      {finalAgeLabel && <div className={style.adTag}>{finalAgeLabel}</div>}

      {videoUrl ? (
        <video
          src={videoUrl}
          className={style.media}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt={title || ""}
          className={style.media}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className={style.placeholder}>{placeholderText}</span>
      )}

      {(title || description) && hasMedia && (
        <div className={style.overlay}>
          {title && <span className={style.overlayTitle}>{title}</span>}
          {description && (
            <span className={style.overlayDescription}>{description}</span>
          )}
        </div>
      )}

      {!hasMedia && siteLabel && <div className={style.siteLabel}>{siteLabel}</div>}
    </>
  );

  const className = `${style.banner} ${variantClass}`;

  if (href) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
};
