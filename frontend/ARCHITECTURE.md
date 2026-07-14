# Frontend — React PWA + camera-controlled games

React 19 + TypeScript SPA (Vite), served as a PWA. The games run on-device
(TensorFlow.js / MediaPipe / Three.js); a thin API-client layer talks to the
NestJS backend with offline-safe queuing.

```
src/
├── main.tsx                  # bootstrap (Vite PWA service worker auto-registers)
├── App.tsx                   # game hub / shell + role routing
├── components/kalqy/         # the games + dashboard/leaderboard/feedback UI
├── lib/
│   ├── env.ts                # API base + /api/v1 prefix
│   ├── http.ts               # fetch wrapper: auth header + silent token refresh
│   ├── auth-store.ts         # in-memory access + persisted refresh/device tokens
│   ├── device.ts             # child device identity → scoped device token
│   ├── sync-queue.ts         # IndexedDB outbox → flush events/progress when online
│   ├── api.ts                # typed endpoint client (v1) + event/skill enum mapping
│   ├── analytics.ts          # in-app event bus; mirrors events to the API
│   ├── roles.ts              # local role (kid/parent/teacher) + class roster fallback
│   ├── rewards.ts            # coins/stickers rules
│   └── dino-*.ts             # per-game helpers
└── styles.css
```

## Data & control flow

```
webcam ─▶ MediaPipe / TF.js (in-browser) ─▶ game logic
                                               │
   analytics.logEvent ─▶ api.postEvent ─▶ enqueue (IndexedDB outbox)
                                               │  (online)
                                               ▼
                          POST /api/v1/events, /progress  (device token)
```

- **Camera frames never leave the device** — only derived events are sent.
- **Offline-first**: writes go to the IndexedDB outbox and flush on
  `online`/`focus`, so play is never blocked by the network.
- **PWA**: `vite-plugin-pwa` precaches the shell; `/api/v1/words` is
  stale-while-revalidate.

## API client

`lib/api.ts` wraps the backend (versioned `/api/v1`) and adapts the app's
internal lowercase event/skill names to the backend enum contract. Reads
(`fetchWords`, `fetchLeaderboard`, `fetchFeedback`) degrade gracefully to `null`
so the UI keeps working offline; the leaderboard falls back to the bundled
roster in `lib/roles.ts`.

## Auth model

| Actor | Token | Storage |
| --- | --- | --- |
| Child device | device JWT | localStorage (scoped to its own `playerId`) |
| Teacher/Parent/Admin | access + refresh | access in memory, refresh in localStorage |

Human access tokens auto-refresh on a 401 (`lib/http.ts`); refresh tokens are
revocable server-side (Redis).
