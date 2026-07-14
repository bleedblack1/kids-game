// Child device identity. A stable UUID is minted once per device and exchanged
// with the backend for a scoped device token + playerId. No child login screen.
import { request } from "./http";
import { authStore } from "./auth-store";

export type AgeBand = "BAND_3_4" | "BAND_4_5" | "BAND_5_6";

const DEVICE_ID_KEY = "kalqy.deviceId";

function getOrCreateDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export interface ChildProfile {
  name: string;
  avatar: string;
  ageBand: AgeBand;
  classId?: string;
}

/** Register (or re-register) this device's child and cache the device token. */
export async function registerDevice(profile: ChildProfile): Promise<string> {
  const deviceId = getOrCreateDeviceId();
  const res = await request<{ playerId: string; deviceToken: string }>("/auth/device", {
    method: "POST",
    context: "public",
    body: { deviceId, ...profile },
  });
  authStore.setDevice(res);
  return res.playerId;
}

export function currentPlayerId(): string | null {
  return authStore.playerId;
}
