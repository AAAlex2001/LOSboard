import TelegramIcon from "@/src/shared/ui/Icons/TelegramIcon";
import InstagramIcon from "@/src/shared/ui/Icons/InstagramIcon";
import FacebookIcon from "@/src/shared/ui/Icons/FacebookIcon";
import style from "./style.module.scss";

export const Footer = () => {
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
          <div className={style.linksGroup}>
            <a className={style.link} href="/advertising">Размещение рекламы на сайте</a>
            <a className={style.link} href="#">Тур-гид по Абхазии от LOS</a>
            <a className={style.link} href="#">Связаться с нами</a>
          </div>

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
          <a className={style.legalLink} href="#">Политика конфиденциальности</a>
          <a className={style.legalLink} href="#">Пользовательское соглашение</a>
          <a className={style.legalLink} href="/advertising">Правила размещения</a>
          <p className={style.copyright}>
            © {new Date().getFullYear()} Land of soul Abkhazia. Все права защищены. Дизайн: @Amosssik
          </p>
        </div>
      </div>
    </footer>
  );
};
