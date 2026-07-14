// Thin fetch wrapper: prefixes /api/v1, attaches the right bearer token, and
// transparently refreshes an expired user access token once before failing.
import { API_V1 } from "./env";
import { authStore } from "./auth-store";

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  context?: "user" | "device" | "public";
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = authStore.refresh;
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_V1}/auth/refresh`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const tokens = (await res.json()) as { accessToken: string; refreshToken: string };
    authStore.updateTokens(tokens);
    return true;
  } catch {
    return false;
  }
}

export async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, context = "user" } = opts;

  const doFetch = () => {
    const headers: Record<string, string> = {};
    if (body !== undefined) headers["content-type"] = "application/json";
    if (context !== "public") {
      const token = authStore.bearerFor(context === "device" ? "device" : "user");
      if (token) headers.authorization = `Bearer ${token}`;
    }
    return fetch(`${API_V1}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  };

  let res = await doFetch();
  if (res.status === 401 && context === "user" && (await refreshAccessToken())) {
    res = await doFetch();
  }
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new HttpError(res.status, (detail as { message?: string }).message ?? res.statusText);
  }
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
