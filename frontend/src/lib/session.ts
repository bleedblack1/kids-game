// Child session bootstrap. On app start we ensure this device is registered
// with the backend so it holds a scoped device token + playerId — this is what
// activates gameplay telemetry and progress sync to the database. Kids never
// log in; a lightweight local profile is enough.
import { registerDevice, currentPlayerId, type AgeBand, type ChildProfile } from "./device";
import { flush } from "./sync-queue";

const PROFILE_KEY = "kalqy.childProfile";

const DEFAULT_PROFILE: ChildProfile = {
  name: "Explorer",
  avatar: "🦁",
  ageBand: "BAND_4_5",
};

function getChildProfile(): ChildProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

let ensuring: Promise<string | null> | null = null;

/**
 * Idempotent: registers the device once (or re-registers if the profile
 * changed), caches the resulting device token + playerId, and drains any
 * queued events/progress. Safe to call on every boot.
 */
export function ensureDevice(profile?: ChildProfile): Promise<string | null> {
  if (currentPlayerId() && !profile) return Promise.resolve(currentPlayerId());
  if (ensuring) return ensuring;

  const p = profile ?? getChildProfile();
  ensuring = registerDevice(p)
    .then((playerId) => {
      void flush(); // send anything captured before the token existed
      return playerId;
    })
    .catch(() => null) // offline: games still work; sync retries later
    .finally(() => {
      ensuring = null;
    });
  return ensuring;
}

export type { AgeBand };
