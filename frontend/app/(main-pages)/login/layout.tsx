import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Вход",
  description: "Войдите в LOSboard, чтобы продолжить работу с объявлениями.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
