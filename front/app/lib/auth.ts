export function getAccessToken(): string {
  if (typeof window === "undefined") return "";
  const auth = localStorage.getItem("auth");
  if (!auth) return "";
  try {
    return JSON.parse(auth).access ?? "";
  } catch {
    return "";
  }
}

export function getRefreshToken(): string {
  if (typeof window === "undefined") return "";
  const auth = localStorage.getItem("auth");
  if (!auth) return "";
  try {
    return JSON.parse(auth).refresh ?? "";
  } catch {
    return "";
  }
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem("auth", JSON.stringify({ access, refresh }));
}

export function removeTokens() {
  localStorage.removeItem("auth");
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function setUser(user: Record<string, unknown>) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function removeUser() {
  localStorage.removeItem("user");
}
