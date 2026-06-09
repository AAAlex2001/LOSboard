"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@/src/shared/ui/Loader";
import { useIsAuthenticated } from "@/src/shared/auth/useIsAuthenticated";
import { useHydrated } from "@/src/shared/lib/useHydrated";

interface RequireAuthProps {
  children: ReactNode;
  redirectTo?: string;
  fallback?: ReactNode;
}

/**
 * Гейт доступа. До гидрации localStorage недоступен и снапшот авторизации
 * всегда false — поэтому редирект разрешён только после useHydrated, иначе
 * авторизованного выкидывало бы на /login при каждой перезагрузке.
 */
export const RequireAuth = ({
  children,
  redirectTo = "/login",
  fallback,
}: RequireAuthProps) => {
  const router = useRouter();
  const hydrated = useHydrated();
  const authenticated = useIsAuthenticated();

  useEffect(() => {
    if (hydrated && !authenticated) {
      router.replace(redirectTo);
    }
  }, [hydrated, authenticated, redirectTo, router]);

  if (!hydrated || !authenticated) {
    return fallback ?? <Loader />;
  }

  return <>{children}</>;
};
