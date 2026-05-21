"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
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
  const refreshRef = useRef<() => void>(() => {});

  refreshRef.current = () => {
    if (!isAuthenticated()) {
      setTotal(0);
      return;
    }
    getUnreadTotal()
      .then(({ count }) => setTotal(count))
      .catch(() => {});
  };

  useEffect(() => {
    refreshRef.current();
    const onAuth = () => refreshRef.current();
    const onFocus = () => refreshRef.current();
    window.addEventListener("auth:changed", onAuth);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("auth:changed", onAuth);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const refresh = () => refreshRef.current();
  const decrement = (by: number) => {
    if (by <= 0) return;
    setTotal((prev) => Math.max(0, prev - by));
  };

  return (
    <UnreadContext.Provider value={{ total, decrement, refresh }}>
      {children}
    </UnreadContext.Provider>
  );
};
