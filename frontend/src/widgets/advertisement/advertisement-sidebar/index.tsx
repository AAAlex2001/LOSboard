"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/src/shared/ui/Button";
import TelegramIcon from "@/src/shared/ui/Icons/TelegramIcon";
import InstagramIcon from "@/src/shared/ui/Icons/InstagramIcon";
import FacebookIcon from "@/src/shared/ui/Icons/FacebookIcon";
import { AdBanner } from "@/src/entities/ad-banner";
import { useSidebarBanners } from "@/src/entities/banner";
import { useSiteSettings } from "@/src/entities/content";
import { useStartChat } from "@/src/features/chat";
import { isAuthenticated as checkAuth } from "@/src/shared/auth/auth-storage";
import { useMeContext } from "@/src/entities/user";
import style from "./style.module.scss";

interface AdvertisementSidebarProps {
  advertisementId: number;
  price: number;
  ownerId: number;
  sellerPhone?: string | null;
  canMessageSeller?: boolean;
}

const formatPrice = (price: number) => `${price.toLocaleString("ru-RU")} ₽`;

export const AdvertisementSidebar = ({
  advertisementId,
  price,
  ownerId,
  sellerPhone,
  canMessageSeller = true,
}: AdvertisementSidebarProps) => {
  const router = useRouter();
  const phoneTel = sellerPhone ?? "";
  const { loading: startingChat, start } = useStartChat();
  const banners = useSidebarBanners();
  const settings = useSiteSettings();
  const { user: currentUser } = useMeContext();
  const isOwnAd = currentUser?.id === ownerId;

  const handleCall = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!checkAuth()) {
      e.preventDefault();
      router.push("/register");
    }
  };

  const handleMessage = async () => {
    if (!checkAuth()) {
      router.push("/register");
      return;
    }
    const conversationId = await start(advertisementId);
    if (conversationId != null) {
      router.push(`/chats/${conversationId}`);
    }
  };

  return (
    <aside className={style.sidebar}>
      <div className={style.priceBlock}>
        <div className={style.price}>{formatPrice(price)}</div>
        <div className={style.contactButtons}>
          {phoneTel && !isOwnAd ? (
            <a
              href={`tel:${phoneTel}`}
              className={style.callLink}
              onClick={handleCall}
            >
              <Button type="button" variant="filled" color="blue" fullWidth>
                Позвонить продавцу
              </Button>
            </a>
          ) : (
            <Button
              type="button"
              variant="filled"
              color="blue"
              fullWidth
              disabled
              title={isOwnAd ? "Это ваше объявление" : undefined}
            >
              Позвонить продавцу
            </Button>
          )}
          {canMessageSeller && (
            <button
              type="button"
              className={style.messageBtn}
              onClick={handleMessage}
              disabled={startingChat || isOwnAd}
              title={isOwnAd ? "Это ваше объявление" : undefined}
            >
              {startingChat ? "Открываем чат…" : "Написать продавцу"}
            </button>
          )}
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
        <AdBanner
          banner={banners[0]}
          ageLabel={settings?.ad_age_label}
          siteLabel={settings?.ad_site_label}
          placeholderText={settings?.ad_placeholder_text}
        />
        <AdBanner
          banner={banners[1]}
          ageLabel={settings?.ad_age_label}
          siteLabel={settings?.ad_site_label}
          placeholderText={settings?.ad_placeholder_text}
        />
      </div>
    </aside>
  );
};
