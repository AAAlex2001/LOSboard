import type { Metadata } from "next";
import { getContentPage } from "@/src/entities/content";
import { siteOrigin } from "@/src/shared/lib/server-api";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContentPage("pricing").catch(() => null);
  const title = page?.title ?? "Реклама в «LOS»";
  const description = "Размещение рекламы и тарифы на доске объявлений LOS Daily.";
  const ogImage = `${siteOrigin()}/los.jpg`;
  return {
    title,
    description,
    alternates: { canonical: `${siteOrigin()}/advertising` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${siteOrigin()}/advertising`,
      siteName: "LOS Daily",
      locale: "ru_RU",
      images: [{ url: ogImage, alt: "LOS Daily" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function AdvertisingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
