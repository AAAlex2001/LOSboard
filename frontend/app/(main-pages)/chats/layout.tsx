import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Сообщения",
  description: "Чаты с продавцами и покупателями на LOS Daily.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
