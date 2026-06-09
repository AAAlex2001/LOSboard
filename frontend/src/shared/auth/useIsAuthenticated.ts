import { useSyncExternalStore } from "react";
import { isAuthenticated } from "@/src/shared/auth/auth-storage";

function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener("auth:changed", onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener("auth:changed", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot(): boolean {
  return isAuthenticated();
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Возвращает признак авторизации из внешнего стора без useState+useEffect.
 * Синхронное чтение убирает паттерн set-state-in-effect и держит значение
 * консистентным между Header, бургер-меню и auth-гейтами.
 */
export function useIsAuthenticated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
