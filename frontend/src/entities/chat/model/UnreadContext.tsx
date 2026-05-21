"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getUnreadTotal } from "../api/chat.api";
import { isAuthenticated } from "@/src/shared/auth/auth-storage";

interface UnreadContextValue {
  total: number;
  decrement: (by: number) => void;
  refresh: () => void;
}

const UnreadContext = createContext<UnreadContextValue>({
  total: 0,
  decrement: () => {},
  refresh: () => {},
});

export const useUnreadTotal = () => useContext(UnreadContext);

export const UnreadProvider = ({ children }: { children: React.ReactNode }) => {
  const [total, setTotal] = useState(0);

  const refresh = useCallback(() => {
    if (!isAuthenticated()) {
      setTotal(0);
      return;
    }
    getUnreadTotal()
      .then(({ count }) => setTotal(count))
      .catch(() => {});
  }, []);

  const decrement = useCallback((by: number) => {
    if (by <= 0) return;
    setTotal((prev) => Math.max(0, prev - by));
  }, []);

  useEffect(() => {
    refresh();
    const handleFocus = () => refresh();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refresh]);

  return (
    <UnreadContext.Provider value={{ total, decrement, refresh }}>
      {children}
    </UnreadContext.Provider>
  );
};
