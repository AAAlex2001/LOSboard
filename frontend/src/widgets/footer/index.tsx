"use client";

import { useEffect, useState } from "react";
import TelegramIcon from "@/src/shared/ui/Icons/TelegramIcon";
import InstagramIcon from "@/src/shared/ui/Icons/InstagramIcon";
import FacebookIcon from "@/src/shared/ui/Icons/FacebookIcon";
import {
  getFooter,
  getSiteSettings,
  type FooterLink,
  type SiteSettings,
} from "@/src/entities/content";
import { ViewModeToggle } from "@/src/features/view-mode-toggle";
import style from "./style.module.scss";

export const Footer = () => {
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      getFooter({ signal: controller.signal }).catch(() => ({ links: [] })),
      getSiteSettings({ signal: controller.signal }).catch(() => null),
    ]).then(([footer, siteSettings]) => {
      setLinks(footer.links);
      setSettings(siteSettings);
    });
    return () => controller.abort();
  }, []);

  const navLinks = links.filter((l) => l.sort_order < 100);
  const legalLinks = links.filter((l) => l.sort_order >= 100);

  return (
    <footer className={style.footer}>
      <div className={style.container}>
        <div className={style.main}>
          <div className={style.brand}>
            {settings?.brand_title && (
              <h2 className={style.brandTitle}>{settings.brand_title}</h2>
            )}
            {settings?.brand_subtitle && (
              <p className={style.brandText}>{settings.brand_subtitle}</p>
            )}
          </div>

          {(settings?.about_title || settings?.about_text) && (
            <div className={style.about}>
              {settings?.about_title && (
                <h3 className={style.sectionTitle}>{settings.about_title}</h3>
              )}
              {settings?.about_text && (
                <p className={style.aboutText}>{settings.about_text}</p>
              )}
            </div>
          )}
        </div>

        <nav className={style.links}>
          {navLinks.length > 0 && (
            <div className={style.linksGroup}>
              {navLinks.map((link) => (
                <a
                  key={`${link.url}-${link.title}`}
                  className={style.link}
                  href={link.url}
                  target={link.url.startsWith("http") ? "_blank" : undefined}
                  rel={
                    link.url.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                >
                  {link.title}
                </a>
              ))}
            </div>
          )}

          {settings?.socials_title && (
            <div className={style.contacts}>
              <span className={style.linkBold}>{settings.socials_title}</span>
              <div className={style.socials}>
                {settings.telegram_url && (
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
                {settings.instagram_url && (
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
                {settings.facebook_url && (
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
              <div className={style.viewMode}>
                <ViewModeToggle />
              </div>
            </div>
          )}
        </nav>
      </div>

      <div className={style.legalWrapper}>
        <div className={style.legal}>
          {legalLinks.map((link) => (
            <a
              key={`${link.url}-${link.title}`}
              className={style.legalLink}
              href={link.url}
            >
              {link.title}
            </a>
          ))}
          {settings?.copyright_line && (
            <p className={style.copyright}>
              © {new Date().getFullYear()} {settings.copyright_line}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};
