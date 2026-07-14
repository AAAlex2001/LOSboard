import { Header } from "@/src/widgets/header";
import { Footer } from "@/src/widgets/footer";
import { CrumbsBar } from "@/src/shared/ui/PageBar";
import { Banner } from "@/src/widgets/advertising/banner";
import { NoteLine } from "@/src/widgets/advertising/note-line";
import { TechSpecsAccordion } from "@/src/widgets/advertising/tech-specs-accordion";
import { TourAdFormats } from "@/src/widgets/advertising/tour-ad-formats";
import { CmsContent } from "@/src/widgets/docs/cms-content";
import style from "./style.module.scss";

const TOUR_FORMATS_TITLE = "Реклама на сайте Тур-гид LOS";

interface AccordionItemData {
  title: string;
  body: string;
}

interface AdvertisingPageViewProps {
  title: string;
  accordionHeading: string;
  heroText: string;
  noteText: string;
  beforeHr: string;
  afterHr: string;
  promoText: string;
  accordionItems: AccordionItemData[];
}

export const AdvertisingPageView = ({
  title,
  accordionHeading,
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
          { label: title },
        ]}
      />
      <div className={style.content}>
        <div className={style.layout}>
          <div className={style.headingRow}>
            <h1 className={style.title}>{title}</h1>
          </div>

          <div className={style.body}>
            {heroText && <Banner variant="hero" text={heroText} />}
            {noteText && <NoteLine text={noteText} />}
            {beforeHr && <CmsContent body={beforeHr} />}
            {promoText && <Banner variant="promo" text={promoText} />}
            {afterHr && <CmsContent body={afterHr} />}
            {accordionItems.length > 0 && (
              <TechSpecsAccordion
                heading={accordionHeading}
                items={accordionItems.map((item) => ({
                  title: item.title,
                  content:
                    item.title.trim() === TOUR_FORMATS_TITLE ? (
                      <TourAdFormats body={item.body} />
                    ) : (
                      <CmsContent body={item.body} variant="stacked" />
                    ),
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
