// Persistent progress for Dino Adventure Run: stars, eggs, unlockable dino
// characters, achievement badges, daily rewards and the world progress map.

const KEY = "kalqy.dino.v1";

export interface DinoCharacter {
  id: string;
  name: string;
  body: string;
  belly: string;
  spikes: string;
  eggsNeeded: number;
}

export const DINO_CHARACTERS: DinoCharacter[] = [
  { id: "rex", name: "Rex", body: "#58c66b", belly: "#e7f9d0", spikes: "#2e9e4f", eggsNeeded: 0 },
  {
    id: "bubbles",
    name: "Bubbles",
    body: "#56a8f5",
    belly: "#dcefff",
    spikes: "#2f6fd0",
    eggsNeeded: 8,
  },
  {
    id: "rosie",
    name: "Rosie",
    body: "#f57fc0",
    belly: "#ffe3f2",
    spikes: "#d8459a",
    eggsNeeded: 20,
  },
  {
    id: "sunny",
    name: "Sunny",
    body: "#f8a13f",
    belly: "#ffedcf",
    spikes: "#e06d10",
    eggsNeeded: 35,
  },
  {
    id: "twilight",
    name: "Twilight",
    body: "#9d6ef0",
    belly: "#ece0ff",
    spikes: "#6f3cc7",
    eggsNeeded: 55,
  },
];

export interface DinoBadge {
  id: string;
  name: string;
  emoji: string;
  desc: string;
}

export const DINO_BADGES: DinoBadge[] = [
  { id: "first-run", name: "First Adventure", emoji: "🎈", desc: "Finished your first run!" },
  { id: "egg-hunter", name: "Egg Hunter", emoji: "🥚", desc: "Collected 10 dino eggs!" },
  { id: "star-catcher", name: "Star Catcher", emoji: "⭐", desc: "Caught 15 bonus stars!" },
  { id: "forest-friend", name: "Forest Friend", emoji: "🌳", desc: "Finished Green Forest!" },
  { id: "river-runner", name: "River Runner", emoji: "🏞️", desc: "Finished River Valley!" },
  { id: "lava-leaper", name: "Lava Leaper", emoji: "🌋", desc: "Finished Volcano Land!" },
  { id: "snow-star", name: "Snow Star", emoji: "❄️", desc: "Finished Snow World!" },
  { id: "candy-champ", name: "Candy Champ", emoji: "🍭", desc: "Finished Candy Land!" },
  {
    id: "heart-keeper",
    name: "Heart Keeper",
    emoji: "💖",
    desc: "Finished a world with all hearts!",
  },
  {
    id: "super-jumper",
    name: "Super Jumper",
    emoji: "🦘",
    desc: "25 real jumps in one adventure!",
  },
];

export const WORLD_BADGE_IDS = [
  "forest-friend",
  "river-runner",
  "lava-leaper",
  "snow-star",
  "candy-champ",
];

export interface DinoProgress {
  stars: number; // total stars earned (level ratings + bonus stars)
  eggs: number;
  coins: number;
  gems: number;
  bestScore: number;
  worldsCompleted: number; // 0..5, highest world finished
  selected: string; // character id
  badges: string[];
  lastDaily: string | null; // YYYY-MM-DD
}

const DEFAULTS: DinoProgress = {
  stars: 0,
  eggs: 0,
  coins: 0,
  gems: 0,
  bestScore: 0,
  worldsCompleted: 0,
  selected: "rex",
  badges: [],
  lastDaily: null,
};

let cache: DinoProgress | null = null;
const listeners = new Set<() => void>();

function load(): DinoProgress {
  if (typeof window === "undefined") return { ...DEFAULTS };
  try {
    return { ...DEFAULTS, ...(JSON.parse(window.localStorage.getItem(KEY) || "null") || {}) };
  } catch {
    return { ...DEFAULTS };
  }
}

function save(p: DinoProgress) {
  cache = p;
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, JSON.stringify(p));
  listeners.forEach((l) => l());
}

export function getDinoProgress(): DinoProgress {
  if (!cache) cache = load();
  return cache;
}

export function subscribeDinoProgress(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function updateDinoProgress(patch: Partial<DinoProgress>): DinoProgress {
  const next = { ...getDinoProgress(), ...patch };
  save(next);
  return next;
}

export function isCharacterUnlocked(id: string): boolean {
  const c = DINO_CHARACTERS.find((x) => x.id === id);
  if (!c) return false;
  return getDinoProgress().eggs >= c.eggsNeeded;
}

export function selectCharacter(id: string) {
  if (isCharacterUnlocked(id)) updateDinoProgress({ selected: id });
}

export function getSelectedCharacter(): DinoCharacter {
  const p = getDinoProgress();
  return (
    DINO_CHARACTERS.find((c) => c.id === p.selected && isCharacterUnlocked(c.id)) ||
    DINO_CHARACTERS[0]
  );
}

// Returns the badge if it was newly unlocked, else null.
export function unlockDinoBadge(id: string): DinoBadge | null {
  const p = getDinoProgress();
  if (p.badges.includes(id)) return null;
  const badge = DINO_BADGES.find((b) => b.id === id);
  if (!badge) return null;
  save({ ...p, badges: [...p.badges, id] });
  return badge;
}

// Daily treasure chest: once per calendar day.
export function canClaimDaily(): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return getDinoProgress().lastDaily !== today;
}

export function claimDaily(): { coins: number; eggs: number } | null {
  if (!canClaimDaily()) return null;
  const today = new Date().toISOString().slice(0, 10);
  const reward = { coins: 20, eggs: 1 };
  const p = getDinoProgress();
  save({
    ...p,
    coins: p.coins + reward.coins,
    eggs: p.eggs + reward.eggs,
    lastDaily: today,
  });
  return reward;
}
