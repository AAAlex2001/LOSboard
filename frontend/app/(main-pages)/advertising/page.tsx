export const dynamic = "force-dynamic";

import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { Breadcrumbs } from "@/src/shared/ui/Breadcrumbs";
import { HeroBanner } from "@/src/widgets/advertising/hero-banner";
import { NoteLine } from "@/src/widgets/advertising/note-line";
import { PromoBanner } from "@/src/widgets/advertising/promo-banner";
import { TechSpecsAccordion } from "@/src/widgets/advertising/tech-specs-accordion";
import { CmsContent } from "@/src/widgets/docs/cms-content";
import { getContentPage } from "@/src/entities/content";
import style from "./page.module.scss";

const PAGE_TITLE = "Реклама в «LOS»";
const ACCORDION_HEADING = "Технические характеристики рекламы";

const ACCORDION_SLUGS: ReadonlyArray<string> = [
  "pricing-tech-board",
  "pricing-tech-social",
  "pricing-tech-mobile",
  "pricing-tech-tour",
];

function stripHtmlTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractLeadingParagraphs(
  html: string,
  count: number,
): { paragraphs: string[]; rest: string } {
  const paragraphs: string[] = [];
  let rest = html;
  for (let i = 0; i < count; i++) {
    const match = rest.match(/^\s*<p\b[^>]*>([\s\S]*?)<\/p>\s*/i);
    if (!match) break;
    const text = stripHtmlTags(match[1]);
    if (!text) {
      rest = rest.slice(match[0].length);
      continue;
    }
    paragraphs.push(text);
    rest = rest.slice(match[0].length);
  }
  return { paragraphs, rest };
}

function splitByHr(html: string): [string, string] {
  const match = html.match(/<hr\b[^>]*\/?>/i);
  if (!match) return [html, ""];
  const idx = html.indexOf(match[0]);
  return [
    html.slice(0, idx).trim(),
    html.slice(idx + match[0].length).trim(),
  ];
}

export default async function AdvertisingPage() {
  const [main, promo, ...techPages] = await Promise.all([
    getContentPage("pricing").catch(() => null),
    getContentPage("pricing-promo").catch(() => null),
    ...ACCORDION_SLUGS.map((slug) =>
      getContentPage(slug).catch(() => null),
    ),
  ]);

  const body = main?.body ?? "";
  const { paragraphs, rest } = extractLeadingParagraphs(body, 2);
  const heroText = paragraphs[0] ?? "";
  const noteText = paragraphs[1] ?? "";
  const [beforeHr, afterHr] = splitByHr(rest);

  const promoText = stripHtmlTags(promo?.body ?? "");
  const accordionItems = ACCORDION_SLUGS.map((_, index) => ({
    title: techPages[index]?.title ?? "",
    body: techPages[index]?.body ?? "",
  })).filter((item) => item.body.trim() && item.title.trim());

  return (
    <main className={style.page}>
      <Header />
      <div className={style.content}>
        <div className={style.layout}>
          <div className={style.crumbsSlot}>
            <Breadcrumbs
              items={[
                { label: "Главная", href: "/" },
                { label: "Документы сайта", href: "/docs" },
                { label: PAGE_TITLE },
              ]}
            />
          </div>

          <div className={style.headingRow}>
            <h1 className={style.title}>{PAGE_TITLE}</h1>
          </div>

          <div className={style.body}>
            {heroText && <HeroBanner text={heroText} />}
            {noteText && <NoteLine text={noteText} />}
            {beforeHr && <CmsContent body={beforeHr} />}
            {promoText && <PromoBanner text={promoText} />}
            {afterHr && <CmsContent body={afterHr} />}
            {accordionItems.length > 0 && (
              <TechSpecsAccordion
                heading={ACCORDION_HEADING}
                items={accordionItems.map((item) => ({
                  title: item.title,
                  content: <CmsContent body={item.body} variant="stacked" />,
                }))}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
