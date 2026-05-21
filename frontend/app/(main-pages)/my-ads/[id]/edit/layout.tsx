import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Редактирование объявления",
  description: "Изменение и удаление вашего объявления на LOSboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EditAdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
