"use client";

import { useParams, useRouter } from "next/navigation";
import { ConversationThread } from "@/src/widgets/chat/conversation-thread";

export default function ChatThreadPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const conversationId = Number(params?.id);

  if (!Number.isFinite(conversationId)) {
    return <p style={{ margin: "auto" }}>Некорректный идентификатор чата</p>;
  }

  return (
    <ConversationThread
      conversationId={conversationId}
      onClose={() => router.push("/chats")}
    />
  );
}
