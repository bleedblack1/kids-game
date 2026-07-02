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

**Step 1 — install (first time only):**

```bash
npm install
npm run install:all
```

**Step 2 — start everything:**

```bash
npm run dev
```

**Step 3 — open the game:**

👉 **http://localhost:8080** ← this is the only URL you need

(Port 3001 is just the API that the game talks to in the background — you never open it in a browser during development.)

##  How to run (production)

```bash
npm run build   # bundles the frontend
npm start       # one Node.js server hosts game + API together
```

Then open **http://localhost:3001** — in production mode this single port serves everything.

| Mode | Command | Open in browser |
| --- | --- | --- |
| Development | `npm run dev` | http://localhost:8080 |
| Production | `npm run build && npm start` | http://localhost:3001 |

##  The games

| Game | Age group | How you play |
| --- | --- | --- |
| Animal Walk Adventure | Preschool 3–4 | Jump, crawl and squat — pose detection |
| Finger Gesture Quiz | Preschool 3–4 | Hold up 1–4 fingers to answer |
| Endless Runner | Preschool 3–4 | Control the runner with gestures |
| Math Adventure | Preschool 3–4 | Camera + voice math puzzles |
| Vocab Face Quiz | LKG 4–5 | Vocabulary quiz |
| Point & Spell | UKG 5–6 | Point at objects, drag letters to spell — fully camera-controlled |

##  Backend API (Node.js + Express)

| Method | Route | What it does |
| --- | --- | --- |
| GET | `/api/health` | Check the server is alive |
| GET | `/api/words` | Vocabulary for Point & Spell |
| GET | `/api/leaderboard` | Class roster for the Teacher view |
| POST | `/api/events` | Games send analytics events here |
| GET | `/api/progress/:playerId` | Load a player's coins/stickers/streak |
| POST | `/api/progress/:playerId` | Save a player's coins/stickers/streak |

Data is stored as JSON files in `backend/data/` (created automatically, not committed to git). To use a real database later, replace `backend/src/store.js` — nothing else needs to change.

##  Tech stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, MediaPipe Hands, TensorFlow.js
- **Backend:** Node.js, Express (2 dependencies, no build step)

## Requirements

- Node.js 18+
- A webcam (the games are camera-controlled)
- Chrome or Edge recommended
