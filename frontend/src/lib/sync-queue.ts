// Offline-first outbox. Gameplay events and progress writes are enqueued to
// IndexedDB first, then flushed to the API. Games never block on the network,
// and nothing is lost on flaky classroom wifi.
import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import { request } from "./http";

type OutboxKind = "event" | "progress";

interface OutboxItem {
  id?: number;
  kind: OutboxKind;
  path: string;
  body: unknown;
  context: "device";
  createdAt: number;
}

interface KalqyDB extends DBSchema {
  outbox: { key: number; value: OutboxItem };
}

let dbPromise: Promise<IDBPDatabase<KalqyDB>> | null = null;

function db() {
  if (!dbPromise) {
    dbPromise = openDB<KalqyDB>("kalqy", 1, {
      upgrade(d) {
        d.createObjectStore("outbox", { keyPath: "id", autoIncrement: true });
      },
    });
  }
  return dbPromise;
}

export async function enqueue(kind: OutboxKind, path: string, body: unknown) {
  const d = await db();
  await d.add("outbox", { kind, path, body, context: "device", createdAt: Date.now() });
  // Best-effort immediate flush; harmless if offline.
  void flush();
}

let flushing = false;

export async function flush(): Promise<void> {
  if (flushing || !navigator.onLine) return;
  flushing = true;
  try {
    const d = await db();
    const items = await d.getAll("outbox");
    for (const item of items) {
      try {
        await request(item.path, { method: "POST", body: item.body, context: item.context });
        if (item.id != null) await d.delete("outbox", item.id);
      } catch {
        // Stop on first failure; retry on the next flush trigger.
        break;
      }
    }
  } finally {
    flushing = false;
  }
}

// Flush whenever connectivity returns or the tab regains focus.
if (typeof window !== "undefined") {
  window.addEventListener("online", () => void flush());
  window.addEventListener("focus", () => void flush());
}
