import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Вход",
  description: "Войдите в LOS Daily, чтобы продолжить работу с объявлениями.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
