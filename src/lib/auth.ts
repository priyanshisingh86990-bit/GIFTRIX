export function getToken(): string | null {
  return localStorage.getItem("giftrix_token");
}

export function setToken(token: string): void {
  localStorage.setItem("giftrix_token", token);
}

export function clearToken(): void {
  localStorage.removeItem("giftrix_token");
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
