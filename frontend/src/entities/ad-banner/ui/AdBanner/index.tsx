import style from "./style.module.scss";

export type AdBannerVariant = "rectangle" | "leaderboard" | "wide" | "promo";

interface AdBannerProps {
  imageUrl?: string;
  href?: string;
  siteLabel?: string;
  ageLabel?: string;
  placeholderText?: string;
  variant?: AdBannerVariant;
}

export const AdBanner = ({
  imageUrl,
  href,
  siteLabel = "Ваш сайт",
  ageLabel = "Реклама 0+",
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

  const content = (
    <>
      <div className={style.adTag}>{ageLabel}</div>

      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className={style.image}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className={style.placeholder}>{placeholderText}</span>
      )}

      <div className={style.siteLabel}>{siteLabel}</div>
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
