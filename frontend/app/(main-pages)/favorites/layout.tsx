import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Избранное",
  description: "Сохранённые объявления на LOSboard.",
};

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
