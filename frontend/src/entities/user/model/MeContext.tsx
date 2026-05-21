"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { User } from "./types";
import { getMe } from "../api/user.api";
import { isAuthenticated } from "@/src/shared/auth/auth-storage";

interface MeContextValue {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  refresh: () => void;
}

const MeContext = createContext<MeContextValue>({
  user: null,
  loading: true,
  setUser: () => {},
  refresh: () => {},
});

export const useMeContext = () => useContext(MeContext);

export const MeProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    if (!isAuthenticated()) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getMe()
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <MeContext.Provider value={{ user, loading, setUser, refresh }}>
      {children}
    </MeContext.Provider>
  );
};
