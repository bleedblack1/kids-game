// Typed API client for the NestJS backend (v1). Reads go through the HTTP
// wrapper; gameplay writes go through the offline outbox so they survive
// connectivity drops. This layer also ADAPTS the app's internal lowercase
// event/skill taxonomy (see analytics.ts) to the backend's enum contract, so
// existing games don't need to change.
import { request, HttpError } from "./http";
import { enqueue } from "./sync-queue";
import { authStore } from "./auth-store";
import { currentPlayerId, type AgeBand } from "./device";

// ----- content -----

export interface ApiWord {
  word: string;
  emoji: string;
  ageBand?: AgeBand;
}

export async function fetchWords(ageBand?: AgeBand): Promise<ApiWord[] | null> {
  try {
    const q = ageBand ? `?ageBand=${ageBand}` : "";
    const data = await request<{ words: ApiWord[] }>(`/words${q}`, { context: "public" });
    return data.words?.length ? data.words : null;
  } catch {
    return null;
  }
}

// ----- gameplay telemetry (offline-queued) -----

export type EventType =
  | "SESSION_START"
  | "SESSION_END"
  | "ANSWER_CORRECT"
  | "ANSWER_WRONG"
  | "LEVEL_COMPLETE"
  | "GESTURE_JUMP"
  | "GESTURE_SQUAT"
  | "GESTURE_LANE"
  | "WORD_SPELLED"
  | "REWARD_EARNED";

export type Skill =
  "VOCABULARY" | "NUMERACY" | "COORDINATION" | "BALANCE" | "BODY_AWARENESS" | "MEMORY";

// Map the app's internal lowercase names → backend enums. Values already in the
// enum form pass straight through.
const EVENT_MAP: Record<string, EventType> = {
  "session-start": "SESSION_START",
  "session-end": "SESSION_END",
  correct: "ANSWER_CORRECT",
  wrong: "ANSWER_WRONG",
  attempt: "LEVEL_COMPLETE",
  movement: "GESTURE_JUMP",
  milestone: "REWARD_EARNED",
};
const SKILL_MAP: Record<string, Skill> = {
  balance: "BALANCE",
  coordination: "COORDINATION",
  bodyAwareness: "BODY_AWARENESS",
  vocabulary: "VOCABULARY",
  numeracy: "NUMERACY",
  memory: "MEMORY",
};
const EVENT_ENUMS = new Set<string>(Object.values(EVENT_MAP));
const SKILL_ENUMS = new Set<string>(Object.values(SKILL_MAP));

function toEventType(t: string): EventType | null {
  if (EVENT_MAP[t]) return EVENT_MAP[t];
  return EVENT_ENUMS.has(t) ? (t as EventType) : null;
}
function toSkill(s?: string): Skill | undefined {
  if (!s) return undefined;
  if (SKILL_MAP[s]) return SKILL_MAP[s];
  return SKILL_ENUMS.has(s) ? (s as Skill) : undefined;
}

/** Enqueue a gameplay event. Accepts internal or enum type/skill names. */
export function postEvent(event: {
  game: string;
  type: EventType | string;
  skill?: Skill | string;
  value?: number;
  label?: string;
}) {
  const type = toEventType(event.type);
  if (!type || !currentPlayerId()) return; // unmappable or no device identity yet
  void enqueue("event", "/events", {
    game: event.game,
    type,
    skill: toSkill(event.skill),
    value: event.value,
    label: event.label,
  });
}

export interface ProgressSnapshot {
  coins: number;
  stickers: string[];
  streakDays: number;
  lastPlayed: string | null;
}

export function postProgress(playerId: string, progress: ProgressSnapshot) {
  void enqueue("progress", `/progress/${encodeURIComponent(playerId)}`, progress);
}

export async function fetchProgress(playerId: string): Promise<ProgressSnapshot | null> {
  try {
    const data = await request<{ progress: ProgressSnapshot | null }>(
      `/progress/${encodeURIComponent(playerId)}`,
      { context: authStore.deviceToken ? "device" : "user" },
    );
    return data.progress;
  } catch {
    return null;
  }
}

// ----- dashboards (require a logged-in teacher/parent) -----

export interface RosterEntry {
  id: string;
  name: string;
  avatar: string;
  coins: number;
  stickers: number;
  streak: number;
  topSkill: string;
}

/**
 * Class roster, derived server-side from real progress + events. `classId` is
 * required by the backend; called without one (offline/no class), returns null
 * so callers keep their local fallback.
 */
export async function fetchLeaderboard(classId?: string): Promise<RosterEntry[] | null> {
  if (!classId) return null;
  try {
    const data = await request<{
      roster: (Omit<RosterEntry, "topSkill"> & { topSkill: string | null })[];
    }>(`/leaderboard?classId=${encodeURIComponent(classId)}`);
    return data.roster.map((r) => ({ ...r, topSkill: r.topSkill ?? "" }));
  } catch {
    return null;
  }
}

// ----- auth (teacher/parent/admin) -----

export async function login(email: string, password: string): Promise<boolean> {
  try {
    const tokens = await request<{ accessToken: string; refreshToken: string }>("/auth/login", {
      method: "POST",
      context: "public",
      body: { email, password },
    });
    authStore.setUserTokens(tokens);
    return true;
  } catch (err) {
    if (err instanceof HttpError && err.status === 401) return false;
    throw err;
  }
}

/** Restore a logged-in session after reload using the persisted refresh token. */
export async function restoreSession(): Promise<boolean> {
  const refreshToken = authStore.refresh;
  if (!refreshToken) return false;
  try {
    const tokens = await request<{ accessToken: string; refreshToken: string }>("/auth/refresh", {
      method: "POST",
      context: "public",
      body: { refreshToken },
    });
    authStore.updateTokens(tokens);
    return true;
  } catch {
    authStore.clearUser();
    return false;
  }
}

export async function logout(): Promise<void> {
  try {
    await request("/auth/logout", { method: "POST" });
  } catch {
    /* ignore */
  }
  authStore.clearUser();
}

// ----- classes (teacher/admin) -----

export interface ClassInfo {
  id: string;
  name: string;
  school: string;
  playerCount: number;
}

export async function fetchClasses(): Promise<ClassInfo[] | null> {
  try {
    const data = await request<{ classes: ClassInfo[] }>("/classes");
    return data.classes;
  } catch {
    return null;
  }
}

// ----- parent feedback -----

export interface FeedbackPayload {
  parentName?: string;
  contact?: string;
  childAge?: string;
  rating?: number; // 1–5; 0/undefined = not answered
  enjoyed?: string;
  aspects?: string[];
  recommend?: number | null; // 0–10 NPS
  refer?: string;
  improve?: string;
}

export interface FeedbackEntry {
  parentName: string | null;
  contact: string | null;
  childAge: string | null;
  rating: number | null;
  enjoyed: string | null;
  aspects: string[];
  recommend: number | null;
  refer: string | null;
  improve: string | null;
  ts: number;
}

/** Submit the parent survey. Sanitizes "not answered" sentinels for the API. */
export function postFeedback(feedback: FeedbackPayload) {
  const body: FeedbackPayload = {
    ...feedback,
    rating: feedback.rating && feedback.rating >= 1 ? feedback.rating : undefined,
    recommend: feedback.recommend == null ? undefined : feedback.recommend,
  };
  void request("/feedback", { method: "POST", context: "public", body }).catch(() => {});
}

/** Admin-only feedback read. Returns null if not authorized. */
export async function fetchFeedback(): Promise<FeedbackEntry[] | null> {
  try {
    const data = await request<{
      feedback: (Omit<FeedbackEntry, "ts"> & { createdAt: string })[];
    }>("/feedback");
    return data.feedback.map((f) => ({ ...f, ts: new Date(f.createdAt).getTime() }));
  } catch {
    return null;
  }
}
