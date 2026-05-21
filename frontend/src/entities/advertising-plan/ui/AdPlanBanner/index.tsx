import type { AdPlanBanner as AdPlanBannerData } from "../../model/types";
import style from "./style.module.scss";

interface AdPlanBannerProps {
  banner: AdPlanBannerData;
}

export const AdPlanBanner = ({ banner }: AdPlanBannerProps) => {
  return (
    <div className={style.banner}>
      <img src="/adJPG.jpg" alt="" className={style.bg} aria-hidden="true" />
      <span className={style.text}>{banner.text}</span>
    </div>
  );
};
