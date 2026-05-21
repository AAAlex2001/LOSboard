import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Размещение рекламы на сайте LOS",
  description:
    "Форматы рекламных размещений на LOSboard: баннеры, продвижение объявлений, тарифы и условия.",
};

export default function AdvertisingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
