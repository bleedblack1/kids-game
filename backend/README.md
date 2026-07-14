# Kalqy Backend — NestJS + Prisma + Neon + Redis

Production API for the Kalqy kids learning games. REST, versioned at `/api/v1`,
JWT + RBAC auth, PostgreSQL (Neon) via Prisma, Redis for sessions/cache/rate-limit,
and an AI module for progress insights + content generation.

## Layers

```
Controller (HTTP + DTO validation)
   → Service (business logic)
      → Prisma (the only layer touching Postgres)
Redis: sessions (refresh tokens), leaderboard/insight cache, rate limiting
```

## Setup

```bash
cp .env.example .env          # fill in Neon DATABASE_URL/DIRECT_URL + REDIS_URL + JWT secrets
npm install
npm run prisma:generate
npm run prisma:migrate        # creates tables on Neon (uses DIRECT_URL)
npm run db:seed               # words + admin/teacher accounts
# SEED_DEMO=true npm run db:seed   # + a demo class with real events
npm run start:dev             # http://localhost:3001, docs at /api/docs
```

### Neon connection strings

From the Neon console → **Connection Details**:
- `DATABASE_URL` → the **pooled** string (host contains `-pooler`), used by the app.
- `DIRECT_URL` → the **direct** string, used by Prisma Migrate.

Both need `?sslmode=require`. The app string also uses `pgbouncer=true`.

## API (v1)

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/api/v1/health` | public | DB + Redis liveness |
| POST | `/api/v1/auth/register` | public | Create teacher/parent/admin |
| POST | `/api/v1/auth/login` | public | → access + refresh tokens |
| POST | `/api/v1/auth/refresh` | public | Rotate tokens (Redis-backed) |
| POST | `/api/v1/auth/device` | public | Child device → scoped device token |
| POST | `/api/v1/auth/logout` | user | Revoke refresh token |
| GET | `/api/v1/words` | public | Vocabulary (from DB) |
| POST | `/api/v1/events` | device | Ingest a gameplay event |
| GET | `/api/v1/players/:id/events` | teacher/parent | Event drill-down |
| GET | `/api/v1/progress/:id` | device/staff | Load progress |
| POST | `/api/v1/progress/:id` | device | Save progress |
| GET | `/api/v1/leaderboard?classId=` | teacher | **Derived** roster (no mock data) |
| POST | `/api/v1/feedback` | public | Parent survey |
| GET | `/api/v1/feedback` | admin | Feedback + NPS summary |
| GET | `/api/v1/ai/insights/:id` | teacher/parent | AI progress insight |
| POST | `/api/v1/ai/words` | admin | AI-generate vocabulary |

## Security

- Global JWT guard (`@Public()` opts out) + `RolesGuard` for RBAC.
- Child device tokens are scoped to their own `playerId` (`OwnPlayerGuard`).
- argon2 password hashing; refresh tokens stored/rotated in Redis (revocable).
- helmet, strict CORS allow-list, per-IP rate limiting, DTO whitelisting.
- `GET /feedback` is admin-only — closes the old open-PII endpoint.

## AI module

`AI_API_KEY` empty → deterministic **rule-based** insights (no external calls).
Set an Anthropic key → insights/content come from `AI_MODEL` (default
`claude-sonnet-5`), always with the rule-based path as fallback.
