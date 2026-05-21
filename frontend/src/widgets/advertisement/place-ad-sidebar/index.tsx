import TelegramIcon from "@/src/shared/ui/Icons/TelegramIcon";
import InstagramIcon from "@/src/shared/ui/Icons/InstagramIcon";
import FacebookIcon from "@/src/shared/ui/Icons/FacebookIcon";
import { AdBanner } from "@/src/entities/ad-banner";
import style from "./style.module.scss";

export const PlaceAdSidebar = () => {
  return (
    <aside className={style.sidebar}>
      <div className={style.info}>
        <div className={style.socialBlock}>
          <h3 className={style.socialTitle}>LOS в социальных сетях</h3>
          <div className={style.socials}>
            <a href="#" className={style.social} aria-label="Telegram">
              <TelegramIcon />
            </a>
            <a href="#" className={style.social} aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="#" className={style.social} aria-label="Facebook">
              <FacebookIcon />
            </a>
          </div>
        </div>

        <div className={style.links}>
          <a className={style.link} href="/advertising">
            Размещение рекламы на сайте LOS
          </a>
          <a className={style.link} href="/contacts">
            Связаться с нами
          </a>
          <a className={style.link} href="/docs">
            Документы сайта
          </a>
        </div>
      </div>

      <div className={style.adsBlock}>
        <AdBanner />
        <AdBanner />
      </div>
    </aside>
  );
};
