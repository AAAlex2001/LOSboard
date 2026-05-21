import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Объявление",
  description: "Подробности об объявлении на LOSboard.",
};

export default function AdvertisementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
