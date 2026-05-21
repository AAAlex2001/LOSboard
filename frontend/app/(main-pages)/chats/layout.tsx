import type { Metadata } from "next";
import { ChatsPageShell } from "@/src/widgets/chat/chats-page-shell";

export const metadata: Metadata = {
  title: "Сообщения",
  description: "Чаты с продавцами и покупателями на LOSboard.",
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
  return <ChatsPageShell>{children}</ChatsPageShell>;
}
