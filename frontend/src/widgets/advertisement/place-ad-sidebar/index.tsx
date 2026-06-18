"use client";

import Link from "next/link";
import TelegramIcon from "@/src/shared/ui/Icons/TelegramIcon";
import InstagramIcon from "@/src/shared/ui/Icons/InstagramIcon";
import FacebookIcon from "@/src/shared/ui/Icons/FacebookIcon";
import { AdBanner } from "@/src/entities/ad-banner";
import { useSidebarBanners } from "@/src/entities/banner";
import { useSiteSettings } from "@/src/entities/content";
import style from "./style.module.scss";

export const PlaceAdSidebar = () => {
  const banners = useSidebarBanners();
  const settings = useSiteSettings();

  return (
    <aside className={style.sidebar}>
      <div className={style.info}>
        <div className={style.socialBlock}>
          <h3 className={style.socialTitle}>
            {settings?.socials_title || "LOS в социальных сетях"}
          </h3>
          <div className={style.socials}>
            <a
              href={settings?.telegram_url || "#"}
              target={settings?.telegram_url ? "_blank" : undefined}
              rel={settings?.telegram_url ? "noopener noreferrer" : undefined}
              className={style.social}
              aria-label="Telegram"
            >
              <TelegramIcon />
            </a>
            <a
              href={settings?.instagram_url || "#"}
              target={settings?.instagram_url ? "_blank" : undefined}
              rel={settings?.instagram_url ? "noopener noreferrer" : undefined}
              className={style.social}
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href={settings?.facebook_url || "#"}
              target={settings?.facebook_url ? "_blank" : undefined}
              rel={settings?.facebook_url ? "noopener noreferrer" : undefined}
              className={style.social}
              aria-label="Facebook"
            >
              <FacebookIcon />
            </a>
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
