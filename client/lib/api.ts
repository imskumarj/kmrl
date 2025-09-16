export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

const TOKEN_KEY = "cm_token";

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function getToken(): string | null {
  return typeof localStorage === "undefined" ? null : localStorage.getItem(TOKEN_KEY);
}

export async function apiFetch<T>(url: string, options: { method?: HttpMethod; body?: any } = {}): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
