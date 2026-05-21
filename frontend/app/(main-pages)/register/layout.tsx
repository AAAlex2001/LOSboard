import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Регистрация",
  description:
    "Зарегистрируйтесь в LOSboard, чтобы размещать объявления и общаться с продавцами.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
