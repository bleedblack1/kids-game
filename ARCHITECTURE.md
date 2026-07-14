# Kalqy — Production Architecture (as built)

Full-stack architecture for the Kalqy camera-controlled kids learning games.
**Frontend + Backend + Database**, with **zero mock data** — every number shown
to a teacher or parent is derived from real gameplay events in Neon Postgres.

**Stack**
- **Frontend:** React 19 + TypeScript (PWA) · Three.js (3D games) ·
  MediaPipe Tasks-Vision + TensorFlow.js (Hands/Pose) · Tailwind CSS
- **Backend:** NestJS (Node + TypeScript) REST API · Prisma ORM · JWT + RBAC auth
- **Database:** PostgreSQL on **Neon** (managed) · **Redis** for sessions & caching
- **AI:** progress insights + vocabulary content generation (Anthropic Claude,
  with a deterministic rule-based fallback)

---

## 1. Principles

| Principle | Realized as |
| --- | --- |
| **No mock data** | Leaderboard aggregates real `Progress` + `Event` rows; words live in a `Word` table; the old `CLASS_ROSTER`/`WORD_BANK` arrays are deleted. |
| **On-device AI** | MediaPipe / TensorFlow.js / Three.js run in the browser. Camera frames never leave the device — only derived events do. |
| **Offline-first** | Client writes to an IndexedDB outbox, then syncs to the API. |
| **Layered backend** | Controller → Service → Prisma. Redis for sessions/cache/limits. |
| **RBAC** | Child (device-scoped) · Teacher · Parent · Admin. |
| **Privacy by design** | Minimal child PII; parental consent + retention modeled; feedback PII is admin-only. |

---

## 2. System diagram

```
┌───────────────────────── CLIENT (browser, PWA) ─────────────────────────┐
│  React 19 + TS                                                           │
│  ┌──────────────┐ ┌───────────────────┐ ┌───────────────────────────┐   │
│  │ Three.js 3D  │ │ MediaPipe + TF.js │ │ Dashboard / Leaderboard / │   │
│  │ games        │ │ Pose / Hands      │ │ Feedback (Tailwind)       │   │
│  └──────┬───────┘ └─────────┬─────────┘ └─────────────┬─────────────┘   │
│         └──── analytics ────┴──── lib/api.ts + IndexedDB outbox ────┘    │
└──────────────────────────────┼──────────────────────────────────────────┘
                               │  HTTPS /api/v1  (JWT: user access | device)
                               ▼
┌───────────────────────── NestJS API ────────────────────────────────────┐
│  Controllers → Services → Prisma        Guards: JwtAuth · Roles · Own    │
│  auth · words · events · progress · leaderboard · feedback · ai · health  │
│  ValidationPipe (DTOs) · Throttler · helmet · pino logging · error filter │
└───────────┬───────────────────────────────────────────────┬─────────────┘
            │ Prisma                                         │ ioredis
            ▼                                                ▼
   ┌──────────────────┐                            ┌──────────────────┐
   │  Neon PostgreSQL │                            │  Redis           │
   │  (source of truth)│                           │  refresh tokens, │
   │                  │                            │  leaderboard/    │
   │                  │                            │  insight cache,  │
   │                  │                            │  rate limiting   │
   └──────────────────┘                            └──────────────────┘
```

---

## 3. Backend (NestJS) — `backend/src`

```
main.ts                 # bootstrap: helmet, CORS allow-list, /api/v1 versioning, Swagger
app.module.ts           # wires modules + global guards (JwtAuth → Throttler → Roles) + error filter
config/                 # env validation (class-validator) + typed AppConfig
prisma/                 # PrismaService/Module (only layer touching Postgres)
redis/                  # RedisService: sessions, JSON cache, rate limits
common/                 # @Roles/@Public/@CurrentUser, JwtAuth/Roles/OwnPlayer guards, error filter
auth/                   # JWT access + refresh (Redis-rotated) + child device tokens; argon2
words/                  # vocabulary from DB (cached)
events/                 # telemetry ingest + skill GROUP BY aggregation
progress/               # live per-player snapshot (upsert)
leaderboard/            # DERIVED class roster (kills the mock CLASS_ROSTER)
feedback/               # parent survey; admin-only read + NPS summary
ai/                     # insights from real events + content generation (Claude/fallback)
health/                 # DB + Redis liveness
```

**API (v1)** — see `backend/README.md` for the full table. Key routes:
`POST /auth/login|register|refresh|device`, `GET /words`, `POST /events`,
`GET|POST /progress/:id`, `GET /leaderboard?classId=`, `POST|GET /feedback`,
`GET /ai/insights/:id`, `POST /ai/words`, `GET /health`.

### The leaderboard is computed, not stored

`LeaderboardService.forClass` loads the class's players + progress, runs a
`GROUP BY skill` over each player's events for `topSkill`, sorts by coins, and
caches the result in Redis for 30s. Every field traces to a real row.

---

## 4. Database (Prisma → Neon Postgres) — `backend/prisma/schema.prisma`

Models: `User` (RBAC roles) · `School` · `Class` · `Player` (child, minimal PII) ·
`ParentalConsent` (consent + retention) · `Progress` · `Event` (typed `EventType`
+ `Skill` enums) · `Word` · `Feedback` · `Insight` (cached AI output).

Neon specifics: `datasource.url` uses the **pooled** (PgBouncer) connection for
the app; `datasource.directUrl` uses the **direct** connection for migrations.

---

## 5. Frontend — see `frontend/ARCHITECTURE.md`

React 19 PWA. The games run on-device (TensorFlow.js / MediaPipe pose & hands,
Three.js for the 3D games) — camera frames never leave the browser. A thin
API-client layer (`lib/api.ts`) talks to the NestJS backend and adapts the app's
internal event/skill names to the backend enum contract; writes flow through an
IndexedDB outbox (`lib/sync-queue.ts`) so play is never blocked by the network.
The Dashboard / Leaderboard render real API data with a bundled offline fallback.

---

## 6. Deployment topology

| Layer | Service |
| --- | --- |
| Frontend PWA | Vercel |
| Backend API | Railway / Render / Fly.io (persistent Node process) |
| Database | **Neon** Postgres (pooled + direct URLs) |
| Cache / sessions | Upstash Redis (or self-hosted) |
| AI | Anthropic Claude (`AI_API_KEY`; optional — rule-based fallback otherwise) |
| CI/CD | GitHub Actions: lint → build → `prisma migrate deploy` → deploy |

Env contracts: `backend/.env.example`, `frontend/.env.example`.

---

## 7. Local run

```bash
# 1. Backend env → Neon + Redis + JWT secrets
cp backend/.env.example backend/.env   # fill in DATABASE_URL/DIRECT_URL, REDIS_URL, JWT_*
npm install                            # installs root + backend + frontend
npm --prefix backend run prisma:generate
npm --prefix backend run prisma:migrate   # create tables on Neon
npm --prefix backend run db:seed          # words + admin/teacher accounts

# 2. Everything
npm run dev        # NestJS :3001 (API + Swagger /api/docs) + Vite PWA :8080
```

---

## 8. Security highlights

- Global JWT guard (`@Public()` opts out) + `RolesGuard` (RBAC) + `OwnPlayerGuard`
  (a device token can only touch its own player).
- argon2 password hashing; refresh tokens rotated & revocable in Redis.
- helmet, strict CORS allow-list, per-IP rate limiting, whitelist DTO validation.
- `GET /feedback` is **admin-only** — closes the previous open-PII endpoint.
- Parental consent + data-retention modeled (`ParentalConsent.retainUntil`).
