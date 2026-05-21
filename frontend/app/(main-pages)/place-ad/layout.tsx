import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Разместить объявление",
  description:
    "Разместите объявление на LOSboard — выберите категорию, добавьте фото и описание, укажите цену.",
};

export default function PlaceAdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
