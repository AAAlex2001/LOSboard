"use client";

import { useEffect, useState } from "react";
import TelegramIcon from "@/src/shared/ui/Icons/TelegramIcon";
import InstagramIcon from "@/src/shared/ui/Icons/InstagramIcon";
import FacebookIcon from "@/src/shared/ui/Icons/FacebookIcon";
import { getFooter, type FooterLink } from "@/src/entities/content";
import style from "./style.module.scss";

export const Footer = () => {
  const [links, setLinks] = useState<FooterLink[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    getFooter({ signal: controller.signal })
      .then((res) => setLinks(res.links))
      .catch(() => setLinks([]));
    return () => controller.abort();
  }, []);

  const navLinks = links.filter((l) => l.sort_order < 100);
  const legalLinks = links.filter((l) => l.sort_order >= 100);

  return (
    <footer className={style.footer}>
      <div className={style.container}>
        <div className={style.main}>
          <div className={style.brand}>
            <h2 className={style.brandTitle}>Land of Soul Abkhazia</h2>
            <p className={style.brandText}>
              Доска объявлений Республики Абхазия
            </p>
          </div>

          <div className={style.about}>
            <h3 className={style.sectionTitle}>О сервисе</h3>
            <p className={style.aboutText}>
              Наша доска объявлений — это быстрый способ продать, купить или
              обменять. Простое размещение, актуальные предложения и удобный
              поиск для Вас!
            </p>
          </div>
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

          <div className={style.contacts}>
            <span className={style.linkBold}>Land of Soul в социальных сетях</span>
            <div className={style.socials}>
              <a href="#" className={style.social}><TelegramIcon /></a>
              <a href="#" className={style.social}><InstagramIcon /></a>
              <a href="#" className={style.social}><FacebookIcon /></a>
            </div>
          </div>
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
          <p className={style.copyright}>
            © {new Date().getFullYear()} Land of soul Abkhazia. Все права защищены. Дизайн: @Amosssik
          </p>
        </div>
      </div>
    </footer>
  );
};
