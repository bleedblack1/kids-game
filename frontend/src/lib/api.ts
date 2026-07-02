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
