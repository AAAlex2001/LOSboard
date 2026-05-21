function emitAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth:changed"));
  }
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
  emitAuthChange();
}

export function getAccessToken(): string | null {
  return localStorage.getItem("access_token");
}

export function getRefreshToken(): string | null {
  return localStorage.getItem("refresh_token");
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  emitAuthChange();
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}