import { useSyncExternalStore } from "react";

function subscribe(): () => void {
  return () => {};
}

function getSnapshot(): boolean {
  return true;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Возвращает true только после гидрации на клиенте. Используется как
 * SSR-безопасный гейт для порталов вместо useState+useEffect, что убирает
 * паттерн set-state-in-effect.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
