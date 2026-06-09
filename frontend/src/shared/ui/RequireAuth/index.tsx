"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@/src/shared/ui/Loader";
import { useIsAuthenticated } from "@/src/shared/auth/useIsAuthenticated";

interface RequireAuthProps {
  children: ReactNode;
  redirectTo?: string;
  fallback?: ReactNode;
}

/**
 * Гейт доступа: при отсутствии авторизации на клиенте уводит на redirectTo
 * и показывает fallback, иначе рендерит children. Редирект живёт в useEffect
 * (router.replace не является setState), что обходит set-state-in-effect.
 */
export const RequireAuth = ({
  children,
  redirectTo = "/login",
  fallback,
}: RequireAuthProps) => {
  const router = useRouter();
  const authenticated = useIsAuthenticated();

  useEffect(() => {
    if (!authenticated) {
      router.replace(redirectTo);
    }
  }, [authenticated, redirectTo, router]);

  if (!authenticated) {
    return (
      fallback ?? (
        <Loader />
      )
    );
  }

  return <>{children}</>;
};
