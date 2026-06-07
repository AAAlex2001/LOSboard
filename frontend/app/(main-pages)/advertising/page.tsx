export const dynamic = "force-dynamic";

import { AdvertisingPageView } from "@/src/widgets/advertising-page";
import {
  ADVERTISING_ACCORDION_SLUGS,
  extractLeadingParagraphs,
  splitByHr,
  stripHtmlTags,
} from "@/src/widgets/advertising-page/extract-content";
import { getContentPage } from "@/src/entities/content";

export default async function AdvertisingPage() {
  const [main, promo, ...techPages] = await Promise.all([
    getContentPage("pricing").catch(() => null),
    getContentPage("pricing-promo").catch(() => null),
    ...ADVERTISING_ACCORDION_SLUGS.map((slug) =>
      getContentPage(slug).catch(() => null),
    ),
  ]);

  const body = main?.body ?? "";
  const { paragraphs, rest } = extractLeadingParagraphs(body, 2);
  const heroText = paragraphs[0] ?? "";
  const noteText = paragraphs[1] ?? "";
  const [beforeHr, afterHr] = splitByHr(rest);

  const promoText = stripHtmlTags(promo?.body ?? "");
  const accordionItems = ADVERTISING_ACCORDION_SLUGS.map((_, index) => ({
    title: techPages[index]?.title ?? "",
    body: techPages[index]?.body ?? "",
  })).filter((item) => item.body.trim() && item.title.trim());

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
