export function getToken(): string | null {
  return localStorage.getItem("token"); // ✅ FIX
}

export function setToken(token: string): void {
  localStorage.setItem("token", token); // ✅ same
}

export function clearToken(): void {
  localStorage.removeItem("token"); // ✅ FIX
}

export const isLoggedIn = () => {
  return !!localStorage.getItem("token"); // ✅ already correct
};