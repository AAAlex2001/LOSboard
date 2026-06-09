import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { CrumbsBar } from "@/src/shared/ui/PageBar";
import { HeroBanner } from "@/src/widgets/advertising/hero-banner";
import { NoteLine } from "@/src/widgets/advertising/note-line";
import { PromoBanner } from "@/src/widgets/advertising/promo-banner";
import { TechSpecsAccordion } from "@/src/widgets/advertising/tech-specs-accordion";
import { CmsContent } from "@/src/widgets/docs/cms-content";
import style from "./style.module.scss";

const PAGE_TITLE = "Реклама в «LOS»";
const ACCORDION_HEADING = "Технические характеристики рекламы";

interface AccordionItemData {
  title: string;
  body: string;
}

interface AdvertisingPageViewProps {
  heroText: string;
  noteText: string;
  beforeHr: string;
  afterHr: string;
  promoText: string;
  accordionItems: AccordionItemData[];
}

export const AdvertisingPageView = ({
  heroText,
  noteText,
  beforeHr,
  afterHr,
  promoText,
  accordionItems,
}: AdvertisingPageViewProps) => {
  return (
    <main className={style.page}>
      <Header />
      <CrumbsBar
        items={[
          { label: "Главная", href: "/" },
          { label: PAGE_TITLE },
        ]}
      />
      <div className={style.content}>
        <div className={style.layout}>
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
};
