import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Забыли пароль?",
  description: "Восстановите доступ к аккаунту LOS Daily.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
