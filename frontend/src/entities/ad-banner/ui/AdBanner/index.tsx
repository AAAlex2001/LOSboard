import style from "./style.module.scss";

interface AdBannerProps {
  imageUrl?: string;
  href?: string;
  siteLabel?: string;
  ageLabel?: string;
  placeholderText?: string;
}

export const AdBanner = ({
  imageUrl,
  href,
  siteLabel = "Ваш сайт",
  ageLabel = "Реклама 0+",
  placeholderText = "Рекламный баннер сдается",
}: AdBannerProps) => {
  const content = (
    <>
      <div className={style.adTag}>{ageLabel}</div>

      {imageUrl ? (
        <img src={imageUrl} alt="" className={style.image} />
      ) : (
        <span className={style.placeholder}>{placeholderText}</span>
      )}

      <div className={style.siteLabel}>{siteLabel}</div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={style.banner}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return <div className={style.banner}>{content}</div>;
};
