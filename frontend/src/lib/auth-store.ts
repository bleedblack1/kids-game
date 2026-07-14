// Token storage for human accounts (teacher/parent/admin) and the child device
// token. Access token is kept in memory; refresh + device tokens persist in
// localStorage so a returning child device keeps its identity.

interface Tokens {
  accessToken: string | null;
  refreshToken: string | null;
}

export type UserRole = "ADMIN" | "TEACHER" | "PARENT";

export interface Principal {
  sub: string;
  role: UserRole;
  email?: string;
  exp?: number;
}

const REFRESH_KEY = "kalqy.refresh";
const DEVICE_KEY = "kalqy.deviceToken";
const PLAYER_KEY = "kalqy.playerId";

let accessToken: string | null = null;

/** Decode a JWT payload (base64url) without verifying — for UI gating only. */
function decodeJwt(token: string | null): Principal | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload)) as Principal;
  } catch {
    return null;
  }
}

export const authStore = {
  get access() {
    return accessToken;
  },
  get refresh() {
    return localStorage.getItem(REFRESH_KEY);
  },
  get deviceToken() {
    return localStorage.getItem(DEVICE_KEY);
  },
  get playerId() {
    return localStorage.getItem(PLAYER_KEY);
  },
  /** Decoded human principal from the access token (null if not logged in). */
  get principal(): Principal | null {
    return decodeJwt(accessToken);
  },
  get isAuthenticated(): boolean {
    return this.principal !== null;
  },

  setUserTokens({
    accessToken: a,
    refreshToken: r,
  }: {
    accessToken: string;
    refreshToken: string;
  }) {
    accessToken = a;
    localStorage.setItem(REFRESH_KEY, r);
  },

  setDevice({ deviceToken, playerId }: { deviceToken: string; playerId: string }) {
    localStorage.setItem(DEVICE_KEY, deviceToken);
    localStorage.setItem(PLAYER_KEY, playerId);
  },

  updateTokens({ accessToken: a, refreshToken: r }: Tokens) {
    accessToken = a;
    if (r) localStorage.setItem(REFRESH_KEY, r);
  },

  clearUser() {
    accessToken = null;
    localStorage.removeItem(REFRESH_KEY);
  },

  /** The bearer token to use for a given call context. */
  bearerFor(context: "user" | "device"): string | null {
    return context === "device" ? this.deviceToken : accessToken;
  },
};
