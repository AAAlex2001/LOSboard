import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Связаться с нами",
  description:
    "Контактные данные LOSboard: телефон колл-центра, чат-бот в Telegram, электронная почта, график работы офиса.",
};

export default function ContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
