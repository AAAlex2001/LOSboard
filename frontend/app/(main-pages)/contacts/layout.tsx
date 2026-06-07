import type { Metadata } from "next";
import { getContentPage } from "@/src/entities/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContentPage("contacts").catch(() => null);
  const title = page?.title ?? "Связаться с нами";
  const description =
    "Контактные данные службы поддержки и график работы LOS Daily.";
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default function ContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
