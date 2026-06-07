export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getContentPage } from "@/src/entities/content";

interface Props {
  params: Promise<{ slug: string }>;
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
  return {
    title: page.title,
    description: `${page.title} — официальный документ LOS Daily.`,
  };
}

export default function DocSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
