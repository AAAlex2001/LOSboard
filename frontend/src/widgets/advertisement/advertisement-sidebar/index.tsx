"use client";

import Link from "next/link";
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
import { formatPrice } from "@/src/shared/lib/format";
import { useMeContext } from "@/src/entities/user";
import style from "./style.module.scss";

interface AdvertisementSidebarProps {
  advertisementId: number;
  price: number;
  ownerId: number;
  sellerPhone?: string | null;
  canMessageSeller?: boolean;
}

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
  const { user: currentUser, loading: userLoading } = useMeContext();
  const isOwnAd = currentUser?.id === ownerId;
  const sellerButtonsDisabled = isOwnAd || userLoading;

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
          {phoneTel && !isOwnAd && !userLoading ? (
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
              disabled={startingChat || sellerButtonsDisabled}
              title={isOwnAd ? "Это ваше объявление" : undefined}
            >
              {startingChat ? "Открываем чат…" : "Написать продавцу"}
            </button>
          )}
        </div>
      </div>

      <div className={style.info}>
        <div className={style.socialBlock}>
          <h3 className={style.socialTitle}>
            {settings?.socials_title || "LOS в социальных сетях"}
          </h3>
          <div className={style.socials}>
            {settings?.telegram_url && (
              <a
                href={settings.telegram_url}
                target="_blank"
                rel="noopener noreferrer"
                className={style.social}
                aria-label="Telegram"
              >
                <TelegramIcon />
              </a>
            )}
            {settings?.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className={style.social}
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
            )}
            {settings?.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className={style.social}
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
            )}
          </div>
        </div>

        <div className={style.links}>
          <Link className={style.link} href="/advertising">
            Размещение рекламы на сайте LOS
          </Link>
          <Link className={style.link} href="/contacts">
            Связаться с нами
          </Link>
          <Link className={style.link} href="/docs">
            Документы сайта
          </Link>
        </div>
      </div>

      <div className={style.adsBlock}>
        {banners.map((b) => (
          <AdBanner
            key={b.id}
            variant={b.size === "halfpage" ? "halfpage" : "rectangle"}
            banner={b}
            ageLabel={settings?.ad_age_label}
            siteLabel={settings?.ad_site_label}
            placeholderText={settings?.ad_placeholder_text}
          />
        ))}
      </div>
    </aside>
  );
};
