"use client";

import { resolveAssetUrl } from "@/src/entities/advertisement";
import type { Banner } from "@/src/entities/banner";
import style from "./style.module.scss";

export type AdBannerVariant = "rectangle" | "leaderboard" | "wide" | "promo";

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
  placeholderText = "Рекламный баннер сдается",
  variant = "rectangle",
}: AdBannerProps) => {
  const variantClass =
    variant === "leaderboard"
      ? style.bannerLeaderboard
      : variant === "wide"
      ? style.bannerWide
      : variant === "promo"
      ? style.bannerPromo
      : style.bannerRectangle;

  const videoUrl = banner?.video_url ? resolveAssetUrl(banner.video_url) : null;
  const imageUrl = banner?.image_url ? resolveAssetUrl(banner.image_url) : null;
  const href = banner?.link_url || undefined;
  const title = banner?.title;
  const description = banner?.description ?? null;
  const hasMedia = Boolean(videoUrl || imageUrl);

  const content = (
    <>
      {ageLabel && <div className={style.adTag}>{ageLabel}</div>}

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

      {siteLabel && <div className={style.siteLabel}>{siteLabel}</div>}
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
