import { CmsContent } from "@/src/widgets/docs/cms-content";
import style from "./style.module.scss";

interface TourAdFormatsProps {
  body: string;
}

interface TourFormat {
  title: string;
  infoBody: string;
}

/** Убирает служебные mockup-маркеры [CARD ...]/[BANNER ...] — их заменяют залитые демо-карточки компонента. */
function stripMockupMarkers(html: string): string {
  return html.replace(
    /<p\b[^>]*>\s*(?:<br\s*\/?>)?\s*\[\s*(?:CARD|BANNER)\s[^\]]*\]\s*(?:<br\s*\/?>)?\s*<\/p>/gi,
    ""
  );
}

/** Вырезает текст маркера [NOTE ...] — общая строка стоимости над форматами. */
function extractNote(html: string): string {
  const match = html.match(/\[\s*NOTE\s+([^\]]+?)\s*\]/i);
  return match ? match[1].trim() : "";
}

/** Обрезает первый параграф с [NOTE ...], чтобы он не дублировался в теле форматов. */
function stripNoteParagraph(html: string): string {
  return html.replace(
    /<p\b[^>]*>\s*(?:<br\s*\/?>)?\s*\[\s*NOTE\s+[^\]]+?\]\s*(?:<br\s*\/?>)?\s*<\/p>/i,
    ""
  );
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

/** Разбивает тело таба по заголовкам H2 на форматы; тело каждого формата очищается от mockup-маркеров и содержит только [INFO]-карточки. */
function parseFormats(html: string): TourFormat[] {
  const regex = /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;
  const heads: { title: string; start: number; end: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html)) !== null) {
    heads.push({ title: stripTags(m[1]), start: m.index, end: m.index + m[0].length });
  }
  return heads.map((head, i) => {
    const bodyEnd = i + 1 < heads.length ? heads[i + 1].start : html.length;
    const raw = html.slice(head.end, bodyEnd);
    return { title: head.title, infoBody: stripMockupMarkers(raw).trim() };
  });
}

/** Выделяет числовые размеры «(606×350)» в приглушённый span, оставляя основной текст жирным. */
function renderTitle(title: string) {
  const parts = title.split(/(\([^)]*\))/g).filter(Boolean);
  return parts.map((part, i) =>
    /^\(.*\)$/.test(part) ? (
      <span key={i} className={style.titleMuted}>
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

const DASH = "——————";

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" className={style.icon} aria-hidden="true">
    <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" className={style.icon} aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M3 9h18M8 3v4M16 3v4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const PinIcon = () => (
  <svg viewBox="0 0 24 24" className={style.icon} aria-hidden="true">
    <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="2.6" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const Format1 = () => (
  <div className={style.f1}>
    <div className={`${style.checker} ${style.f1img}`} />
    <div className={style.f1card}>
      <p className={style.orgName}>Название организации</p>
      <div className={style.orgRows}>
        <p className={style.orgLabel}>Режим работы:</p>
        <p className={style.orgValue}>{DASH}</p>
        <p className={style.orgLabel}>Адрес:</p>
        <p className={style.orgValue}>{DASH}</p>
        <p className={style.orgLabel}>Контакты:</p>
        <p className={style.orgValue}>{DASH}</p>
      </div>
    </div>
  </div>
);

const Format2 = () => (
  <div className={style.f2}>
    <div className={`${style.demoCard} ${style.f2card}`}>
      <div className={`${style.checker} ${style.f2img}`} />
      <p className={style.centerBlue}>САЙТ: {DASH}</p>
    </div>
    <div className={`${style.demoCard} ${style.f2card} ${style.f2cardCenter}`}>
      <p className={style.serviceName}>Название услуги</p>
      <p className={style.serviceLine}>Контактное лицо</p>
      <p className={style.serviceLine}>Тел.: ——————</p>
    </div>
  </div>
);

const Format3 = () => (
  <div className={`${style.demoCard} ${style.f3card}`}>
    <div className={`${style.checker} ${style.f3img}`} />
    <div className={style.f3text}>
      <p className={style.centerBlue}>Контакты: —————, Whatsapp ————</p>
      <p className={style.centerBlue}>САЙТ: {DASH}</p>
    </div>
  </div>
);

const Format4 = () => (
  <div className={style.f4}>
    <div className={style.f4row}>
      <ArrowIcon />
      <p className={style.f4venue}>Название заведения</p>
    </div>
    <div className={style.f4row}>
      <CalendarIcon />
      <p className={style.f4line}>Дата и время проведения</p>
    </div>
    <div className={style.f4row}>
      <PinIcon />
      <p className={style.f4line}>Адрес</p>
    </div>
    <div className={style.f4event}>
      <p className={style.f4heading}>О событии</p>
      <p className={style.f4line}>Абзац текста</p>
    </div>
    <p className={style.f4link}>Ссылка на мероприятие: ——————</p>
    <div className={style.f4banner}>
      <span>Сменяющийся видеоряд / картинка с видом Абхазии / реклама</span>
    </div>
  </div>
);

const Format5 = () => (
  <div className={`${style.demoCard} ${style.f5card}`}>
    <div className={`${style.checker} ${style.f5img}`} />
    <div className={style.f5text}>
      <p className={style.taxiName}>Название такси</p>
      <p className={style.centerBlueSm}>Время работы: —</p>
      <p className={style.taxiLabel}>Заказать такси:</p>
      <p className={style.centerBlueSm}>+7 —————— (звонки и WhatsApp)</p>
    </div>
  </div>
);

const Format6 = () => (
  <div className={`${style.demoCard} ${style.f6card}`}>
    <div className={`${style.checker} ${style.f6img}`} />
    <p className={style.f6desc}>Описание услуги/компании — — — — — —</p>
    <p className={style.centerBlue}>САЙТ: {DASH}</p>
  </div>
);

const DEMO_BY_INDEX = [Format1, Format2, Format3, Format4, Format5, Format6];

export const TourAdFormats = ({ body }: TourAdFormatsProps) => {
  const note = extractNote(body);
  const formats = parseFormats(stripNoteParagraph(body));

  return (
    <div className={style.root}>
      {note && <p className={style.note}>{note}</p>}
      {formats.map((format, i) => {
        const Demo = DEMO_BY_INDEX[i];
        return (
          <section key={i} className={style.format}>
            <h3 className={style.title}>{renderTitle(format.title)}</h3>
            {Demo && (
              <div className={style.demo}>
                <Demo />
              </div>
            )}
            {format.infoBody && (
              <div className={style.info}>
                <CmsContent body={format.infoBody} variant="stacked" />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};
