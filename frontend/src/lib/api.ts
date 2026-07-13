// Thin client for the Node.js backend. Every call degrades gracefully —
// the games keep working offline with their built-in defaults.

export interface ApiWord {
  word: string;
  emoji: string;
}

export interface ApiRosterKid {
  id: string;
  name: string;
  avatar: string;
  coins: number;
  stickers: number;
  streak: number;
  topSkill: string;
}

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchWords(): Promise<ApiWord[] | null> {
  const data = await getJson<{ words: ApiWord[] }>("/api/words");
  return data?.words?.length ? data.words : null;
}

export async function fetchLeaderboard(): Promise<ApiRosterKid[] | null> {
  const data = await getJson<{ roster: ApiRosterKid[] }>("/api/leaderboard");
  return data?.roster?.length ? data.roster : null;
}

// Fire-and-forget: never blocks or breaks gameplay.
export function postEvent(event: {
  game: string;
  type: string;
  skill?: string;
  value?: number;
  label?: string;
}) {
  try {
    void fetch("/api/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(event),
    }).catch(() => {});
  } catch {
    // offline — ignore
  }
}

export interface FeedbackPayload {
  parentName: string; // parent's name
  contact: string; // email or phone
  childAge: string; // "3–5 years" | "5–7 years" | ""
  rating: number; // overall satisfaction, 1–5 (0 = not answered)
  enjoyed: string; // "Did your child enjoy learning while playing?"
  aspects: string[]; // what the child enjoyed most (multi-select)
  recommend: number | null; // NPS 0–10
  refer: string; // "would you refer to others?" — "Yes" | "No" | ""
  improve: string; // free-text "What can we improve?"
}

// A stored feedback entry as returned by the backend.
export interface FeedbackEntry {
  parentName: string;
  contact: string;
  childAge: string;
  rating: number | null;
  enjoyed: string | null;
  aspects: string[];
  recommend: number | null;
  refer: string;
  improve: string;
  ts: number;
}

export async function fetchFeedback(): Promise<FeedbackEntry[] | null> {
  const data = await getJson<{ feedback: FeedbackEntry[] }>("/api/feedback");
  return data?.feedback ?? null;
}

// Fire-and-forget: parent feedback never blocks the UI.
export function postFeedback(feedback: FeedbackPayload) {
  try {
    void fetch("/api/feedback", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(feedback),
    }).catch(() => {});
  } catch {
    // offline — ignore
  }
}

export function postProgress(
  playerId: string,
  progress: {
    coins: number;
    stickers: string[];
    streakDays: number;
    lastPlayed: string | null;
  },
) {
  try {
    void fetch(`/api/progress/${encodeURIComponent(playerId)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(progress),
    }).catch(() => {});
  } catch {
    // offline — ignore
  }
}
