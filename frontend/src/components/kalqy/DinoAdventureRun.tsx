import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Egg,
  Gem,
  Gift,
  Heart,
  Home,
  Map as MapIcon,
  Pause,
  Play,
  RotateCw,
  Star,
  Volume2,
  VolumeX,
} from "lucide-react";
import { DinoPoseControl, createPoseSignals, type PoseStatus } from "./DinoPoseControl";
import { audioInit, isMuted, say, setMuted, sfx, startMusic, stopMusic } from "@/lib/dino-audio";
import {
  DINO_BADGES,
  DINO_CHARACTERS,
  WORLD_BADGE_IDS,
  claimDaily,
  canClaimDaily,
  getDinoProgress,
  getSelectedCharacter,
  isCharacterUnlocked,
  selectCharacter,
  unlockDinoBadge,
  updateDinoProgress,
  type DinoBadge,
  type DinoCharacter,
} from "@/lib/dino-progress";
import { logEvent } from "@/lib/analytics";

interface DinoAdventureRunProps {
  onBack: () => void;
  onComplete?: (result: { stars: number; eggs: number; score: number }) => void;
}

type Phase =
  | "menu"
  | "calibrate"
  | "tracking-ready"
  | "countdown"
  | "playing"
  | "paused"
  | "lost"
  | "complete"
  | "gameover";

// ---------- world + level configuration ----------

const W = 960;
const H = 540;
// Temple-run style perspective: the dino runs INTO the screen.
const HORIZON = 330; // vanishing point height on screen
const PLAYER_Y = 505; // dino feet on screen (depth z = 0)
const CAM = 340; // perspective strength (camera distance)
const LANE_X = 250; // lane center offset from track middle at z = 0
const SPAWN_Z = 1600; // how far ahead things appear
const GRAVITY = 1900;
const JUMP_V = 660;
const MAX_HEARTS = 5;

interface WorldDef {
  name: string;
  emoji: string;
  skyTop: string;
  skyBot: string;
  far: string;
  mid: string;
  groundTop: string;
  ground: string;
  water: string;
  goo: string; // mud / lava-puddle / syrup color
  deco: "tree" | "palm" | "volcano" | "pine" | "candy";
  particle: "leaf" | "drop" | "ember" | "snow" | "candy";
  obstacles: string[];
}

const WORLDS: WorldDef[] = [
  {
    name: "Green Forest",
    emoji: "🌳",
    skyTop: "#8ee3f5",
    skyBot: "#eafbe0",
    far: "#a8d98a",
    mid: "#5cae63",
    groundTop: "#7ecb52",
    ground: "#8a6134",
    water: "#4fc3f7",
    goo: "#7a5442",
    deco: "tree",
    particle: "leaf",
    obstacles: ["rock", "log", "tree", "mud", "ptero"],
  },
  {
    name: "River Valley",
    emoji: "🏞️",
    skyTop: "#7fd4f0",
    skyBot: "#e3f7ff",
    far: "#87c3a8",
    mid: "#4d9e7d",
    groundTop: "#8bc34a",
    ground: "#7c603f",
    water: "#3fa9f5",
    goo: "#6d4c41",
    deco: "palm",
    particle: "drop",
    obstacles: ["rock", "river", "log", "mud", "ptero"],
  },
  {
    name: "Volcano Land",
    emoji: "🌋",
    skyTop: "#ffb27d",
    skyBot: "#ffe3c2",
    far: "#b3573e",
    mid: "#8c3b2e",
    groundTop: "#c07b45",
    ground: "#5d3222",
    water: "#ff7043",
    goo: "#ff5722",
    deco: "volcano",
    particle: "ember",
    obstacles: ["rock", "log", "sleepy", "mud", "ptero"],
  },
  {
    name: "Snow World",
    emoji: "❄️",
    skyTop: "#a8ccf0",
    skyBot: "#eef6ff",
    far: "#d7e9f7",
    mid: "#b6d3e8",
    groundTop: "#f4f9ff",
    ground: "#9db8cd",
    water: "#7fb8e8",
    goo: "#90a4ae",
    deco: "pine",
    particle: "snow",
    obstacles: ["rock", "tree", "river", "sleepy", "ptero"],
  },
  {
    name: "Candy Land",
    emoji: "🍭",
    skyTop: "#ffc7e8",
    skyBot: "#fff3d6",
    far: "#f7a6d0",
    mid: "#e879b9",
    groundTop: "#f8bbd0",
    ground: "#c2779e",
    water: "#b3e5fc",
    goo: "#795548",
    deco: "candy",
    particle: "candy",
    obstacles: ["rock", "log", "sleepy", "mud", "ptero"],
  },
];

const PRAISE = ["Amazing!", "Great job!", "Wow, super!", "Fantastic!", "You are a star!"];

// ---------- entities ----------

interface Ent {
  cat: "ob" | "col";
  sub: string;
  lane: number;
  x: number; // depth: world units ahead of the dino (0 = at the dino)
  w: number;
  h: number;
  yOff: number; // height of item center above the lane ground
  vx: number; // extra approach speed (rolling logs)
  phase: number;
  taken?: boolean;
  takeT?: number;
  warned?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: string;
  kind: "dot" | "confetti" | "spark" | "rocket";
  rot: number;
  vr: number;
}

interface FloatText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

interface Ambient {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  seed: number;
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
// project a depth z (world units ahead of the dino) to screen space
const proj = (z: number) => {
  const t = CAM / (CAM + Math.max(z, -260));
  return { t, y: HORIZON + (PLAYER_Y - HORIZON) * t };
};
const laneX = (laneF: number, t: number) => W / 2 + (laneF - 1) * LANE_X * t;

function makeGameState() {
  return {
    t: 0,
    world: 0,
    dist: 0,
    levelLen: 13000,
    speed: 320,
    laneF: 1,
    targetLane: 1,
    y: 0,
    vy: 0,
    grounded: true,
    ducking: false,
    hearts: 3,
    score: 0,
    coins: 0,
    eggs: 0,
    gems: 0,
    stars: 0,
    meter: 0,
    jumps: 0,
    hits: 0,
    streak: 0,
    invulnUntil: 0,
    mudUntil: 0,
    happyUntil: 0,
    hurtUntil: 0,
    nextSpawn: 600,
    starTimer: 7,
    ents: [] as Ent[],
    parts: [] as Particle[],
    floats: [] as FloatText[],
    amb: [] as Ambient[],
    prevJump: 0,
    voiceCd: 0,
    praiseCd: 0,
    lostSince: 0,
    foundSince: 0,
    fireworkT: 0.4,
    celebT: 0,
    idleDist: 0,
    cueIcon: "",
    cueText: "",
    cueUntil: 0,
    finishCue: false,
  };
}

// =============================== component ===============================

export function DinoAdventureRun({ onBack, onComplete }: DinoAdventureRunProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("menu");
  const [camOn, setCamOn] = useState(false);
  const [poseStatus, setPoseStatus] = useState<PoseStatus>("idle");
  const [calibrating, setCalibrating] = useState(false);
  const [calCheck, setCalCheck] = useState({ seen: false, full: false, inBox: false });
  const [countdownN, setCountdownN] = useState(3);
  const [hud, setHud] = useState({
    score: 0,
    hearts: 3,
    eggs: 0,
    stars: 0,
    coins: 0,
    gems: 0,
    meter: 0,
    progress: 0,
  });
  const [voiceLine, setVoiceLine] = useState({ text: "Hi! I'm Kai the dino guide!", n: 0 });
  const [muted, setMutedState] = useState(isMuted());
  const [worldIdx, setWorldIdx] = useState(0);
  const [startWorld, setStartWorld] = useState(0);
  const [selChar, setSelChar] = useState(getSelectedCharacter().id);
  const [prog, setProg] = useState(getDinoProgress());
  const [newBadges, setNewBadges] = useState<DinoBadge[]>([]);
  const [dailyToast, setDailyToast] = useState<string | null>(null);
  const [result, setResult] = useState({ score: 0, levelStars: 0, eggs: 0, stars: 0 });

  const signalsRef = useRef(createPoseSignals());
  const kbRef = useRef({ lane: 1, duck: false, jump: 0, handsUp: false });
  const g = useRef(makeGameState());
  const phaseRef = useRef<Phase>("menu");
  const camOnRef = useRef(false);
  const charRef = useRef<DinoCharacter>(getSelectedCharacter());
  const lastHudPush = useRef(0);
  const ctrlRef = useRef<{ finishLevel: () => void; gameOver: () => void } | null>(null);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    camOnRef.current = camOn;
  }, [camOn]);
  useEffect(() => {
    charRef.current = DINO_CHARACTERS.find((c) => c.id === selChar) ?? DINO_CHARACTERS[0];
  }, [selChar]);

  const voice = useCallback((text: string, interrupt = false) => {
    say(text, { interrupt });
    setVoiceLine((v) => ({ text, n: v.n + 1 }));
  }, []);

  // ---------- flow control ----------

  const resetRun = useCallback((world: number, keepScore: boolean) => {
    const prev = g.current;
    const fresh = makeGameState();
    fresh.world = world;
    fresh.levelLen = 12000 + world * 2200;
    if (keepScore) {
      fresh.score = prev.score;
      fresh.jumps = prev.jumps;
    }
    // Seed the jump counter so jumps made before the run don't fire at start.
    fresh.prevJump = signalsRef.current.jumpCount + kbRef.current.jump;
    lastHudPush.current = 0;
    g.current = fresh;
    setWorldIdx(world);
    setHud({
      score: Math.floor(fresh.score),
      hearts: 3,
      eggs: 0,
      stars: 0,
      coins: 0,
      gems: 0,
      meter: 0,
      progress: 0,
    });
  }, []);

  const startAdventure = useCallback(() => {
    audioInit();
    sfx.click();
    logEvent({ game: "dino-adventure", type: "session-start" });
    resetRun(startWorld, false);
    setNewBadges([]);
    if (camOn && signalsRef.current.calibrated) {
      setPhase("countdown");
    } else {
      setCamOn(true);
      setPhase("calibrate");
    }
  }, [camOn, resetRun, startWorld]);

  const skipCamera = useCallback(() => {
    sfx.click();
    setCamOn(false);
    setPhase("countdown");
  }, []);

  const togglePause = useCallback(() => {
    if (phaseRef.current === "playing") {
      sfx.click();
      stopMusic();
      setPhase("paused");
    } else if (phaseRef.current === "paused") {
      sfx.click();
      startMusic(g.current.world);
      setPhase("playing");
    }
  }, []);

  const goHome = useCallback(() => {
    stopMusic();
    if (typeof window !== "undefined" && "speechSynthesis" in window)
      window.speechSynthesis.cancel();
    setProg(getDinoProgress());
    setPhase("menu");
  }, []);

  const toggleMute = useCallback(() => {
    const m = !isMuted();
    setMuted(m);
    setMutedState(m);
    if (!m) sfx.click();
  }, []);

  const handleDaily = useCallback(() => {
    audioInit();
    const r = claimDaily();
    if (r) {
      sfx.chest();
      setProg(getDinoProgress());
      setDailyToast(`+${r.coins} coins and +${r.eggs} egg! See you tomorrow!`);
      say("Daily treasure! Great to see you!");
      setTimeout(() => setDailyToast(null), 3500);
    }
  }, []);

  const pickCharacter = useCallback((id: string) => {
    if (!isCharacterUnlocked(id)) return;
    sfx.click();
    selectCharacter(id);
    setSelChar(id);
  }, []);

  // ---------- calibration monitor ----------

  useEffect(() => {
    if (phase !== "calibrate") return;
    voice("Stand inside the box!", true);
    let stableSince = 0;
    const iv = setInterval(() => {
      const s = signalsRef.current;
      setCalCheck((prev) => {
        if (prev.seen === s.present && prev.full === s.fullBody && prev.inBox === s.inBox)
          return prev;
        return { seen: s.present, full: s.fullBody, inBox: s.inBox };
      });
      if (s.calibrated) return;
      if (s.present && s.fullBody && s.inBox) {
        if (!stableSince) stableSince = Date.now();
        if (Date.now() - stableSince > 700) setCalibrating(true);
      } else {
        stableSince = 0;
        setCalibrating(false);
      }
    }, 120);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const onCalibrated = useCallback(() => {
    setCalibrating(false);
    sfx.heart();
    voice("Tracking ready!", true);
    setPhase("tracking-ready");
  }, [voice]);

  useEffect(() => {
    if (phase !== "tracking-ready") return;
    const t = setTimeout(() => setPhase("countdown"), 1400);
    return () => clearTimeout(t);
  }, [phase]);

  // ---------- countdown ----------

  useEffect(() => {
    if (phase !== "countdown") return;
    let n = 3;
    setCountdownN(3);
    sfx.countdown();
    say("3");
    const iv = setInterval(() => {
      n--;
      if (n > 0) {
        setCountdownN(n);
        sfx.countdown();
        say(String(n));
      } else {
        clearInterval(iv);
        setCountdownN(0);
        sfx.go();
        voice("Go!", true);
        startMusic(g.current.world);
        setPhase("playing");
      }
    }, 900);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ---------- keyboard fallback / grown-up testing ----------

  useEffect(() => {
    const kd = (e: KeyboardEvent) => {
      const kb = kbRef.current;
      if (e.key === "ArrowLeft") kb.lane = clamp(kb.lane - 1, 0, 2);
      else if (e.key === "ArrowRight") kb.lane = clamp(kb.lane + 1, 0, 2);
      else if (e.key === "ArrowUp" || e.key === " ") {
        if (phaseRef.current === "playing") e.preventDefault();
        kb.jump++;
      } else if (e.key === "ArrowDown") kb.duck = true;
      else if (e.key === "h" || e.key === "H") kb.handsUp = true;
      else if (e.key === "Escape" || e.key === "p" || e.key === "P") togglePause();
    };
    const ku = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") kbRef.current.duck = false;
      if (e.key === "h" || e.key === "H") kbRef.current.handsUp = false;
    };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => {
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
    };
  }, [togglePause]);

  // Auto-pause when the tab is hidden
  useEffect(() => {
    const onVis = () => {
      if (document.hidden && phaseRef.current === "playing") togglePause();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [togglePause]);

  useEffect(
    () => () => {
      stopMusic();
      if (typeof window !== "undefined" && "speechSynthesis" in window)
        window.speechSynthesis.cancel();
    },
    [],
  );

  // =============================== game engine ===============================

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const finishLevel = () => {
      const gs = g.current;
      stopMusic();
      sfx.fanfare();
      voice("Level complete! Great job!", true);
      gs.celebT = 0;
      confettiBurst(gs);
      const levelStars = gs.hits === 0 ? 3 : gs.hearts >= 2 ? 2 : 1;
      const before = getDinoProgress();
      const totals = updateDinoProgress({
        stars: before.stars + levelStars + gs.stars,
        eggs: before.eggs + gs.eggs,
        coins: before.coins + gs.coins,
        gems: before.gems + gs.gems,
        bestScore: Math.max(before.bestScore, Math.floor(gs.score)),
        worldsCompleted: Math.max(before.worldsCompleted, gs.world + 1),
      });
      const earned: DinoBadge[] = [];
      const tryBadge = (id: string) => {
        const b = unlockDinoBadge(id);
        if (b) earned.push(b);
      };
      tryBadge("first-run");
      tryBadge(WORLD_BADGE_IDS[gs.world]);
      if (gs.hits === 0) tryBadge("heart-keeper");
      if (gs.jumps >= 25) tryBadge("super-jumper");
      if (totals.eggs >= 10) tryBadge("egg-hunter");
      if (totals.stars >= 15) tryBadge("star-catcher");
      setNewBadges(earned);
      setResult({ score: Math.floor(gs.score), levelStars, eggs: gs.eggs, stars: gs.stars });
      setProg(getDinoProgress());
      logEvent({
        game: "dino-adventure",
        type: "milestone",
        label: `world-${gs.world + 1}-complete`,
        value: levelStars,
      });
      logEvent({ game: "dino-adventure", type: "session-end" });
      onComplete?.({ stars: levelStars + gs.stars, eggs: gs.eggs, score: Math.floor(gs.score) });
      setPhase("complete");
    };

    const gameOver = () => {
      const gs = g.current;
      stopMusic();
      sfx.hit();
      voice("Oh no! Let's try again!", true);
      // Kids keep what they collected — no progress is ever lost.
      const before = getDinoProgress();
      updateDinoProgress({
        stars: before.stars + gs.stars,
        eggs: before.eggs + gs.eggs,
        coins: before.coins + gs.coins,
        gems: before.gems + gs.gems,
        bestScore: Math.max(before.bestScore, Math.floor(gs.score)),
      });
      setResult({ score: Math.floor(gs.score), levelStars: 0, eggs: gs.eggs, stars: gs.stars });
      setProg(getDinoProgress());
      logEvent({ game: "dino-adventure", type: "session-end" });
      setPhase("gameover");
    };

    ctrlRef.current = { finishLevel, gameOver };

    // ---------- particles + effects ----------

    function spawnParts(
      gs: ReturnType<typeof makeGameState>,
      x: number,
      y: number,
      n: number,
      colors: string[],
      spread = 220,
      up = -160,
    ) {
      for (let i = 0; i < n; i++) {
        gs.parts.push({
          x,
          y,
          vx: rnd(-spread, spread),
          vy: rnd(up - 120, up + 80),
          life: 0,
          max: rnd(0.5, 1),
          size: rnd(3, 7),
          color: colors[Math.floor(Math.random() * colors.length)],
          kind: "dot",
          rot: rnd(0, 6),
          vr: rnd(-6, 6),
        });
      }
    }

    function confettiBurst(gs: ReturnType<typeof makeGameState>) {
      const colors = ["#ff5d8f", "#ffd60a", "#4cc9f0", "#80ed99", "#c77dff", "#ff9e40"];
      for (let i = 0; i < 130; i++) {
        gs.parts.push({
          x: rnd(0, W),
          y: rnd(-80, -10),
          vx: rnd(-40, 40),
          vy: rnd(90, 220),
          life: 0,
          max: rnd(2, 3.6),
          size: rnd(5, 9),
          color: colors[i % colors.length],
          kind: "confetti",
          rot: rnd(0, 6),
          vr: rnd(-8, 8),
        });
      }
    }

    function firework(gs: ReturnType<typeof makeGameState>) {
      const x = rnd(W * 0.15, W * 0.85);
      gs.parts.push({
        x,
        y: H - 40,
        vx: rnd(-15, 15),
        vy: rnd(-460, -380),
        life: 0,
        max: rnd(0.7, 0.95),
        size: 4,
        color: "#fff3b0",
        kind: "rocket",
        rot: 0,
        vr: 0,
      });
    }

    function burstAt(gs: ReturnType<typeof makeGameState>, x: number, y: number) {
      const colors = ["#ff5d8f", "#ffd60a", "#4cc9f0", "#80ed99", "#c77dff"];
      const c = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < 26; i++) {
        const a = (i / 26) * Math.PI * 2;
        const sp = rnd(120, 200);
        gs.parts.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 0,
          max: rnd(0.7, 1.1),
          size: rnd(2.5, 4.5),
          color: c,
          kind: "spark",
          rot: 0,
          vr: 0,
        });
      }
    }

    function float(
      gs: ReturnType<typeof makeGameState>,
      x: number,
      y: number,
      text: string,
      color: string,
    ) {
      gs.floats.push({ x, y, text, color, life: 0 });
    }

    // ---------- spawning ----------

    function spawnObstacle(
      gs: ReturnType<typeof makeGameState>,
      wd: WorldDef,
      x: number,
      avoidLane = -1,
    ) {
      const subs = wd.obstacles;
      const sub = subs[Math.floor(Math.random() * subs.length)];
      let lane = Math.floor(Math.random() * 3);
      if (lane === avoidLane) lane = (lane + 1) % 3;
      const spec: Record<string, { w: number; h: number; yOff: number }> = {
        rock: { w: 62, h: 54, yOff: 0 },
        log: { w: 56, h: 50, yOff: 0 },
        tree: { w: 120, h: 46, yOff: 0 },
        river: { w: 150, h: 10, yOff: 0 },
        mud: { w: 125, h: 10, yOff: 0 },
        sleepy: { w: 96, h: 84, yOff: 0 },
        ptero: { w: 74, h: 40, yOff: 105 },
      };
      const s = spec[sub];
      gs.ents.push({
        cat: "ob",
        sub,
        lane,
        x,
        w: s.w,
        h: s.h,
        yOff: s.yOff,
        vx: sub === "log" ? 70 : 0,
        phase: rnd(0, 6),
      });
      return lane;
    }

    function spawnCoins(gs: ReturnType<typeof makeGameState>, x: number) {
      const lane = Math.floor(Math.random() * 3);
      const n = 3 + Math.floor(Math.random() * 3);
      const arc = Math.random() < 0.4;
      for (let i = 0; i < n; i++) {
        const yOff = arc ? 40 + Math.sin((i / (n - 1)) * Math.PI) * 55 : 42;
        gs.ents.push({
          cat: "col",
          sub: "coin",
          lane,
          x: x + i * 52,
          w: 34,
          h: 34,
          yOff,
          vx: 0,
          phase: rnd(0, 6),
        });
      }
    }

    function spawnPattern(gs: ReturnType<typeof makeGameState>, wd: WorldDef) {
      const x = SPAWN_Z;
      const r = Math.random();
      if (r < 0.4) {
        spawnObstacle(gs, wd, x);
      } else if (r < 0.52) {
        const l1 = spawnObstacle(gs, wd, x);
        spawnObstacle(gs, wd, x + rnd(0, 40), l1);
      } else if (r < 0.78) {
        spawnCoins(gs, x);
      } else if (r < 0.9) {
        const lane = Math.floor(Math.random() * 3);
        gs.ents.push({
          cat: "col",
          sub: "egg",
          lane,
          x,
          w: 36,
          h: 44,
          yOff: 20,
          vx: 0,
          phase: rnd(0, 6),
        });
        if (Math.random() < 0.5) spawnCoins(gs, x + 130);
      } else {
        const lane = Math.floor(Math.random() * 3);
        gs.ents.push({
          cat: "col",
          sub: "gem",
          lane,
          x,
          w: 34,
          h: 34,
          yOff: 60,
          vx: 0,
          phase: rnd(0, 6),
        });
      }
      gs.nextSpawn = gs.dist + rnd(330, 560) + gs.speed * 0.25;
    }

    // ---------- drawing helpers ----------

    function rr(x: number, y: number, w: number, h: number, r: number) {
      ctx!.beginPath();
      ctx!.roundRect(x, y, w, h, r);
    }

    function drawSky(wd: WorldDef, t: number, dist: number) {
      const grad = ctx!.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, wd.skyTop);
      grad.addColorStop(1, wd.skyBot);
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, W, H);
      // sun
      ctx!.save();
      ctx!.translate(830, 86);
      ctx!.rotate(t * 0.1);
      ctx!.fillStyle = "rgba(255,236,140,0.95)";
      for (let i = 0; i < 8; i++) {
        ctx!.rotate(Math.PI / 4);
        rr(34, -5, 20, 10, 5);
        ctx!.fill();
      }
      ctx!.beginPath();
      ctx!.arc(0, 0, 34, 0, Math.PI * 2);
      ctx!.fillStyle = "#ffdf6b";
      ctx!.fill();
      ctx!.restore();
      // clouds
      ctx!.fillStyle = "rgba(255,255,255,0.85)";
      for (let i = 0; i < 4; i++) {
        const cx =
          ((i * 300 + 100 - dist * 0.01 - t * 6) % (W + 260)) +
          ((i * 300 + 100 - dist * 0.01 - t * 6) % (W + 260) < -130 ? W + 260 : 0);
        const cy = 60 + (i % 2) * 55 + Math.sin(t * 0.4 + i) * 4;
        ctx!.beginPath();
        ctx!.arc(cx, cy, 22, 0, Math.PI * 2);
        ctx!.arc(cx + 24, cy - 10, 18, 0, Math.PI * 2);
        ctx!.arc(cx + 48, cy, 20, 0, Math.PI * 2);
        ctx!.ellipse(cx + 22, cy + 8, 42, 14, 0, 0, Math.PI * 2);
        ctx!.fill();
      }
      // a friendly bird
      const bx = W - ((dist * 0.03 + t * 60) % (W + 400));
      const by = 120 + Math.sin(t * 2) * 12;
      ctx!.strokeStyle = "rgba(70,70,90,0.7)";
      ctx!.lineWidth = 3;
      ctx!.lineCap = "round";
      const flap = Math.sin(t * 9) * 7;
      ctx!.beginPath();
      ctx!.moveTo(bx - 12, by - flap);
      ctx!.quadraticCurveTo(bx, by + 4, bx + 12, by - flap);
      ctx!.stroke();
    }

    function drawFar(wd: WorldDef, dist: number) {
      const per = 340;
      const off = (dist * 0.02) % per;
      ctx!.fillStyle = wd.far;
      for (let i = -1; i < W / per + 2; i++) {
        const x = i * per - off;
        if (wd.deco === "volcano") {
          ctx!.beginPath();
          ctx!.moveTo(x - 30, 330);
          ctx!.lineTo(x + 120, 150);
          ctx!.lineTo(x + 270, 330);
          ctx!.closePath();
          ctx!.fill();
          ctx!.fillStyle = "#ff7043";
          ctx!.beginPath();
          ctx!.ellipse(x + 120, 152, 26, 9, 0, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.fillStyle = wd.far;
        } else if (wd.deco === "pine") {
          ctx!.beginPath();
          ctx!.moveTo(x, 330);
          ctx!.lineTo(x + 130, 170);
          ctx!.lineTo(x + 260, 330);
          ctx!.closePath();
          ctx!.fill();
          ctx!.fillStyle = "#ffffff";
          ctx!.beginPath();
          ctx!.moveTo(x + 96, 212);
          ctx!.lineTo(x + 130, 170);
          ctx!.lineTo(x + 164, 212);
          ctx!.quadraticCurveTo(x + 130, 232, x + 96, 212);
          ctx!.fill();
          ctx!.fillStyle = wd.far;
        } else {
          ctx!.beginPath();
          ctx!.arc(x + 120, 380, 150, Math.PI, 0);
          ctx!.fill();
        }
      }
      ctx!.fillStyle = "rgba(255,255,255,0.25)";
      ctx!.fillRect(0, 326, W, 8);
    }

    function drawMid(wd: WorldDef, dist: number, t: number) {
      // roadside decorations streaming toward the camera along the track sides
      const per = 260; // depth spacing between decorations
      for (let i = 9; i >= 0; i--) {
        const idx = Math.floor(dist / per) + i;
        const z = idx * per - dist;
        if (z < -120 || z > 2300) continue;
        const p = proj(z);
        const side = idx % 2 === 0 ? -1 : 1;
        const x = W / 2 + side * 430 * p.t;
        const sway = Math.sin(t * 1.4 + idx) * 3;
        ctx!.save();
        ctx!.globalAlpha = clamp((2300 - z) / 500, 0, 1);
        ctx!.translate(x, p.y);
        ctx!.scale(p.t, p.t);
        if (wd.deco === "tree" || wd.deco === "palm") {
          ctx!.fillStyle = "#8a5a2b";
          rr(-7, -74, 14, 74, 6);
          ctx!.fill();
          ctx!.fillStyle = wd.mid;
          ctx!.beginPath();
          ctx!.arc(sway, -92, 34, 0, Math.PI * 2);
          ctx!.arc(-26 + sway, -70, 26, 0, Math.PI * 2);
          ctx!.arc(26 + sway, -70, 26, 0, Math.PI * 2);
          ctx!.fill();
        } else if (wd.deco === "volcano") {
          ctx!.fillStyle = wd.mid;
          ctx!.beginPath();
          ctx!.moveTo(-60, 0);
          ctx!.lineTo(0, -102);
          ctx!.lineTo(60, 0);
          ctx!.closePath();
          ctx!.fill();
          ctx!.fillStyle = "rgba(255,112,67,0.8)";
          ctx!.beginPath();
          ctx!.ellipse(0, -100, 13, 5, 0, 0, Math.PI * 2);
          ctx!.fill();
          // smoke puff
          ctx!.fillStyle = "rgba(120,120,120,0.35)";
          ctx!.beginPath();
          ctx!.arc(
            Math.sin(t + idx) * 6,
            -126 - ((t * 12 + idx * 20) % 40),
            10 + ((t * 12 + idx * 20) % 40) / 5,
            0,
            Math.PI * 2,
          );
          ctx!.fill();
        } else if (wd.deco === "pine") {
          ctx!.fillStyle = "#6d4c41";
          rr(-5, -42, 10, 42, 4);
          ctx!.fill();
          ctx!.fillStyle = wd.mid;
          for (let k = 0; k < 3; k++) {
            ctx!.beginPath();
            ctx!.moveTo(-34 + k * 7, -30 - k * 26);
            ctx!.lineTo(sway * 0.4, -84 - k * 26);
            ctx!.lineTo(34 - k * 7, -30 - k * 26);
            ctx!.closePath();
            ctx!.fill();
          }
          ctx!.fillStyle = "rgba(255,255,255,0.85)";
          ctx!.beginPath();
          ctx!.ellipse(0, -108, 12, 5, 0, 0, Math.PI * 2);
          ctx!.fill();
        } else if (wd.deco === "candy") {
          if (idx % 4 < 2) {
            ctx!.strokeStyle = "#ffffff";
            ctx!.lineWidth = 10;
            ctx!.beginPath();
            ctx!.moveTo(0, 0);
            ctx!.lineTo(0, -82);
            ctx!.stroke();
            ctx!.strokeStyle = "#ff6b9d";
            ctx!.setLineDash([10, 12]);
            ctx!.beginPath();
            ctx!.moveTo(0, 0);
            ctx!.lineTo(0, -82);
            ctx!.stroke();
            ctx!.setLineDash([]);
            ctx!.fillStyle = wd.mid;
            ctx!.beginPath();
            ctx!.arc(sway, -98, 26, 0, Math.PI * 2);
            ctx!.fill();
            ctx!.strokeStyle = "rgba(255,255,255,0.8)";
            ctx!.lineWidth = 4;
            ctx!.beginPath();
            ctx!.arc(sway, -98, 16, 0, Math.PI * 1.5);
            ctx!.stroke();
          } else {
            ctx!.fillStyle = "#a2e8dd";
            ctx!.beginPath();
            ctx!.arc(0, -42, 24, Math.PI, 0);
            ctx!.fill();
            rr(-24, -44, 48, 44, 6);
            ctx!.fill();
            ctx!.fillStyle = "#ffffff";
            rr(-24, -44, 48, 10, 4);
            ctx!.fill();
          }
        }
        ctx!.restore();
      }
    }

    function drawGround(wd: WorldDef, dist: number) {
      // grass on both sides of the track
      ctx!.fillStyle = wd.groundTop;
      ctx!.fillRect(0, HORIZON, W, H - HORIZON);
      const vpx = W / 2;
      const tB = (H - HORIZON) / (PLAYER_Y - HORIZON); // projection t at the bottom edge
      // dirt track converging to the vanishing point
      ctx!.fillStyle = wd.ground;
      ctx!.beginPath();
      ctx!.moveTo(vpx, HORIZON);
      ctx!.lineTo(vpx - 385 * tB, H);
      ctx!.lineTo(vpx + 385 * tB, H);
      ctx!.closePath();
      ctx!.fill();
      // track edges
      ctx!.strokeStyle = "rgba(0,0,0,0.18)";
      ctx!.lineWidth = 5;
      for (const off of [-385, 385]) {
        ctx!.beginPath();
        ctx!.moveTo(vpx, HORIZON);
        ctx!.lineTo(vpx + off * tB, H);
        ctx!.stroke();
      }
      // lane divider lines
      ctx!.strokeStyle = "rgba(255,255,255,0.3)";
      ctx!.lineWidth = 4;
      for (const off of [-125, 125]) {
        ctx!.beginPath();
        ctx!.moveTo(vpx, HORIZON);
        ctx!.lineTo(vpx + off * tB, H);
        ctx!.stroke();
      }
      // transverse stripes rushing toward the camera
      ctx!.fillStyle = "#ffffff";
      const per = 130;
      for (let i = 0; i < 16; i++) {
        const z = i * per - (dist % per);
        const a = proj(z);
        const b = proj(z + 24);
        if (a.y <= HORIZON + 2) continue;
        ctx!.save();
        ctx!.globalAlpha = clamp(a.t, 0.15, 1) * 0.16;
        ctx!.beginPath();
        ctx!.moveTo(vpx - 370 * a.t, a.y);
        ctx!.lineTo(vpx + 370 * a.t, a.y);
        ctx!.lineTo(vpx + 370 * b.t, b.y);
        ctx!.lineTo(vpx - 370 * b.t, b.y);
        ctx!.closePath();
        ctx!.fill();
        ctx!.restore();
      }
    }

    function drawAmbient(gs: ReturnType<typeof makeGameState>, wd: WorldDef, dt: number) {
      if (gs.amb.length < 22) {
        gs.amb.push({
          x: rnd(0, W),
          y: wd.particle === "ember" ? rnd(H * 0.5, H) : rnd(-20, H * 0.5),
          vx: rnd(-16, 16),
          vy: wd.particle === "ember" ? rnd(-50, -25) : rnd(18, 48),
          size: rnd(3, 7),
          seed: rnd(0, 7),
        });
      }
      for (const p of gs.amb) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.y > H + 20 || p.y < -30 || p.x < -30 || p.x > W + 30) {
          p.x = rnd(0, W);
          p.y = wd.particle === "ember" ? H + 10 : -15;
        }
        const wob = Math.sin(gs.t * 2 + p.seed) * 8;
        ctx!.save();
        ctx!.translate(p.x + wob, p.y);
        if (wd.particle === "leaf") {
          ctx!.rotate(Math.sin(gs.t * 3 + p.seed) * 0.8);
          ctx!.fillStyle = p.seed > 3.5 ? "#8bc34a" : "#ffb74d";
          ctx!.beginPath();
          ctx!.ellipse(0, 0, p.size, p.size * 0.5, 0.6, 0, Math.PI * 2);
          ctx!.fill();
        } else if (wd.particle === "drop") {
          ctx!.fillStyle = "rgba(90,180,245,0.6)";
          ctx!.beginPath();
          ctx!.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          ctx!.fill();
        } else if (wd.particle === "ember") {
          ctx!.fillStyle = p.seed > 3.5 ? "rgba(255,140,60,0.85)" : "rgba(255,200,80,0.85)";
          ctx!.beginPath();
          ctx!.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          ctx!.fill();
        } else if (wd.particle === "snow") {
          ctx!.fillStyle = "rgba(255,255,255,0.9)";
          ctx!.beginPath();
          ctx!.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
          ctx!.fill();
        } else {
          ctx!.fillStyle = ["#ff6b9d", "#4cc9f0", "#ffd60a"][Math.floor(p.seed) % 3];
          ctx!.save();
          ctx!.rotate(gs.t * 2 + p.seed);
          rr(-p.size / 2, -p.size / 2, p.size, p.size, 2);
          ctx!.fill();
          ctx!.restore();
        }
        ctx!.restore();
      }
    }

    // ---------- dino ----------

    function drawDino(
      x: number,
      groundY: number,
      scale: number,
      ch: DinoCharacter,
      o: {
        t: number;
        y: number;
        duck: boolean;
        running: boolean;
        hurt: boolean;
        happy: boolean;
        celebrate: boolean;
        alpha: number;
        lean: number;
      },
    ) {
      // back view — the dino runs away from the camera, into the screen
      ctx!.save();
      ctx!.globalAlpha = o.alpha;
      ctx!.translate(x, groundY);
      ctx!.scale(scale, scale);
      // shadow
      ctx!.fillStyle = "rgba(0,0,0,0.18)";
      ctx!.beginPath();
      ctx!.ellipse(0, 4, 34 * clamp(1 - o.y / 380, 0.45, 1), 8, 0, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.translate(0, -o.y);
      if (o.celebrate) ctx!.translate(0, -Math.abs(Math.sin(o.t * 6)) * 22);
      ctx!.rotate(o.lean * 0.14); // bank into lane changes
      if (o.duck) ctx!.scale(1.15, 0.6);
      const outline = "rgba(40,30,20,0.35)";
      const darker = ch.spikes;
      const ph = o.running ? o.t * 13 : o.t * 2;
      // tail dragging toward the camera, swishing with the run
      const swish = Math.sin(ph * 0.5) * 12;
      ctx!.fillStyle = ch.body;
      ctx!.beginPath();
      ctx!.moveTo(-10, -34);
      ctx!.quadraticCurveTo(swish - 6, -10, swish + 12, 8);
      ctx!.quadraticCurveTo(swish + 24, 2, 12, -30);
      ctx!.closePath();
      ctx!.fill();
      ctx!.strokeStyle = outline;
      ctx!.lineWidth = 3;
      ctx!.stroke();
      // legs — feet kick up alternately as seen from behind
      ctx!.strokeStyle = darker;
      ctx!.lineWidth = 11;
      ctx!.lineCap = "round";
      const kickL = o.running ? Math.max(0, Math.sin(ph)) * 16 : 0;
      const kickR = o.running ? Math.max(0, Math.sin(ph + Math.PI)) * 16 : 0;
      ctx!.beginPath();
      ctx!.moveTo(-13, -28);
      ctx!.lineTo(-15, -2 - kickL);
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.moveTo(13, -28);
      ctx!.lineTo(15, -2 - kickR);
      ctx!.stroke();
      // body (back view)
      ctx!.beginPath();
      ctx!.ellipse(0, -44, 30, 28, 0, 0, Math.PI * 2);
      ctx!.fillStyle = ch.body;
      ctx!.fill();
      ctx!.stroke();
      // little arms at the sides
      ctx!.strokeStyle = darker;
      ctx!.lineWidth = 7;
      const armSwing = o.running ? Math.sin(ph) * 5 : 0;
      ctx!.beginPath();
      ctx!.moveTo(-26, -48);
      if (o.celebrate) ctx!.lineTo(-34, -70 - Math.sin(o.t * 8) * 5);
      else ctx!.lineTo(-33, -38 + armSwing);
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.moveTo(26, -48);
      if (o.celebrate) ctx!.lineTo(34, -70 + Math.sin(o.t * 8) * 5);
      else ctx!.lineTo(33, -38 - armSwing);
      ctx!.stroke();
      // spikes running down the spine
      ctx!.fillStyle = ch.spikes;
      for (let i = 0; i < 3; i++) {
        const sy = -62 + i * 13;
        ctx!.beginPath();
        ctx!.moveTo(-7, sy + 6);
        ctx!.quadraticCurveTo(0, sy - 10, 7, sy + 6);
        ctx!.closePath();
        ctx!.fill();
      }
      // head, slightly turned so an eye and the snout peek out
      const bob = o.running ? Math.sin(o.t * 13) * 2 : Math.sin(o.t * 1.5) * 1.5;
      ctx!.save();
      ctx!.translate(4 + o.lean * 6, -78 + bob + (o.duck ? 10 : 0));
      ctx!.beginPath();
      ctx!.arc(0, 0, 20, 0, Math.PI * 2);
      ctx!.fillStyle = ch.body;
      ctx!.fill();
      ctx!.strokeStyle = outline;
      ctx!.stroke();
      // snout
      ctx!.beginPath();
      ctx!.ellipse(15, 5, 10, 7, 0, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.stroke();
      ctx!.fillStyle = "rgba(40,30,20,0.6)";
      ctx!.beginPath();
      ctx!.arc(21, 3, 1.6, 0, Math.PI * 2);
      ctx!.fill();
      // eye near the right edge (3/4 back view)
      const blink = o.t % 3.6 < 0.12 && !o.hurt;
      if (o.hurt) {
        ctx!.strokeStyle = "#3a2a1a";
        ctx!.lineWidth = 3;
        ctx!.beginPath();
        ctx!.moveTo(7, -8);
        ctx!.lineTo(15, -1);
        ctx!.moveTo(15, -8);
        ctx!.lineTo(7, -1);
        ctx!.stroke();
      } else if (o.happy || o.celebrate) {
        ctx!.strokeStyle = "#3a2a1a";
        ctx!.lineWidth = 3;
        ctx!.beginPath();
        ctx!.arc(11, -4, 5, Math.PI, 0);
        ctx!.stroke();
      } else if (blink) {
        ctx!.strokeStyle = "#3a2a1a";
        ctx!.lineWidth = 3;
        ctx!.beginPath();
        ctx!.moveTo(6, -4);
        ctx!.lineTo(16, -4);
        ctx!.stroke();
      } else {
        ctx!.fillStyle = "#ffffff";
        ctx!.beginPath();
        ctx!.arc(11, -4, 6, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.fillStyle = "#2b2b2b";
        ctx!.beginPath();
        ctx!.arc(13, -4, 3.4, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.fillStyle = "#ffffff";
        ctx!.beginPath();
        ctx!.arc(14.2, -5.3, 1.2, 0, Math.PI * 2);
        ctx!.fill();
      }
      // cheek
      ctx!.fillStyle = "rgba(255,120,140,0.35)";
      ctx!.beginPath();
      ctx!.arc(6, 7, 4, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
      ctx!.restore();
    }

    // ---------- obstacles & collectibles ----------

    function drawEnt(e: Ent, wd: WorldDef, t: number) {
      const p = proj(e.x);
      const s = p.t;
      ctx!.save();
      // fade in as things appear near the horizon
      ctx!.globalAlpha = clamp((SPAWN_Z - 40 - e.x) / 240, 0, 1);
      ctx!.translate(laneX(e.lane, p.t), p.y);
      ctx!.scale(s, s);
      const outline = "rgba(40,30,20,0.3)";
      ctx!.lineWidth = 3;
      ctx!.strokeStyle = outline;
      if (e.cat === "ob") {
        if (e.sub === "rock") {
          ctx!.fillStyle =
            wd.deco === "candy" ? "#b39ddb" : wd.deco === "pine" ? "#cfe4f5" : "#9e9e9e";
          ctx!.beginPath();
          ctx!.moveTo(-30, 0);
          ctx!.quadraticCurveTo(-32, -40, -6, -50);
          ctx!.quadraticCurveTo(26, -52, 31, -18);
          ctx!.quadraticCurveTo(33, 0, 24, 0);
          ctx!.closePath();
          ctx!.fill();
          ctx!.stroke();
          ctx!.fillStyle = "rgba(255,255,255,0.25)";
          ctx!.beginPath();
          ctx!.arc(-8, -32, 6, 0, Math.PI * 2);
          ctx!.arc(10, -22, 4, 0, Math.PI * 2);
          ctx!.fill();
        } else if (e.sub === "log") {
          // log rolling toward the camera — bark stripes sweep down its face
          const roll = -e.x * 0.12 + e.phase * 10;
          ctx!.translate(0, -22);
          ctx!.fillStyle = "#8d6e63";
          rr(-50, -22, 100, 44, 22);
          ctx!.fill();
          ctx!.stroke();
          ctx!.save();
          rr(-50, -22, 100, 44, 22);
          ctx!.clip();
          ctx!.fillStyle = "rgba(93,58,42,0.5)";
          for (let k = 0; k < 3; k++) {
            const yy = -22 + ((((roll + k * 15) % 44) + 44) % 44);
            rr(-46, yy - 2.5, 92, 5, 3);
            ctx!.fill();
          }
          ctx!.restore();
          ctx!.strokeStyle = "#6d4c41";
          ctx!.lineWidth = 3;
          ctx!.beginPath();
          ctx!.ellipse(36, 0, 9, 16, 0, 0, Math.PI * 2);
          ctx!.stroke();
          ctx!.beginPath();
          ctx!.ellipse(36, 0, 4, 8, 0, 0, Math.PI * 2);
          ctx!.stroke();
        } else if (e.sub === "tree") {
          ctx!.fillStyle = "#8a5a2b";
          rr(-58, -40, 108, 38, 18);
          ctx!.fill();
          ctx!.stroke();
          ctx!.fillStyle = "#a1887f";
          ctx!.beginPath();
          ctx!.arc(52, -21, 17, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.stroke();
          ctx!.strokeStyle = "#6d4c41";
          ctx!.beginPath();
          ctx!.arc(52, -21, 9, 0, Math.PI * 2);
          ctx!.stroke();
          ctx!.fillStyle = wd.mid;
          ctx!.beginPath();
          ctx!.arc(-56, -30, 15, 0, Math.PI * 2);
          ctx!.arc(-66, -18, 12, 0, Math.PI * 2);
          ctx!.fill();
        } else if (e.sub === "river") {
          ctx!.fillStyle = wd.water;
          ctx!.beginPath();
          ctx!.ellipse(0, 0, 74, 13, 0, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.strokeStyle = "rgba(255,255,255,0.7)";
          ctx!.lineWidth = 2.5;
          for (let i = 0; i < 3; i++) {
            const wx = -44 + i * 40 + Math.sin(t * 4 + i * 2) * 6;
            ctx!.beginPath();
            ctx!.arc(wx, -2, 8, Math.PI * 0.15, Math.PI * 0.85, true);
            ctx!.stroke();
          }
        } else if (e.sub === "mud") {
          ctx!.fillStyle = wd.goo;
          ctx!.beginPath();
          ctx!.ellipse(0, 0, 62, 12, 0, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.fillStyle = "rgba(255,255,255,0.25)";
          for (let i = 0; i < 3; i++) {
            const bx = -30 + i * 28;
            const bs = 3 + ((t * 2 + i) % 1) * 4;
            ctx!.beginPath();
            ctx!.arc(bx, -3, bs, 0, Math.PI * 2);
            ctx!.fill();
          }
        } else if (e.sub === "sleepy") {
          // sleeping dino — too big to jump, lean to another lane!
          ctx!.fillStyle = "#90a4ae";
          ctx!.beginPath();
          ctx!.ellipse(0, -34, 44, 33, 0, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.stroke();
          ctx!.beginPath();
          ctx!.arc(34, -58, 18, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.stroke();
          ctx!.fillStyle = "#78909c";
          for (let i = 0; i < 3; i++) {
            const sx = -30 + i * 16;
            ctx!.beginPath();
            ctx!.moveTo(sx - 6, -60);
            ctx!.quadraticCurveTo(sx, -76, sx + 6, -60);
            ctx!.closePath();
            ctx!.fill();
          }
          ctx!.strokeStyle = "#455a64";
          ctx!.lineWidth = 2.5;
          ctx!.beginPath();
          ctx!.arc(38, -60, 5, Math.PI * 0.15, Math.PI * 0.85);
          ctx!.stroke();
          ctx!.font = "bold 16px sans-serif";
          ctx!.fillStyle = "#455a64";
          const zb = Math.sin(t * 2 + e.phase);
          ctx!.fillText("z", 50, -84 - zb * 4);
          ctx!.font = "bold 20px sans-serif";
          ctx!.fillText("Z", 60, -98 - zb * 6);
        } else if (e.sub === "ptero") {
          ctx!.translate(0, -e.yOff + Math.sin(t * 3 + e.phase) * 8);
          const flap = Math.sin(t * 8 + e.phase) * 0.8;
          ctx!.fillStyle = "#ce93d8";
          // wings
          ctx!.beginPath();
          ctx!.moveTo(-4, 0);
          ctx!.quadraticCurveTo(-34, -18 - flap * 22, -50, 2 - flap * 26);
          ctx!.quadraticCurveTo(-28, 8, -4, 8);
          ctx!.closePath();
          ctx!.fill();
          ctx!.stroke();
          ctx!.beginPath();
          ctx!.moveTo(4, 0);
          ctx!.quadraticCurveTo(34, -18 - flap * 22, 50, 2 - flap * 26);
          ctx!.quadraticCurveTo(28, 8, 4, 8);
          ctx!.closePath();
          ctx!.fill();
          ctx!.stroke();
          // body + head
          ctx!.beginPath();
          ctx!.ellipse(0, 4, 14, 10, 0, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.stroke();
          ctx!.beginPath();
          ctx!.moveTo(12, -2);
          ctx!.lineTo(30, 4);
          ctx!.lineTo(12, 10);
          ctx!.closePath();
          ctx!.fillStyle = "#ba68c8";
          ctx!.fill();
          ctx!.fillStyle = "#2b2b2b";
          ctx!.beginPath();
          ctx!.arc(10, 2, 2.2, 0, Math.PI * 2);
          ctx!.fill();
        }
      } else {
        // collectibles
        const fly = e.taken ? clamp((e.takeT ?? 0) / 0.35, 0, 1) : 0;
        ctx!.translate(0, -e.yOff - Math.sin(t * 3 + e.phase) * 5);
        ctx!.globalAlpha *= 1 - fly * 0.6;
        ctx!.scale(1 - fly * 0.5, 1 - fly * 0.5);
        if (e.sub === "coin") {
          const spin = Math.abs(Math.sin(t * 4 + e.phase));
          ctx!.save();
          ctx!.scale(0.35 + spin * 0.65, 1);
          ctx!.fillStyle = "#ffd60a";
          ctx!.beginPath();
          ctx!.arc(0, 0, 16, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.strokeStyle = "#e6a800";
          ctx!.lineWidth = 3;
          ctx!.stroke();
          ctx!.strokeStyle = "#fff3b0";
          ctx!.beginPath();
          ctx!.arc(0, 0, 9, 0, Math.PI * 2);
          ctx!.stroke();
          ctx!.restore();
        } else if (e.sub === "egg") {
          ctx!.fillStyle = "#fffaf0";
          ctx!.beginPath();
          ctx!.ellipse(0, 0, 15, 20, 0, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.strokeStyle = "rgba(40,30,20,0.25)";
          ctx!.stroke();
          ctx!.fillStyle = "#80cbc4";
          for (const [dx, dy, r] of [
            [-5, -6, 3.5],
            [6, 2, 3],
            [-2, 9, 2.6],
          ] as const) {
            ctx!.beginPath();
            ctx!.arc(dx, dy, r, 0, Math.PI * 2);
            ctx!.fill();
          }
        } else if (e.sub === "gem") {
          const hue = (t * 80 + e.phase * 60) % 360;
          ctx!.fillStyle = `hsl(${hue} 85% 62%)`;
          ctx!.beginPath();
          ctx!.moveTo(0, -18);
          ctx!.lineTo(15, -4);
          ctx!.lineTo(0, 18);
          ctx!.lineTo(-15, -4);
          ctx!.closePath();
          ctx!.fill();
          ctx!.strokeStyle = "rgba(255,255,255,0.85)";
          ctx!.lineWidth = 2;
          ctx!.stroke();
          ctx!.beginPath();
          ctx!.moveTo(-8, -6);
          ctx!.lineTo(0, -14);
          ctx!.lineTo(8, -6);
          ctx!.stroke();
        } else if (e.sub === "star") {
          const pulse = 1 + Math.sin(t * 5 + e.phase) * 0.12;
          ctx!.save();
          ctx!.scale(pulse, pulse);
          ctx!.rotate(Math.sin(t * 2) * 0.15);
          ctx!.fillStyle = "rgba(255,214,10,0.25)";
          ctx!.beginPath();
          ctx!.arc(0, 0, 36, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.fillStyle = "#ffd60a";
          ctx!.strokeStyle = "#e6a800";
          ctx!.lineWidth = 3;
          ctx!.beginPath();
          for (let i = 0; i < 10; i++) {
            const r = i % 2 === 0 ? 24 : 11;
            const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
            ctx!.lineTo(Math.cos(a) * r, Math.sin(a) * r);
          }
          ctx!.closePath();
          ctx!.fill();
          ctx!.stroke();
          ctx!.fillStyle = "#fff";
          ctx!.beginPath();
          ctx!.arc(-5, -5, 3, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.restore();
        }
      }
      ctx!.restore();
    }

    // ---------- finish gate ----------

    function drawFinishGate(z: number) {
      const p = proj(z);
      ctx!.save();
      ctx!.globalAlpha = clamp((SPAWN_Z + 200 - z) / 300, 0, 1);
      ctx!.translate(W / 2, p.y);
      ctx!.scale(p.t, p.t);
      // striped poles
      for (const px of [-400, 384]) {
        ctx!.fillStyle = "#e53e3e";
        rr(px, -170, 16, 170, 6);
        ctx!.fill();
        ctx!.fillStyle = "#ffffff";
        for (let k = 0; k < 4; k++) {
          ctx!.fillRect(px, -170 + 21 + k * 42, 16, 21);
        }
      }
      // banner
      ctx!.fillStyle = "#ffffff";
      rr(-408, -224, 816, 62, 14);
      ctx!.fill();
      ctx!.strokeStyle = "#e53e3e";
      ctx!.lineWidth = 5;
      ctx!.stroke();
      // checkered strip along the bottom of the banner
      ctx!.fillStyle = "#2b2b2b";
      for (let k = 0; k < 34; k += 2) {
        ctx!.fillRect(-408 + k * 24, -176, 24, 14);
      }
      // text
      ctx!.fillStyle = "#e53e3e";
      ctx!.font = "900 40px system-ui, sans-serif";
      ctx!.textAlign = "center";
      ctx!.fillText("FINISH", 0, -184);
      ctx!.font = "32px system-ui, sans-serif";
      ctx!.fillText("🏁", -340, -184);
      ctx!.fillText("🏁", 340, -184);
      ctx!.restore();
    }

    // ---------- particles / floats ----------

    function stepEffects(gs: ReturnType<typeof makeGameState>, dt: number) {
      for (let i = gs.parts.length - 1; i >= 0; i--) {
        const p = gs.parts[i];
        p.life += dt;
        if (p.life >= p.max) {
          if (p.kind === "rocket") burstAt(gs, p.x, p.y);
          gs.parts.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        if (p.kind === "dot" || p.kind === "spark") p.vy += 300 * dt;
        if (p.kind === "confetti") {
          p.vy += 30 * dt;
          p.x += Math.sin(p.life * 6 + p.rot) * 40 * dt;
        }
        const a = 1 - p.life / p.max;
        ctx!.save();
        ctx!.globalAlpha = a;
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.rot);
        ctx!.fillStyle = p.color;
        if (p.kind === "confetti") ctx!.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        else {
          ctx!.beginPath();
          ctx!.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx!.fill();
        }
        ctx!.restore();
      }
      for (let i = gs.floats.length - 1; i >= 0; i--) {
        const f = gs.floats[i];
        f.life += dt;
        f.y -= 50 * dt;
        if (f.life > 1) {
          gs.floats.splice(i, 1);
          continue;
        }
        ctx!.save();
        ctx!.globalAlpha = 1 - f.life;
        ctx!.font = "900 26px system-ui, sans-serif";
        ctx!.textAlign = "center";
        ctx!.lineWidth = 5;
        ctx!.strokeStyle = "rgba(255,255,255,0.9)";
        ctx!.strokeText(f.text, f.x, f.y);
        ctx!.fillStyle = f.color;
        ctx!.fillText(f.text, f.x, f.y);
        ctx!.restore();
      }
    }

    // ---------- simulation ----------

    function sim(gs: ReturnType<typeof makeGameState>, dt: number) {
      const wd = WORLDS[gs.world];
      const sig = signalsRef.current;
      const kb = kbRef.current;
      const usePose = camOnRef.current && sig.calibrated;

      // controls
      const targetLane = usePose ? 1 + sig.lean : kb.lane;
      gs.targetLane = clamp(targetLane, 0, 2);
      const duck = (usePose && sig.duck) || kb.duck;
      const handsUp = (usePose && sig.handsUp) || kb.handsUp;
      const jumpTotal = sig.jumpCount + kb.jump;
      if (jumpTotal > gs.prevJump) {
        gs.prevJump = jumpTotal;
        if (gs.grounded && !gs.ducking) {
          gs.vy = JUMP_V;
          gs.grounded = false;
          gs.jumps++;
          sfx.jump();
          spawnParts(gs, laneX(gs.laneF, 1), PLAYER_Y, 6, ["#d7ccc8", "#efebe9"], 90, -60);
        }
      }
      gs.prevJump = jumpTotal;
      if (duck !== gs.ducking) {
        gs.ducking = duck;
        if (duck && gs.grounded) sfx.duck();
      }

      // lane easing
      gs.laneF += (gs.targetLane - gs.laneF) * Math.min(1, dt * 9);

      // jump physics
      if (!gs.grounded) {
        gs.vy -= GRAVITY * dt;
        gs.y += gs.vy * dt;
        if (gs.y <= 0) {
          gs.y = 0;
          gs.vy = 0;
          gs.grounded = true;
          spawnParts(gs, laneX(gs.laneF, 1), PLAYER_Y, 5, ["#d7ccc8"], 80, -50);
        }
      }

      // speed + distance
      const slowed = gs.t < gs.mudUntil;
      gs.speed = (300 + gs.world * 26 + (gs.dist / gs.levelLen) * 90) * (slowed ? 0.55 : 1);
      const adv = gs.speed * dt;
      gs.dist += adv;
      gs.score += adv / 20;

      // spawn
      if (gs.dist >= gs.nextSpawn) spawnPattern(gs, wd);
      gs.starTimer -= dt;
      if (gs.starTimer <= 0) {
        gs.ents.push({
          cat: "col",
          sub: "star",
          lane: 1,
          x: SPAWN_Z,
          w: 60,
          h: 60,
          yOff: 205,
          vx: -30,
          phase: rnd(0, 6),
        });
        gs.starTimer = 11 + rnd(0, 7);
      }

      // entities approach the dino (depth 0) from the horizon
      for (let i = gs.ents.length - 1; i >= 0; i--) {
        const e = gs.ents[i];
        e.x -= adv + e.vx * dt;
        if (e.taken) {
          e.takeT = (e.takeT ?? 0) + dt;
          if (e.takeT > 0.35) gs.ents.splice(i, 1);
          continue;
        }
        if (e.x < -160) {
          gs.ents.splice(i, 1);
          continue;
        }

        const laneMatch = Math.abs(gs.laneF - e.lane) < 0.45;
        const dx = Math.abs(e.x);

        if (e.cat === "ob") {
          if (!laneMatch || gs.t < gs.invulnUntil) continue;
          if (dx > e.w / 2 + 20) continue;
          let hitNow = false;
          let mudNow = false;
          if (e.sub === "ptero") hitNow = !gs.ducking && gs.y < 70;
          else if (e.sub === "river") hitNow = gs.grounded && gs.y < 6;
          else if (e.sub === "mud") mudNow = gs.grounded && gs.y < 6 && gs.t >= gs.mudUntil;
          else if (e.sub === "sleepy") hitNow = gs.y < 86;
          else hitNow = gs.y < e.h * 0.85;
          if (mudNow) {
            gs.mudUntil = gs.t + 1.4;
            sfx.mud();
            voiceCue(gs, "Sticky mud! Jump out!", 1.8);
            spawnParts(gs, laneX(gs.laneF, 1), PLAYER_Y, 10, [wd.goo], 120, -120);
          } else if (hitNow) {
            gs.hearts--;
            gs.hits++;
            gs.streak = 0;
            gs.invulnUntil = gs.t + 2;
            gs.hurtUntil = gs.t + 0.9;
            if (e.sub === "river") sfx.splash();
            else sfx.hit();
            say(gs.hearts > 0 ? "Ouch! Be careful!" : "Oh no!");
            spawnParts(gs, laneX(gs.laneF, 1), PLAYER_Y - 40, 14, ["#ff8a80", "#ffd180"], 200, -180);
            if (gs.hearts <= 0) {
              gameOver();
              return;
            }
          }
        } else {
          // collectibles
          if (e.sub === "star") {
            if (handsUp && dx < 150) {
              e.taken = true;
              e.takeT = 0;
              gs.stars++;
              gs.score += 30;
              gs.meter = Math.min(100, gs.meter + 25);
              gs.streak++;
              gs.happyUntil = gs.t + 0.7;
              sfx.star();
              const sp = proj(e.x);
              float(gs, laneX(e.lane, sp.t), sp.y - e.yOff * sp.t, "+⭐", "#ffb703");
              burstAt(gs, laneX(e.lane, sp.t), sp.y - e.yOff * sp.t);
            }
            continue;
          }
          if (!laneMatch || dx > 52) continue;
          const dinoCenterY = 40 + gs.y;
          if (Math.abs(dinoCenterY - e.yOff) > 78) continue;
          e.taken = true;
          e.takeT = 0;
          gs.streak++;
          gs.happyUntil = gs.t + 0.6;
          const cp = proj(e.x);
          const fx = laneX(e.lane, cp.t);
          const fy = cp.y - (e.yOff + 20) * cp.t;
          if (e.sub === "coin") {
            gs.coins++;
            gs.score += 10;
            gs.meter = Math.min(100, gs.meter + 8);
            sfx.coin();
            float(gs, fx, fy, "+10", "#f59e0b");
          } else if (e.sub === "egg") {
            gs.eggs++;
            gs.score += 25;
            gs.meter = Math.min(100, gs.meter + 14);
            sfx.egg();
            float(gs, fx, fy, "+🥚", "#0891b2");
          } else if (e.sub === "gem") {
            gs.gems++;
            gs.score += 50;
            gs.meter = Math.min(100, gs.meter + 20);
            sfx.gem();
            float(gs, fx, fy, "+50", "#a855f7");
          }
          if (gs.meter >= 100) {
            gs.meter = 0;
            sfx.meterFull();
            if (gs.hearts < MAX_HEARTS) {
              gs.hearts++;
              sfx.heart();
              voiceCue(gs, "Reward full! Extra heart!", 3);
            } else {
              gs.score += 100;
              voiceCue(gs, "Reward full! Bonus points!", 3);
            }
            confettiBurst(gs);
          }
          if (gs.streak > 0 && gs.streak % 8 === 0 && gs.t > gs.praiseCd) {
            gs.praiseCd = gs.t + 6;
            voice(PRAISE[Math.floor(Math.random() * PRAISE.length)]);
          }
        }
      }

      // coaching voice for the next obstacle in the dino's lane
      if (gs.t > gs.voiceCd) {
        for (const e of gs.ents) {
          if (e.warned || e.taken) continue;
          const eta = e.x / gs.speed;
          if (eta < 0.35 || eta > 0.95) continue;
          if (e.cat === "col" && e.sub === "star") {
            e.warned = true;
            voiceCue(gs, "Hands up for the star!", 2.4);
            setCue(gs, "🙌", "HANDS UP!");
            break;
          }
          if (e.cat !== "ob" || Math.round(gs.laneF) !== e.lane) continue;
          e.warned = true;
          if (e.sub === "ptero") {
            voiceCue(gs, "Duck!", 2.2);
            setCue(gs, "⬇️", "DUCK!");
          } else if (e.sub === "sleepy") {
            const dir =
              e.lane === 0
                ? "right"
                : e.lane === 2
                  ? "left"
                  : Math.random() < 0.5
                    ? "left"
                    : "right";
            voiceCue(gs, `Move ${dir}!`, 2.2);
            setCue(gs, dir === "left" ? "⬅️" : "➡️", `MOVE ${dir.toUpperCase()}!`);
          } else if (e.sub === "mud") {
            voiceCue(gs, "Jump over the mud!", 2.2);
            setCue(gs, "⬆️", "JUMP!");
          } else {
            voiceCue(gs, "Jump!", 2.2);
            setCue(gs, "⬆️", "JUMP!");
          }
          break;
        }
      }

      // lost-tracking auto pause
      if (usePose) {
        if (!sig.present) {
          gs.lostSince += dt;
          if (gs.lostSince > 1.5) {
            gs.lostSince = 0;
            stopMusic();
            voice("Where did you go? Step back so I can see you!", true);
            setPhase("lost");
            return;
          }
        } else gs.lostSince = 0;
      }

      // finish line ahead
      if (!gs.finishCue && gs.dist / gs.levelLen > 0.86) {
        gs.finishCue = true;
        voiceCue(gs, "The finish line is ahead!", 3);
        setCue(gs, "🏁", "FINISH AHEAD!");
      }

      // level complete
      if (gs.dist >= gs.levelLen) finishLevel();
    }

    function voiceCue(gs: ReturnType<typeof makeGameState>, text: string, cd: number) {
      gs.voiceCd = gs.t + cd;
      voice(text);
    }

    // big on-screen action prompt shown alongside the coach's voice
    function setCue(gs: ReturnType<typeof makeGameState>, icon: string, text: string) {
      gs.cueIcon = icon;
      gs.cueText = text;
      gs.cueUntil = gs.t + 1.5;
    }

    // ---------- main loop ----------

    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const gs = g.current;
      const ph = phaseRef.current;
      const wd = WORLDS[gs.world];
      gs.t += dt;

      const playing = ph === "playing";
      if (playing) sim(gs, dt);
      if (ph === "menu") gs.idleDist += 30 * dt;

      const scrollDist = gs.dist + gs.idleDist;

      // render
      drawSky(wd, gs.t, scrollDist);
      drawFar(wd, scrollDist);
      drawGround(wd, scrollDist);
      drawMid(wd, scrollDist, gs.t);
      drawAmbient(gs, wd, dt);

      // finish gate rises over the horizon near the end of the level
      const zGate = gs.levelLen - gs.dist;
      if (gs.dist > 0 && zGate < SPAWN_Z + 240 && zGate > -240) drawFinishGate(zGate);

      // draw entities far-to-near; the dino sits at depth 0
      const sorted = [...gs.ents].sort((a, b) => b.x - a.x);
      for (const e of sorted) if (e.x >= 0 && e.sub !== "star") drawEnt(e, wd, gs.t);
      const blink = gs.t < gs.invulnUntil && Math.floor(gs.t * 10) % 2 === 0;
      drawDino(laneX(gs.laneF, 1), PLAYER_Y, 1, charRef.current, {
        t: gs.t,
        y: gs.y,
        duck: gs.ducking,
        running: playing,
        hurt: gs.t < gs.hurtUntil,
        happy: gs.t < gs.happyUntil,
        celebrate: ph === "complete",
        alpha: blink ? 0.35 : 1,
        lean: clamp(gs.targetLane - gs.laneF, -1, 1),
      });
      // entities that already passed the dino zoom by the camera
      for (const e of sorted) if (e.x < 0 && e.sub !== "star") drawEnt(e, wd, gs.t);
      // stars float above everything
      for (const e of sorted) if (e.sub === "star") drawEnt(e, wd, gs.t);

      // celebration fireworks
      if (ph === "complete") {
        gs.celebT += dt;
        gs.fireworkT -= dt;
        if (gs.fireworkT <= 0) {
          firework(gs);
          gs.fireworkT = 0.55 + rnd(0, 0.4);
        }
      }

      stepEffects(gs, dt);

      // big action cue banner (matches the coach's voice)
      if (playing && gs.t < gs.cueUntil) {
        const rem = gs.cueUntil - gs.t;
        const appear = clamp((1.5 - rem) / 0.15, 0, 1);
        const fade = clamp(rem / 0.3, 0, 1);
        ctx!.save();
        ctx!.globalAlpha = fade;
        ctx!.translate(W / 2, 140);
        const sc = (0.7 + 0.3 * appear) * (1 + Math.sin(gs.t * 9) * 0.035);
        ctx!.scale(sc, sc);
        ctx!.font = "900 42px system-ui, sans-serif";
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        const label = `${gs.cueIcon} ${gs.cueText}`;
        const tw = ctx!.measureText(label).width;
        rr(-tw / 2 - 28, -40, tw + 56, 80, 40);
        ctx!.fillStyle = "rgba(255,255,255,0.94)";
        ctx!.fill();
        ctx!.lineWidth = 6;
        ctx!.strokeStyle = "#ff9e40";
        ctx!.stroke();
        ctx!.fillStyle = "#c2410c";
        ctx!.fillText(label, 0, 3);
        ctx!.restore();
      }

      // HUD sync (throttled)
      if (gs.t - lastHudPush.current > 0.15 || !playing) {
        lastHudPush.current = gs.t;
        setHud((prev) => {
          const next = {
            score: Math.floor(gs.score),
            hearts: gs.hearts,
            eggs: gs.eggs,
            stars: gs.stars,
            coins: gs.coins,
            gems: gs.gems,
            meter: Math.round(gs.meter),
            progress: clamp(gs.dist / gs.levelLen, 0, 1),
          };
          const same =
            prev.score === next.score &&
            prev.hearts === next.hearts &&
            prev.eggs === next.eggs &&
            prev.stars === next.stars &&
            prev.coins === next.coins &&
            prev.gems === next.gems &&
            prev.meter === next.meter &&
            Math.abs(prev.progress - next.progress) < 0.004;
          return same ? prev : next;
        });
      }
    };
    raf = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resume from lost-tracking once the child is visible again
  useEffect(() => {
    if (phase !== "lost") return;
    const iv = setInterval(() => {
      const s = signalsRef.current;
      if (s.present && s.fullBody) {
        g.current.invulnUntil = g.current.t + 1.2;
        voice("There you are! Go!", true);
        startMusic(g.current.world);
        setPhase("playing");
      }
    }, 300);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ---------- derived UI ----------

  const wd = WORLDS[worldIdx];
  const showHud = phase === "playing" || phase === "paused" || phase === "lost";
  const finishedAll = worldIdx >= WORLDS.length - 1;
  const camVisible = camOn && phase !== "menu" && phase !== "complete" && phase !== "gameover";

  const retrySameWorld = useCallback(() => {
    sfx.click();
    resetRun(g.current.world, false);
    setPhase(
      camOn && signalsRef.current.calibrated ? "countdown" : camOn ? "calibrate" : "countdown",
    );
  }, [camOn, resetRun]);

  const nextWorld = useCallback(() => {
    sfx.click();
    const nw = Math.min(WORLDS.length - 1, g.current.world + 1);
    resetRun(nw, true);
    setPhase(
      camOn && signalsRef.current.calibrated ? "countdown" : camOn ? "calibrate" : "countdown",
    );
  }, [camOn, resetRun]);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-gradient-to-b from-sky-200 to-emerald-100">
      {/* game canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-cover" />

      {/* body tracking PiP */}
      {camVisible && (
        <div
          className={
            phase === "calibrate" || phase === "tracking-ready"
              ? "absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-[62%]"
              : "absolute right-3 top-16 z-30 md:top-20"
          }
        >
          <DinoPoseControl
            active={phase === "playing"}
            signalsRef={signalsRef}
            calibrating={calibrating}
            onCalibrated={onCalibrated}
            onStatusChange={setPoseStatus}
            size={phase === "calibrate" || phase === "tracking-ready" ? "lg" : "sm"}
          />
        </div>
      )}

      {/* top bar */}
      <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between gap-2 p-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sfx.click();
              if (phase === "menu") onBack();
              else goHome();
            }}
            className="flex items-center gap-2 rounded-full bg-card/95 px-4 py-2 text-sm font-black text-foreground shadow-lg backdrop-blur transition-transform hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4" /> {phase === "menu" ? "Back" : "Home"}
          </button>
          <button
            onClick={toggleMute}
            aria-label="Toggle sound"
            className="grid h-9 w-9 place-items-center rounded-full bg-card/95 text-foreground shadow-lg backdrop-blur"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>

        {showHud && (
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            <div className="flex items-center gap-0.5 rounded-full bg-card/95 px-3 py-2 shadow-lg backdrop-blur">
              {Array.from({ length: MAX_HEARTS }).map((_, i) => (
                <Heart
                  key={i}
                  className={`h-4 w-4 ${i < hud.hearts ? "fill-red-500 text-red-500" : "text-muted-foreground/40"}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-card/95 px-3 py-2 text-sm font-black shadow-lg backdrop-blur">
              🏆 {hud.score}
            </div>
            <div className="flex items-center gap-1 rounded-full bg-card/95 px-3 py-2 text-sm font-black shadow-lg backdrop-blur">
              🥚 {hud.eggs}
            </div>
            <div className="flex items-center gap-1 rounded-full bg-card/95 px-3 py-2 text-sm font-black shadow-lg backdrop-blur">
              ⭐ {hud.stars}
            </div>
            <button
              onClick={togglePause}
              aria-label="Pause"
              className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
            >
              {phase === "paused" ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
            </button>
          </div>
        )}
      </div>

      {/* progress + reward meter */}
      {showHud && (
        <div className="absolute left-1/2 top-14 z-20 w-[min(70vw,430px)] -translate-x-1/2 md:top-16">
          <div className="flex items-center gap-2 rounded-full bg-card/90 p-1.5 pl-3 shadow-lg backdrop-blur">
            <span className="text-lg">{wd.emoji}</span>
            <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-jungle to-sunshine transition-all duration-300"
                style={{ width: `${Math.round(hud.progress * 100)}%` }}
              />
            </div>
            <span className="pr-1 text-lg">🏁</span>
          </div>
          <div className="mx-auto mt-1.5 flex w-[70%] items-center gap-1.5 rounded-full bg-card/80 p-1 pl-2 shadow backdrop-blur">
            <Gift className="h-3.5 w-3.5 text-coral" />
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-coral to-sunshine transition-all"
                style={{ width: `${hud.meter}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* mascot voice bubble */}
      {(showHud || phase === "countdown" || phase === "tracking-ready") && voiceLine.text && (
        <div
          key={voiceLine.n}
          className="absolute bottom-4 left-4 z-30 flex max-w-[300px] items-end gap-2"
        >
          <div className="animate-bounce-soft text-4xl drop-shadow">🦖</div>
          <div className="rounded-2xl rounded-bl-sm border-2 border-card bg-card/95 px-3 py-2 text-sm font-black text-foreground shadow-xl backdrop-blur">
            {voiceLine.text}
          </div>
        </div>
      )}

      {/* ======================= MENU ======================= */}
      {phase === "menu" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center overflow-y-auto bg-background/35 backdrop-blur-[3px]">
          <div className="mx-3 my-4 w-full max-w-2xl rounded-3xl border-4 border-card bg-card/95 p-5 text-center shadow-2xl md:p-6">
            <div className="text-5xl">🦕🌈</div>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-foreground md:text-4xl">
              Dino Adventure Run
            </h1>
            <p className="mt-1 text-sm font-bold text-muted-foreground">
              Jump, duck and lean in real life — your body is the controller!
            </p>

            {/* how to move */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-left text-xs font-bold text-muted-foreground md:grid-cols-5">
              {[
                ["🦘", "Jump", "to hop over rocks"],
                ["🙇", "Bend down", "to duck"],
                ["👈", "Lean left", "to move left"],
                ["👉", "Lean right", "to move right"],
                ["🙌", "Hands up", "to catch stars"],
              ].map(([em, a, b]) => (
                <div key={a} className="rounded-2xl bg-secondary p-2.5">
                  <div className="text-xl">{em}</div>
                  <div className="text-foreground">{a}</div>
                  <div className="text-[10px]">{b}</div>
                </div>
              ))}
            </div>

            {/* character picker */}
            <div className="mt-4">
              <div className="mb-1.5 text-xs font-black uppercase tracking-wider text-muted-foreground">
                Pick your dino · unlock with eggs 🥚 {prog.eggs}
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {DINO_CHARACTERS.map((c) => {
                  const unlocked = isCharacterUnlocked(c.id);
                  const sel = selChar === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => pickCharacter(c.id)}
                      disabled={!unlocked}
                      className={`relative flex w-[84px] flex-col items-center gap-1 rounded-2xl border-4 p-2 transition-all ${
                        sel
                          ? "border-primary bg-primary/10 shadow-lg"
                          : unlocked
                            ? "border-transparent bg-secondary hover:scale-105"
                            : "border-transparent bg-muted opacity-70"
                      }`}
                    >
                      <MiniDino c={c} gray={!unlocked} />
                      <span className="text-[11px] font-black text-foreground">{c.name}</span>
                      {!unlocked && (
                        <span className="absolute -top-1.5 right-1 rounded-full bg-foreground/80 px-1.5 py-0.5 text-[9px] font-black text-background">
                          🥚{c.eggsNeeded}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* world map */}
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-center gap-1 text-xs font-black uppercase tracking-wider text-muted-foreground">
                <MapIcon className="h-3.5 w-3.5" /> Adventure Map
              </div>
              <div className="flex items-center justify-center gap-1">
                {WORLDS.map((w, i) => {
                  const unlocked = i <= prog.worldsCompleted;
                  const done = i < prog.worldsCompleted;
                  return (
                    <div key={w.name} className="flex items-center">
                      <button
                        onClick={() => {
                          if (unlocked) {
                            sfx.click();
                            setStartWorld(i);
                            setWorldIdx(i);
                            g.current.world = i;
                          }
                        }}
                        disabled={!unlocked}
                        title={w.name}
                        className={`grid h-12 w-12 place-items-center rounded-full border-4 text-xl transition-all ${
                          startWorld === i
                            ? "scale-110 border-primary bg-primary/15 shadow-lg"
                            : unlocked
                              ? "border-card bg-secondary hover:scale-105"
                              : "border-card bg-muted opacity-50"
                        }`}
                      >
                        {unlocked ? w.emoji : "🔒"}
                        {done && <span className="absolute -mt-9 ml-9 text-xs">✅</span>}
                      </button>
                      {i < WORLDS.length - 1 && <div className="h-1 w-4 rounded bg-muted" />}
                    </div>
                  );
                })}
              </div>
              <div className="mt-1 text-xs font-bold text-muted-foreground">
                {WORLDS[startWorld].name}
              </div>
            </div>

            {/* totals + daily */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm font-black">
              <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5">
                <Star className="h-4 w-4 fill-sunshine text-sunshine" /> {prog.stars}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5">
                <Egg className="h-4 w-4 text-cyan-600" /> {prog.eggs}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5">
                <Gem className="h-4 w-4 text-purple-500" /> {prog.gems}
              </span>
              <span className="rounded-full bg-secondary px-3 py-1.5">
                🏆 Best {prog.bestScore}
              </span>
              <button
                onClick={handleDaily}
                disabled={!canClaimDaily()}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow transition-transform ${
                  canClaimDaily()
                    ? "animate-bounce-soft bg-gradient-to-r from-sunshine to-coral text-foreground hover:scale-105"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Gift className="h-4 w-4" />{" "}
                {canClaimDaily() ? "Daily Gift!" : "Come back tomorrow"}
              </button>
            </div>

            {/* badges */}
            {prog.badges.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center justify-center gap-1">
                {prog.badges.map((id) => {
                  const b = getBadge(id);
                  return b ? (
                    <span
                      key={id}
                      title={`${b.name} — ${b.desc}`}
                      className="rounded-full bg-secondary px-2 py-1 text-base"
                    >
                      {b.emoji}
                    </span>
                  ) : null;
                })}
              </div>
            )}

            <button
              onClick={startAdventure}
              className="mx-auto mt-5 flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-lg font-black text-primary-foreground shadow-xl transition-transform hover:scale-110 active:scale-95"
            >
              <Play className="h-6 w-6" /> Start Adventure!
            </button>
            <div className="mt-2 text-[10px] font-bold text-muted-foreground">
              Grown-ups: arrow keys + space also work · H = hands up
            </div>

            {dailyToast && (
              <div className="mt-3 rounded-2xl bg-jungle/15 px-3 py-2 text-sm font-black text-jungle">
                🎁 {dailyToast}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================= CALIBRATION ======================= */}
      {(phase === "calibrate" || phase === "tracking-ready") && (
        <div className="absolute inset-0 z-30 bg-background/45 backdrop-blur-sm">
          <div className="absolute left-1/2 top-[8%] -translate-x-1/2 text-center">
            <h2 className="text-2xl font-black text-foreground drop-shadow md:text-3xl">
              {phase === "tracking-ready" ? "Tracking Ready! ✅" : "Stand inside the box! 🧍"}
            </h2>
            {phase === "calibrate" && (
              <p className="mt-1 text-sm font-bold text-muted-foreground">
                Step back so I can see your whole body
                {calibrating && " — hold still…"}
              </p>
            )}
          </div>
          <div className="absolute bottom-[6%] left-1/2 w-full max-w-md -translate-x-1/2 px-4">
            <div className="rounded-3xl border-4 border-card bg-card/95 p-3 shadow-2xl">
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-black">
                <CalCheck ok={calCheck.seen} label="I see you" />
                <CalCheck ok={calCheck.full} label="Whole body" />
                <CalCheck ok={calCheck.inBox} label="In the box" />
              </div>
              {calibrating && (
                <div className="mt-2 flex items-center gap-2 text-xs font-black text-jungle">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-jungle/30 border-t-jungle" />
                  Reading your body outline…
                </div>
              )}
              {(poseStatus === "denied" || poseStatus === "error") && (
                <div className="mt-2 text-xs font-bold text-coral">
                  Camera not available — you can still play with the arrow keys!
                </div>
              )}
              <div className="mt-2 flex justify-center gap-2">
                <button
                  onClick={skipCamera}
                  className="rounded-full bg-secondary px-4 py-2 text-xs font-black text-secondary-foreground shadow"
                >
                  Play with keyboard instead
                </button>
                <button
                  onClick={goHome}
                  className="rounded-full bg-muted px-4 py-2 text-xs font-black text-muted-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= COUNTDOWN ======================= */}
      {phase === "countdown" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/25">
          <div key={countdownN} className="animate-pop text-center">
            <div className="text-[120px] font-black leading-none text-foreground drop-shadow-2xl md:text-[170px]">
              {countdownN > 0 ? countdownN : "GO!"}
            </div>
            <div className="text-xl font-black text-foreground/80">
              {wd.emoji} {wd.name}
            </div>
          </div>
        </div>
      )}

      {/* ======================= PAUSED ======================= */}
      {phase === "paused" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="mx-4 max-w-sm rounded-3xl border-4 border-card bg-card p-6 text-center shadow-2xl">
            <div className="text-5xl">⏸️</div>
            <h2 className="mt-2 text-2xl font-black text-foreground">Paused</h2>
            <div className="mt-4 flex flex-col items-center gap-2">
              <button
                onClick={togglePause}
                className="flex w-48 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-base font-black text-primary-foreground shadow-lg transition-transform hover:scale-105"
              >
                <Play className="h-5 w-5" /> Keep Playing
              </button>
              {camOn && (
                <button
                  onClick={() => {
                    sfx.click();
                    signalsRef.current.calibrated = false;
                    setPhase("calibrate");
                  }}
                  className="flex w-48 items-center justify-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-black text-secondary-foreground shadow"
                >
                  <RotateCw className="h-4 w-4" /> Re-calibrate
                </button>
              )}
              <button
                onClick={goHome}
                className="flex w-48 items-center justify-center gap-2 rounded-full bg-muted px-5 py-2.5 text-sm font-black text-muted-foreground"
              >
                <Home className="h-4 w-4" /> Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= LOST TRACKING ======================= */}
      {phase === "lost" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="mx-4 max-w-sm rounded-3xl border-4 border-card bg-card p-6 text-center shadow-2xl">
            <div className="animate-bounce-soft text-5xl">🔍🦕</div>
            <h2 className="mt-2 text-2xl font-black text-foreground">Where did you go?</h2>
            <p className="mt-1 text-sm font-bold text-muted-foreground">
              Step back in front of the camera and the game will continue!
            </p>
            <button
              onClick={goHome}
              className="mx-auto mt-4 flex items-center gap-2 rounded-full bg-muted px-5 py-2.5 text-sm font-black text-muted-foreground"
            >
              <Home className="h-4 w-4" /> Home
            </button>
          </div>
        </div>
      )}

      {/* ======================= LEVEL COMPLETE ======================= */}
      {phase === "complete" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center overflow-y-auto">
          <div className="mx-3 my-4 w-full max-w-md rounded-3xl border-4 border-card bg-card/95 p-6 text-center shadow-2xl backdrop-blur">
            <div className="text-5xl">🎉</div>
            <h2 className="mt-1 text-3xl font-black text-foreground">
              {finishedAll ? "Adventure Complete!" : "Level Complete!"}
            </h2>
            <div className="mt-1 text-sm font-bold text-muted-foreground">
              {wd.emoji} {wd.name} finished!
            </div>
            <div className="my-3 flex justify-center gap-1 text-4xl">
              {[1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={i <= result.levelStars ? "animate-pop" : "opacity-25 grayscale"}
                  style={{ animationDelay: `${i * 0.25}s` }}
                >
                  ⭐
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-secondary p-2.5">
                <div className="text-[10px] font-black uppercase text-muted-foreground">Score</div>
                <div className="text-xl font-black text-foreground">{result.score}</div>
              </div>
              <div className="rounded-2xl bg-secondary p-2.5">
                <div className="text-[10px] font-black uppercase text-muted-foreground">Eggs</div>
                <div className="text-xl font-black text-foreground">🥚 {result.eggs}</div>
              </div>
              <div className="rounded-2xl bg-secondary p-2.5">
                <div className="text-[10px] font-black uppercase text-muted-foreground">Stars</div>
                <div className="text-xl font-black text-foreground">⭐ {result.stars}</div>
              </div>
            </div>
            {newBadges.length > 0 && (
              <div className="mt-3 rounded-2xl bg-sunshine/20 p-3">
                <div className="text-xs font-black uppercase tracking-wider text-foreground">
                  New badges!
                </div>
                <div className="mt-1 flex flex-wrap justify-center gap-2">
                  {newBadges.map((b) => (
                    <span
                      key={b.id}
                      className="animate-pop rounded-full bg-card px-3 py-1 text-sm font-black shadow"
                    >
                      {b.emoji} {b.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-4 flex justify-center gap-2">
              {!finishedAll ? (
                <button
                  onClick={nextWorld}
                  className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-black text-primary-foreground shadow-lg transition-transform hover:scale-105"
                >
                  Next: {WORLDS[Math.min(WORLDS.length - 1, worldIdx + 1)].emoji}{" "}
                  {WORLDS[Math.min(WORLDS.length - 1, worldIdx + 1)].name}
                </button>
              ) : (
                <button
                  onClick={() => {
                    sfx.click();
                    setStartWorld(0);
                    resetRun(0, false);
                    setPhase(
                      camOn && signalsRef.current.calibrated
                        ? "countdown"
                        : camOn
                          ? "calibrate"
                          : "countdown",
                    );
                  }}
                  className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-black text-primary-foreground shadow-lg transition-transform hover:scale-105"
                >
                  <RotateCw className="h-5 w-5" /> Play Again
                </button>
              )}
              <button
                onClick={goHome}
                className="flex items-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-black text-secondary-foreground shadow"
              >
                <Home className="h-4 w-4" /> Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= GAME OVER ======================= */}
      {phase === "gameover" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="mx-4 max-w-md rounded-3xl border-4 border-card bg-card p-6 text-center shadow-2xl">
            <div className="text-5xl">🦕💫</div>
            <h2 className="mt-2 text-3xl font-black text-foreground">Good Try!</h2>
            <p className="mt-1 text-sm font-bold text-muted-foreground">
              You keep everything you collected — let's run again!
            </p>
            <div className="my-4 grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-secondary p-2.5">
                <div className="text-[10px] font-black uppercase text-muted-foreground">Score</div>
                <div className="text-xl font-black text-foreground">{result.score}</div>
              </div>
              <div className="rounded-2xl bg-secondary p-2.5">
                <div className="text-[10px] font-black uppercase text-muted-foreground">Eggs</div>
                <div className="text-xl font-black text-foreground">🥚 {result.eggs}</div>
              </div>
              <div className="rounded-2xl bg-secondary p-2.5">
                <div className="text-[10px] font-black uppercase text-muted-foreground">Stars</div>
                <div className="text-xl font-black text-foreground">⭐ {result.stars}</div>
              </div>
            </div>
            <div className="flex justify-center gap-2">
              <button
                onClick={retrySameWorld}
                className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-black text-primary-foreground shadow-lg transition-transform hover:scale-105"
              >
                <RotateCw className="h-5 w-5" /> Try Again
              </button>
              <button
                onClick={goHome}
                className="flex items-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-black text-secondary-foreground shadow"
              >
                <Home className="h-4 w-4" /> Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- small presentational helpers ----------

function CalCheck({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div
      className={`rounded-2xl px-2 py-2 transition-colors ${ok ? "bg-jungle/15 text-jungle" : "bg-muted text-muted-foreground"}`}
    >
      <div className="text-lg">{ok ? "✅" : "⬜"}</div>
      {label}
    </div>
  );
}

function MiniDino({ c, gray }: { c: DinoCharacter; gray?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={`h-12 w-12 ${gray ? "opacity-60 grayscale" : ""}`}>
      <ellipse
        cx="30"
        cy="40"
        rx="20"
        ry="15"
        fill={c.body}
        stroke="rgba(40,30,20,0.3)"
        strokeWidth="2"
      />
      <ellipse cx="34" cy="44" rx="11" ry="8" fill={c.belly} />
      <circle cx="44" cy="24" r="12" fill={c.body} stroke="rgba(40,30,20,0.3)" strokeWidth="2" />
      <ellipse cx="53" cy="28" rx="7" ry="5" fill={c.body} />
      <circle cx="47" cy="22" r="4" fill="#fff" />
      <circle cx="48.5" cy="22" r="2.2" fill="#2b2b2b" />
      <path d="M14 30 Q2 26 6 38 Q12 42 18 38 Z" fill={c.body} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${18 + i * 8} ${28 - i * 2} q4 -8 8 0 z`} fill={c.spikes} />
      ))}
    </svg>
  );
}

function getBadge(id: string): DinoBadge | undefined {
  return DINO_BADGES.find((b) => b.id === id);
}
