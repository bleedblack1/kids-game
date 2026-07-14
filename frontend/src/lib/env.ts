// Frontend runtime config. In dev, Vite proxies /api → NestJS on :3001, so the
// default base is same-origin. In prod, set VITE_API_BASE to the API host.
export const API_BASE = import.meta.env.VITE_API_BASE ?? "";
export const API_V1 = `${API_BASE}/api/v1`;
