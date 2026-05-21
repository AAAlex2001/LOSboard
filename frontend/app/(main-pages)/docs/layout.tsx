import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Документы сайта",
  description:
    "Правила размещения объявлений, политика конфиденциальности, пользовательское соглашение и список запрещённых товаров.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
