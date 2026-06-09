export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getContentPage } from "@/src/entities/content";
import { siteOrigin } from "@/src/shared/lib/server-api";

interface Props {
  params: Promise<{ slug: string }>;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getContentPage(slug).catch(() => null);
  if (!page) {
    return {
      title: "Документ не найден",
      robots: { index: false, follow: false },
    };
  }
  const origin = siteOrigin();
  const ogImage = `${origin}/los.jpg`;
  const canonical = `${origin}/docs/${slug}`;
  const description =
    stripHtml(page.body).slice(0, 160) ||
    `${page.title} — официальный документ LOS Daily.`;
  return {
    title: page.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: page.title,
      description,
      type: "article",
      url: canonical,
      siteName: "LOS Daily",
      locale: "ru_RU",
      images: [{ url: ogImage, alt: "LOS Daily" }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description,
      images: [ogImage],
    },
  };
}

export default function DocSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
