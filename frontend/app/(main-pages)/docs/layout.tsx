import type { Metadata } from "next";
import { siteOrigin } from "@/src/shared/lib/server-api";

export function generateMetadata(): Metadata {
  const origin = siteOrigin();
  const ogImage = `${origin}/los.jpg`;
  const title = "Документы сайта";
  const description =
    "Правила размещения объявлений, политика конфиденциальности, пользовательское соглашение и список запрещённых товаров.";
  return {
    title,
    description,
    alternates: { canonical: `${origin}/docs` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${origin}/docs`,
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

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
