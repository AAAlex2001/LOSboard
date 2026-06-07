import style from "./style.module.scss";

interface HeroBannerProps {
  text: string;
  imageUrl?: string;
}

export const HeroBanner = ({ text, imageUrl = "/adJPG.jpg" }: HeroBannerProps) => {
  return (
    <div
      className={style.banner}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <p className={style.text}>{text}</p>
    </div>
  );
};
