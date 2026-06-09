import classNames from "classnames";
import style from "./style.module.scss";

interface BannerProps {
  text: string;
  variant: "hero" | "promo";
  imageUrl?: string;
}

export const Banner = ({ text, variant, imageUrl = "/adJPG.jpg" }: BannerProps) => {
  return (
    <div
      className={style.banner}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <p className={classNames(style.text, style[variant])}>{text}</p>
    </div>
  );
};
