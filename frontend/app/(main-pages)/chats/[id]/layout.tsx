import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Чат",
  description: "Переписка с пользователем на LOSboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ChatThreadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
