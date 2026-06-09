export const dynamic = "force-dynamic";

import { AdvertisingPageView } from "@/src/widgets/advertising-page";
import {
  extractLeadingParagraphs,
  splitByHr,
  stripHtmlTags,
  splitAccordionByH1,
} from "@/src/widgets/advertising-page/extract-content";
import { getContentPage } from "@/src/entities/content";

export default async function AdvertisingPage() {
  const [main, promo, tech] = await Promise.all([
    getContentPage("pricing").catch(() => null),
    getContentPage("pricing-promo").catch(() => null),
    getContentPage("pricing-tech").catch(() => null),
  ]);

  const body = main?.body ?? "";
  const { paragraphs, rest } = extractLeadingParagraphs(body, 2);
  const heroText = paragraphs[0] ?? "";
  const noteText = paragraphs[1] ?? "";
  const [beforeHr, afterHr] = splitByHr(rest);

  const promoText = stripHtmlTags(promo?.body ?? "");
  const accordionItems = splitAccordionByH1(tech?.body ?? "");

  return (
    <AdvertisingPageView
      heroText={heroText}
      noteText={noteText}
      beforeHr={beforeHr}
      afterHr={afterHr}
      promoText={promoText}
      accordionItems={accordionItems}
    />
  );
}
