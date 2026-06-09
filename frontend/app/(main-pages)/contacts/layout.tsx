import type { Metadata } from "next";
import { getContentPage } from "@/src/entities/content";
import { siteOrigin } from "@/src/shared/lib/server-api";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContentPage("contacts").catch(() => null);
  const title = page?.title ?? "Связаться с нами";
  const description =
    "Контактные данные службы поддержки и график работы LOS Daily.";
  const ogImage = `${siteOrigin()}/los.jpg`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
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

export default function ContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
