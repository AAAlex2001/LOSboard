import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Мои объявления",
  description: "Ваши размещённые объявления на LOS Daily.",
  robots: { index: false, follow: false },
};

export default function MyAdsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
