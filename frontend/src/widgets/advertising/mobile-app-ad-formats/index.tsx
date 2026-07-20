import { CmsContent } from "@/src/widgets/docs/cms-content";
import style from "./style.module.scss";

interface MobileAppAdFormatsProps {
  body: string;
}

interface MobileFormat {
  title: string;
  infoBody: string;
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseFormats(html: string): MobileFormat[] {
  const regex = /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;
  const heads: { title: string; start: number; end: number }[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    heads.push({
      title: stripTags(match[1]),
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return heads.map((head, index) => ({
    title: head.title,
    infoBody: html
      .slice(head.end, heads[index + 1]?.start ?? html.length)
      .trim(),
  }));
}

const Checker = ({ className = "" }: { className?: string }) => (
  <div className={`${style.checker} ${className}`} aria-hidden="true" />
);

const SplashDemo = () => (
  <div className={style.phone}>
    <div className={style.cross} aria-hidden="true" />
    <div className={style.phoneLabel}>
      <strong>402 × 874</strong>
      <span>App banner</span>
    </div>
  </div>
);

const StandardDemo = () => (
  <div className={style.standard}>
    <Checker className={style.standardImage} />
    <div className={style.standardInfo}>
      <strong>Название объекта</strong>
      <b>Режим работы:</b><span>–</span>
      <b>Адрес:</b><span>–</span>
      <b>Контакты:</b><span>–</span>
    </div>
  </div>
);

const MountainDemo = () => (
  <div className={style.mountainRow}>
    <div className={`${style.blueCard} ${style.mountainText}`}>
      <strong>НАЗВАНИЕ УСЛУГИ</strong>
      <b>Контактное лицо</b>
      <span>Тел.: ------</span>
    </div>
    <div className={`${style.blueCard} ${style.mountainPhoto}`}>
      <Checker />
      <span>САЙТ: ------<br />------</span>
    </div>
  </div>
);

const ExcursionDemo = () => (
  <div className={`${style.blueCard} ${style.excursion}`}>
    <Checker />
    <span>Контакты: -----<br />САЙТ:------</span>
  </div>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></svg>
);

const PinIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
);

const EventDemo = () => (
  <div className={style.event}>
    <div><ArrowIcon /><strong>Название мероприятия</strong></div>
    <div><CalendarIcon /><span>Дата и время проведения</span></div>
    <div><PinIcon /><span>Адрес</span></div>
    <b>О событии</b>
    <span>Абзац текста</span>
    <strong>Ссылка на мероприятие: ---</strong>
    <div className={style.eventBanner}>Сменяющийся видеоряд/<br />картинка с видом Абхазии/<br />реклама</div>
  </div>
);

const MobileDemo = () => (
  <div className={`${style.blueCard} ${style.mobile}`}>
    <Checker />
    <span>Описание услуги/компании<br />-<br />-<br />-<br />-</span>
    <span>САЙТ: ------</span>
  </div>
);

const TaxiDemo = () => (
  <div className={`${style.blueCard} ${style.taxi}`}>
    <Checker />
    <strong>Название компании</strong>
    <span>Время работы: -</span>
    <b>Заказать такси:</b>
    <span>Контакты -----<br />------</span>
  </div>
);

const DEMOS = [
  SplashDemo,
  StandardDemo,
  MountainDemo,
  ExcursionDemo,
  EventDemo,
  MobileDemo,
  TaxiDemo,
];

export const MobileAppAdFormats = ({ body }: MobileAppAdFormatsProps) => {
  const formats = parseFormats(body);

  return (
    <div className={style.root}>
      {formats.map((format, index) => {
        const Demo = DEMOS[index];
        return (
          <section key={format.title} className={style.format}>
            <h3>{format.title}</h3>
            {Demo && <div className={style.demo}><Demo /></div>}
            {format.infoBody && (
              <CmsContent body={format.infoBody} variant="stacked" />
            )}
          </section>
        );
      })}
    </div>
  );
};
