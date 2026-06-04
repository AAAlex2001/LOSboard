import type { Metadata } from "next";
import { getContentPage } from "@/src/entities/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContentPage("pricing").catch(() => null);
  const title = page?.title ?? "Реклама в «LOS»";
  const description = "Размещение рекламы и тарифы на доске объявлений LOSboard.";
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default function AdvertisingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
