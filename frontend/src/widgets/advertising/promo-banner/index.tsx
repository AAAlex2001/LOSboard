import style from "./style.module.scss";

interface PromoBannerProps {
  text: string;
  imageUrl?: string;
}

export const PromoBanner = ({ text, imageUrl = "/adJPG.jpg" }: PromoBannerProps) => {
  return (
    <div
      className={style.banner}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <p className={style.text}>{text}</p>
    </div>
  );
};
