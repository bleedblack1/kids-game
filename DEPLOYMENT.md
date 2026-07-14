# Deploying Kalqy

Production topology:

```
Vercel (frontend, React PWA)  ──HTTPS /api/v1──▶  Render (NestJS backend)
                                                     │            │
                                              Neon (Postgres)   Upstash (Redis)
```

**Golden rule for env:** secrets live in each platform's dashboard, **never in
git**. Your local `backend/.env` is the source you copy values *from* — it is
git-ignored and stays on your machine.

---

## 0. One-time: create the managed Redis (Upstash)

Render's free plan has no bundled Redis, so use Upstash (free tier).

1. Go to https://upstash.com → sign in → **Create Database** (Redis).
2. Pick a region near your Render region → Create.
3. Copy the **`rediss://…` connection URL** (the TLS one). You'll paste it as
   `REDIS_URL` on Render.

---

## 1. Backend → Render

1. Push this repo to GitHub (if not already).
2. Render → **New → Blueprint** → connect the repo. Render reads `render.yaml`
   and proposes the `kalqy-backend` web service. Apply it.
   - (Or **New → Web Service** manually: Root Directory `backend`,
     Build `npm install && npx prisma generate && npm run build`,
     Start `npm run start:prod`, Health check `/api/v1/health`.)
3. In the service's **Environment** tab, set these (copy the values from your
   local `backend/.env`):

   | Variable | Value / where from |
   | --- | --- |
   | `DATABASE_URL` | Neon **pooled** URL (host has `-pooler`) |
   | `DIRECT_URL` | Neon **direct** URL (no `-pooler`) |
   | `REDIS_URL` | the Upstash `rediss://…` URL from step 0 |
   | `CORS_ORIGIN` | your Vercel origin, e.g. `https://kids-game-mu.vercel.app` |
   | `JWT_ACCESS_SECRET` | copy from local `.env` |
   | `JWT_REFRESH_SECRET` | copy from local `.env` |
   | `JWT_DEVICE_SECRET` | copy from local `.env` |
   | `AI_API_KEY` | optional (blank = rule-based insights) |
   | `NODE_ENV` | `production` (already in blueprint) |

4. Deploy. When it's live, note the URL: `https://kalqy-backend.onrender.com`
   (yours may differ). Verify: open `…/api/v1/health` → should show
   `{"ok":true,"checks":{"database":"up","redis":"up"}}`.

> The database schema + seed data already exist on Neon (from setup), so no
> migration step is needed for this deploy. For future schema changes, adopt
> `prisma migrate` and add `npx prisma migrate deploy` to the build command.

---

## 2. Frontend → Vercel

1. Vercel → your project → **Settings → General → Root Directory** = `frontend`.
   (Critical: if it's set to the repo root, the build will fail — the backend
   would try to build too.)
2. **Settings → Environment Variables** → add:

   | Variable | Value |
   | --- | --- |
   | `VITE_API_BASE` | your Render backend URL, e.g. `https://kalqy-backend.onrender.com` (no trailing slash) |

3. **Redeploy** (env vars only apply to new builds). Vercel auto-detects Vite
   (build `vite build`, output `dist`).

---

## 3. Cross-wiring checklist

These two must point at each other:

- Vercel `VITE_API_BASE` → the Render backend URL
- Render `CORS_ORIGIN` → the Vercel frontend URL

If you add a custom domain later, add it to `CORS_ORIGIN` (comma-separated) and
redeploy the backend.

---

## 4. Smoke test (after both are live)

1. Open the Vercel URL → play a game → a child device auto-registers and
   progress/events sync to Neon.
2. Dashboard → Feedback → sign in `admin@kalqy.app` / `kalqy@2026` → real
   feedback + NPS loads from the backend.
3. Backend health: `https://<render-url>/api/v1/health` → all `up`.

## Notes / caveats

- **Render free tier sleeps** after ~15 min idle; the first request then takes
  ~30–50s to wake. Fine for demos; upgrade the plan to keep it always-on.
- **Neon** free compute also cold-starts, adding a couple seconds to the first
  query after idle.
- Rotate the JWT secrets and the admin password for a real production launch.
