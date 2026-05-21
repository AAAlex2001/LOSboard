import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Мои объявления",
  description: "Ваши размещённые объявления на LOSboard.",
};

export default function MyAdsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
