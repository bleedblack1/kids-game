#  Kalqy — Kids Learning Games

Camera-controlled learning games for kids aged 3–6. Kids play by moving, pointing, and gesturing in front of the webcam — no mouse or keyboard needed.

live:https://kids-game-mu.vercel.app/
 
## Project structure

```
kids-game/
├── frontend/   → React app (the games + camera AI)
├── backend/    → Node.js API (words, leaderboard, progress, analytics)
└── package.json
```

##  How to run (development)

> **Node.js 20.19+ or 22+ is required** (the project ships an `.nvmrc` pinned to 22).
> If you use nvm: `nvm install 22 && nvm use 22`.

**Step 1 — install (first time only):**

```bash
npm install
```

This installs the root, backend, and frontend dependencies (a `postinstall`
hook installs the sub-packages for you).

**Step 2 — configure the database (Neon) + Redis:**

```bash
cp backend/.env.example backend/.env   # fill in Neon DATABASE_URL/DIRECT_URL, REDIS_URL, JWT_*
npm --prefix backend run prisma:generate
npm --prefix backend run prisma:migrate   # create tables on Neon
npm --prefix backend run db:seed          # seed words + admin/teacher accounts
```

**Step 3 — start everything:**

```bash
npm run dev
```

**Step 4 — open the game:**

👉 **http://localhost:8080** ← this is the only URL you need
(the NestJS API runs on :3001, with Swagger docs at http://localhost:3001/api/docs)

##  How to run (production)

Frontend and API deploy separately: the **React PWA** to a static host (Vercel)
and the **NestJS API** to a persistent Node host (Railway/Render/Fly), backed by
**Neon** Postgres + Redis. See [`ARCHITECTURE.md`](ARCHITECTURE.md) §6.

```bash
npm run build                       # builds backend (nest) + frontend (vite)
npm --prefix backend run prisma:deploy   # apply migrations on deploy
npm start                           # start the API (serve the PWA from your static host)
```

##  The games

| Game | Age group | How you play |
| --- | --- | --- |
| Kalqy 3D World 🌍 | All bands 3–6 | Full-body 3D runner (Three.js + MediaPipe pose): step left/right to change lanes, jump logs, squat under branches, answer learning gates |
| Animal Walk Adventure | Preschool 3–4 | Jump, crawl and squat — pose detection |
| Finger Gesture Quiz | Preschool 3–4 | Hold up 1–4 fingers to answer |
| Endless Runner | Preschool 3–4 | Control the runner with gestures |
| Math Adventure | Preschool 3–4 | Camera + voice math puzzles |
| Vocab Face Quiz | LKG 4–5 | Vocabulary quiz |
| Point & Spell | UKG 5–6 | Point at objects, drag letters to spell — fully camera-controlled |

##  Backend API (NestJS + Prisma + Neon + Redis)

The backend is a layered NestJS app (Controller → Service → Prisma) with JWT +
RBAC auth, versioned at `/api/v1`. Full route table and setup in
[`backend/README.md`](backend/README.md). Highlights:

| Method | Route | What it does |
| --- | --- | --- |
| GET | `/api/v1/health` | DB + Redis liveness |
| POST | `/api/v1/auth/login` · `/register` · `/refresh` · `/device` | JWT auth + child device tokens |
| GET | `/api/v1/words` | Vocabulary (from the DB) |
| POST | `/api/v1/events` | Gameplay telemetry ingest |
| GET/POST | `/api/v1/progress/:playerId` | Load/save a player's progress |
| GET | `/api/v1/leaderboard?classId=` | Class roster **derived from real data** |
| GET | `/api/v1/ai/insights/:playerId` | AI progress insight |

**No mock data:** the leaderboard is aggregated from real `Progress` + `Event`
rows; vocabulary lives in a `Word` table. Data is stored in **PostgreSQL on
Neon** via Prisma, with **Redis** for sessions, caching, and rate limiting.
See [`ARCHITECTURE.md`](ARCHITECTURE.md) for the full design.

##  Tech stack

- **Frontend:** React 19 + TypeScript (PWA), Vite, Tailwind CSS,
  Three.js (3D games), MediaPipe Tasks-Vision, TensorFlow.js
- **Backend:** NestJS, Prisma ORM, JWT/RBAC, AI insights (Anthropic + fallback)
- **Database:** PostgreSQL (Neon) + Redis

## Requirements

- Node.js 20.19+ or 22+ (see `.nvmrc`)
- A webcam (the games are camera-controlled)
- Chrome or Edge recommended
