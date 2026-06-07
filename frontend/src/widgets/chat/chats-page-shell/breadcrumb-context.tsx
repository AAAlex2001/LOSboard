"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type SetLabel = (label: string | null) => void;

const ChatThreadBreadcrumbContext = createContext<SetLabel | null>(null);

interface ProviderProps {
  setLabel: SetLabel;
  children: ReactNode;
}

export function ChatThreadBreadcrumbProvider({
  setLabel,
  children,
}: ProviderProps) {
  return (
    <ChatThreadBreadcrumbContext.Provider value={setLabel}>
      {children}
    </ChatThreadBreadcrumbContext.Provider>
  );
}

export function useChatThreadBreadcrumbState() {
  return useState<string | null>(null);
}

export function useSetChatThreadBreadcrumb(label: string | null) {
  const setter = useContext(ChatThreadBreadcrumbContext);
  useEffect(() => {
    if (!setter) return;
    setter(label);
    return () => setter(null);
  }, [setter, label]);
}
