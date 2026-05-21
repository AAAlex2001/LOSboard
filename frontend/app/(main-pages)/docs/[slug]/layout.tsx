import type { Metadata } from "next";
import { DOCS } from "./data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = DOCS[slug];
  if (!doc) {
    return {
      title: "Документ не найден",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: doc.title,
    description: `${doc.title} — официальный документ LOSboard.`,
  };
}

export default function DocSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
