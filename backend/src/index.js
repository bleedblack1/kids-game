// Kalqy backend — Node.js + Express REST API.
// Serves game content, collects analytics events, and persists player
// progress. In production it also serves the built frontend from
// ../frontend/dist so the whole app runs off one Node process.
import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WORD_BANK, CLASS_ROSTER } from "./data.js";
import { readCollection, writeCollection } from "./store.js";

const PORT = process.env.PORT || 3001;
const MAX_EVENTS = 5000;

const app = express();
app.use(cors());
app.use(express.json({ limit: "256kb" }));

// ----- API -----

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "kalqy-backend", time: new Date().toISOString() });
});

// Vocabulary for Point & Spell.
app.get("/api/words", (_req, res) => {
  res.json({ words: WORD_BANK });
});

// Classroom roster for the Teacher leaderboard.
app.get("/api/leaderboard", (_req, res) => {
  res.json({ roster: CLASS_ROSTER });
});

// Analytics events from the games (fire-and-forget from the frontend).
app.post("/api/events", (req, res) => {
  const { game, type, skill, value, label } = req.body ?? {};
  if (typeof game !== "string" || typeof type !== "string") {
    return res.status(400).json({ error: "game and type are required" });
  }
  const events = readCollection("events", []);
  events.push({ game, type, skill, value, label, ts: Date.now() });
  writeCollection("events", events.slice(-MAX_EVENTS));
  res.status(201).json({ ok: true });
});

app.get("/api/events", (_req, res) => {
  res.json({ events: readCollection("events", []) });
});

// Player progress snapshots (coins, stickers, streak).
app.get("/api/progress/:playerId", (req, res) => {
  const all = readCollection("progress", {});
  res.json({ progress: all[req.params.playerId] ?? null });
});

app.post("/api/progress/:playerId", (req, res) => {
  const { coins, stickers, streakDays, lastPlayed } = req.body ?? {};
  if (typeof coins !== "number" || !Array.isArray(stickers)) {
    return res.status(400).json({ error: "coins (number) and stickers (array) are required" });
  }
  const all = readCollection("progress", {});
  all[req.params.playerId] = {
    coins,
    stickers,
    streakDays: streakDays ?? 0,
    lastPlayed: lastPlayed ?? null,
    updatedAt: new Date().toISOString(),
  };
  writeCollection("progress", all);
  res.json({ ok: true });
});

// ----- Static frontend (production only) -----
// In development the backend is API-only; the game runs on the Vite dev
// server (http://localhost:8080), which proxies /api here.

const isProduction = process.env.NODE_ENV === "production";
const distDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "frontend",
  "dist",
);

if (isProduction && fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/^\/(?!api\/).*/, (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
} else {
  app.get("/", (_req, res) => {
    res.json({
      message: "Kalqy API is running. Open the game at http://localhost:8080 (npm run dev).",
    });
  });
}

app.listen(PORT, () => {
  console.log(`kalqy-backend (${isProduction ? "production" : "development"}) on http://localhost:${PORT}`);
  if (!isProduction) console.log("API only — play the game at http://localhost:8080");
});
