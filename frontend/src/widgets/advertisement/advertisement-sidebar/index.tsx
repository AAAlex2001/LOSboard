import { Button } from "@/src/shared/ui/Button";
import TelegramIcon from "@/src/shared/ui/Icons/TelegramIcon";
import InstagramIcon from "@/src/shared/ui/Icons/InstagramIcon";
import FacebookIcon from "@/src/shared/ui/Icons/FacebookIcon";
import { AdBanner } from "@/src/entities/ad-banner";
import style from "./style.module.scss";

interface AdvertisementSidebarProps {
  price: number;
  sellerPhone?: string | null;
}

const formatPrice = (price: number) => `${price.toLocaleString("ru-RU")} ₽`;

export const AdvertisementSidebar = ({
  price,
  sellerPhone,
}: AdvertisementSidebarProps) => {
  const phoneTel = sellerPhone ?? "";

  return (
    <aside className={style.sidebar}>
      <div className={style.priceBlock}>
        <div className={style.price}>{formatPrice(price)}</div>
        <div className={style.contactButtons}>
          {phoneTel ? (
            <a href={`tel:${phoneTel}`} className={style.callLink}>
              <Button type="button" variant="filled" color="blue" fullWidth>
                Позвонить продавцу
              </Button>
            </a>
          ) : (
            <Button type="button" variant="filled" color="blue" fullWidth disabled>
              Позвонить продавцу
            </Button>
          )}
          <button type="button" className={style.messageBtn}>
            Написать продавцу
          </button>
        </div>
      </div>

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
          <a className={style.link} href="#">
            Размещение рекламы на сайте LOS
          </a>
          <a className={style.link} href="#">
            Связаться с нами
          </a>
          <a className={style.link} href="#">
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
