"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { login, type LoginResponse } from "@/src/shared/auth/auth-api";
import { getAccessToken, logout } from "@/src/shared/auth/auth-storage";
import { apiFetch } from "@/src/shared/auth/api-fetch";

type User = {
  id: number;
  email: string;
  name: string;
};

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => void;
  reloadUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function mapLoginResponseToUser(data: LoginResponse): User {
  return {
    id: data.id,
    email: data.email,
    name: data.name,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function reloadUser() {
    const accessToken = getAccessToken();

    if (!accessToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiFetch("auth/me");

      if (response.ok) {
        const data: User = await response.json();
        setUser(data);
      } else if (response.status === 401 || response.status === 403) {
        logout();
        setUser(null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function loginUser(email: string, password: string) {
    const data = await login(email, password);
    setUser(mapLoginResponseToUser(data));
  }

  function logoutUser() {
    logout();
    setUser(null);
    window.location.href = "/login";
  }

  useEffect(() => {
    reloadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        loginUser,
        logoutUser,
        reloadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth должен использоваться внутри AuthProvider");
  }

  return context;
}