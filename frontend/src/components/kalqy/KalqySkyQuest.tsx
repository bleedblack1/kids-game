import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ArrowLeft, Home, Pause, Play, RotateCw, Star, Volume2, VolumeX } from "lucide-react";
import { DinoPoseControl, createPoseSignals, type PoseStatus } from "./DinoPoseControl";
import { audioInit, isMuted, say, setMuted, sfx, startMusic, stopMusic } from "@/lib/dino-audio";
import { logEvent } from "@/lib/analytics";

// KALQY Sky Quest — a full-body Three.js FLYING game.
//
// The child soars through the sky (MediaPipe PoseLandmarker via
// DinoPoseControl):
//   flap both arms up & down  → wing-beat, gain height
//   squat                     → dive down
//   step / lean left-right    → steer between sky lanes
//   raise one hand & point    → answer floating question gates
//
// Learning content follows the same KALQY / NCF-FS foundational bands as
// Kalqy 3D World: colours, shapes & animal sounds (3–4); letters, numbers
// & counting (4–5); rhymes, first sounds, addition & feelings (5–6).

interface KalqySkyQuestProps {
  onBack: () => void;
  onComplete?: (result: {
    stars: number;
    correct: number;
    total: number;
    coins: number;
    movements: Record<string, number>;
  }) => void;
}

type Phase = "menu" | "calibrate" | "countdown" | "playing" | "paused" | "complete";

// ---------------------------------------------------------------------------
// Learning content (same band progressions as Kalqy 3D World)
// ---------------------------------------------------------------------------

type Domain = "colours" | "shapes" | "listening" | "letters" | "numbers" | "phonics" | "feelings";

interface Panel {
  kind: "text" | "emoji" | "color" | "shape" | "count";
  value: string;
  color?: string;
  count?: number;
}

interface Question {
  domain: Domain;
  prompt: string;
  speak: string;
  options: Panel[];
  labels: string[];
  correct: number;
  praise: string;
  teach: string;
}

const DOMAIN_LABEL: Record<Domain, string> = {
  colours: "Colour Recognition",
  shapes: "Shape Recognition",
  listening: "Listening Skills",
  letters: "Letter Recognition",
  numbers: "Number Recognition",
  phonics: "Phonics & Rhymes",
  feelings: "Feelings (SEL)",
};

const rand = (n: number) => Math.floor(Math.random() * n);
const pick = <T,>(arr: T[]): T => arr[rand(arr.length)];
function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function optionsWith<T>(pool: T[], must: T, n = 3): { options: T[]; correct: number } {
  const rest = shuffled(pool.filter((x) => x !== must)).slice(0, n - 1);
  const options = shuffled([must, ...rest]);
  return { options, correct: options.indexOf(must) };
}

const COLORS = [
  { name: "RED", hex: "#ef4444" },
  { name: "BLUE", hex: "#3b82f6" },
  { name: "GREEN", hex: "#22c55e" },
  { name: "YELLOW", hex: "#eab308" },
  { name: "ORANGE", hex: "#f97316" },
  { name: "PURPLE", hex: "#a855f7" },
];
function qColour(n: number): Question {
  const pool = COLORS.slice(0, n);
  const target = pick(pool);
  const { options, correct } = optionsWith(pool, target);
  return {
    domain: "colours",
    prompt: `Fly to ${target.name}!`,
    speak: `Find the ${target.name.toLowerCase()} ring and fly through it!`,
    options: options.map((c) => ({ kind: "color", value: c.name, color: c.hex })),
    labels: options.map((c) => c.name.toLowerCase()),
    correct,
    praise: `Yes! That is ${target.name.toLowerCase()}!`,
    teach: `Almost! This one is ${target.name.toLowerCase()}. Next time!`,
  };
}

const SHAPES = ["CIRCLE", "SQUARE", "TRIANGLE"];
function qShape(): Question {
  const target = pick(SHAPES);
  const { options, correct } = optionsWith(SHAPES, target);
  return {
    domain: "shapes",
    prompt: `Find the ${target}!`,
    speak: `Which ring holds the ${target.toLowerCase()}? Fly through it!`,
    options: options.map((s) => ({ kind: "shape", value: s })),
    labels: options.map((s) => `the ${s.toLowerCase()}`),
    correct,
    praise: `Wonderful! You found the ${target.toLowerCase()}!`,
    teach: `Oops! A ${target.toLowerCase()} looks like this. You'll spot it next time!`,
  };
}

const ANIMALS = [
  { emoji: "🐮", name: "cow", sound: "Moo" },
  { emoji: "🐶", name: "dog", sound: "Woof" },
  { emoji: "🐱", name: "cat", sound: "Meow" },
  { emoji: "🦆", name: "duck", sound: "Quack" },
  { emoji: "🐸", name: "frog", sound: "Ribbit" },
];
function qAnimal(): Question {
  const target = pick(ANIMALS);
  const { options, correct } = optionsWith(ANIMALS, target);
  return {
    domain: "listening",
    prompt: `Who says "${target.sound}"?`,
    speak: `Listen! ${target.sound}! ${target.sound}! Which animal says ${target.sound}?`,
    options: options.map((a) => ({ kind: "emoji", value: a.emoji })),
    labels: options.map((a) => `the ${a.name}`),
    correct,
    praise: `Yes! The ${target.name} says ${target.sound}!`,
    teach: `That was the ${target.name}! The ${target.name} says ${target.sound}!`,
  };
}

const LETTERS = "ABCDEFGHKMNPRST".split("");
function qLetter(): Question {
  const target = pick(LETTERS);
  const { options, correct } = optionsWith(LETTERS, target);
  return {
    domain: "letters",
    prompt: `Find the letter ${target}!`,
    speak: `Find the letter ${target} in the sky and fly through its ring!`,
    options: options.map((l) => ({ kind: "text", value: l })),
    labels: options.map((l) => `the letter ${l}`),
    correct,
    praise: `Super! That is the letter ${target}!`,
    teach: `Almost! This is the letter ${target}. Say it with me: ${target}!`,
  };
}

function qNumber(max: number): Question {
  const nums = Array.from({ length: max }, (_, i) => String(i + 1));
  const target = pick(nums);
  const { options, correct } = optionsWith(nums, target);
  return {
    domain: "numbers",
    prompt: `Find the number ${target}!`,
    speak: `Find the number ${target} and fly through its ring!`,
    options: options.map((n) => ({ kind: "text", value: n })),
    labels: options.map((n) => `the number ${n}`),
    correct,
    praise: `Yes! That is the number ${target}!`,
    teach: `Nice try! This is ${target}. Let's count together next time!`,
  };
}

const COUNT_EMOJI = ["⭐", "🎈", "🐦", "☁️", "🍎"];
function qCount(max: number): Question {
  const target = 1 + rand(Math.min(max, 6));
  const emoji = pick(COUNT_EMOJI);
  const pool = [1, 2, 3, 4, 5, 6].filter((n) => n <= Math.max(3, max));
  const { options, correct } = optionsWith(pool, target);
  return {
    domain: "numbers",
    prompt: `Which cloud has ${target} ${emoji}?`,
    speak: `Count carefully! Find the cloud with ${target}!`,
    options: options.map((n) => ({ kind: "count", value: emoji, count: n })),
    labels: options.map((n) => `the cloud with ${n}`),
    correct,
    praise: `Great counting! One, two... ${target}!`,
    teach: `Let's count again together next time. We needed ${target}!`,
  };
}

const RHYMES = [
  { word: "CAT", match: { word: "HAT", emoji: "🎩" } },
  { word: "SUN", match: { word: "FUN", emoji: "🎉" } },
  { word: "BELL", match: { word: "WELL", emoji: "🪣" } },
  { word: "LOG", match: { word: "FROG", emoji: "🐸" } },
  { word: "PIN", match: { word: "TIN", emoji: "🥫" } },
];
const RHYME_DISTRACTORS = [
  { word: "TREE", emoji: "🌳" },
  { word: "FISH", emoji: "🐟" },
  { word: "BOOK", emoji: "📖" },
  { word: "STAR", emoji: "⭐" },
  { word: "BUS", emoji: "🚌" },
];
function qRhyme(): Question {
  const target = pick(RHYMES);
  const distractors = shuffled(RHYME_DISTRACTORS).slice(0, 2);
  const opts = shuffled([target.match, ...distractors]);
  const correct = opts.indexOf(target.match);
  return {
    domain: "phonics",
    prompt: `What rhymes with ${target.word}?`,
    speak: `${target.word}! Which word rhymes with ${target.word}?`,
    options: opts.map((o) => ({ kind: "emoji", value: `${o.emoji}\n${o.word}` })),
    labels: opts.map((o) => o.word.toLowerCase()),
    correct,
    praise: `Yes! ${target.word} and ${target.match.word} rhyme!`,
    teach: `${target.word} rhymes with ${target.match.word}! ${target.word}, ${target.match.word}!`,
  };
}

function qAddition(): Question {
  const a = 1 + rand(5);
  const b = 1 + rand(Math.min(5, 9 - a));
  const sum = a + b;
  const pool = Array.from({ length: 10 }, (_, i) => i + 1);
  const { options, correct } = optionsWith(pool, sum);
  return {
    domain: "numbers",
    prompt: `${a} + ${b} = ?`,
    speak: `Sky treasure! What is ${a} plus ${b}?`,
    options: options.map((n) => ({ kind: "text", value: String(n) })),
    labels: options.map((n) => `the number ${n}`),
    correct,
    praise: `Treasure found! ${a} plus ${b} is ${sum}!`,
    teach: `${a} plus ${b} makes ${sum}. Let's count it out next time!`,
  };
}

const FEELINGS = [
  { name: "HAPPY", emoji: "😊" },
  { name: "SAD", emoji: "😢" },
  { name: "ANGRY", emoji: "😠" },
  { name: "SCARED", emoji: "😨" },
  { name: "SLEEPY", emoji: "😴" },
  { name: "SURPRISED", emoji: "😲" },
];
function qFeeling(): Question {
  const target = pick(FEELINGS);
  const { options, correct } = optionsWith(FEELINGS, target);
  return {
    domain: "feelings",
    prompt: `Find the ${target.name} face!`,
    speak: `Feelings time! Can you find the ${target.name.toLowerCase()} face?`,
    options: options.map((f) => ({ kind: "emoji", value: f.emoji })),
    labels: options.map((f) => `the ${f.name.toLowerCase()} face`),
    correct,
    praise: `Yes! That face feels ${target.name.toLowerCase()}!`,
    teach: `This face is ${target.name.toLowerCase()}. Can you make one too?`,
  };
}

interface BandDef {
  id: string;
  label: string;
  age: string;
  emoji: string;
  blurb: string;
  domains: string[];
  make: () => Question;
}

const BANDS: BandDef[] = [
  {
    id: "band1",
    label: "Preschool",
    age: "Age 3–4",
    emoji: "🐣",
    blurb: "Colours, shapes & animal sounds up in the clouds!",
    domains: ["Colours", "Shapes", "Animal sounds"],
    make: () => pick([() => qColour(4), qShape, qAnimal])(),
  },
  {
    id: "band2",
    label: "LKG",
    age: "Age 4–5",
    emoji: "🦊",
    blurb: "Letters, numbers & counting — fly and find!",
    domains: ["Letters", "Numbers 1–10", "Counting"],
    make: () => pick([qLetter, () => qNumber(10), () => qCount(5), () => qColour(6)])(),
  },
  {
    id: "band3",
    label: "UKG",
    age: "Age 5–6",
    emoji: "🦉",
    blurb: "Rhymes, adding & feelings — the high-flyer trail!",
    domains: ["Rhymes", "Addition to 10", "Feelings"],
    make: () => pick([qRhyme, qAddition, () => qCount(6), qFeeling])(),
  },
];

// ---------------------------------------------------------------------------
// Three.js sky world
// ---------------------------------------------------------------------------

const LANE_X = [-3, 0, 3];
const FLY_SPEED = 5.5;
// The flight path WEAVES through the sky — a smooth S-curve, not a straight
// line. Everything on the course is laid out along this curve, and the world
// shifts sideways under the flyer as they travel it.
const pathX = (d: number) => 5.5 * Math.sin(d * 0.045) + 2.5 * Math.sin(d * 0.021 + 1.7);
const GATE_COUNT = 8;
const GATE_SPACING = 30;
const FIRST_GATE = 34;
const COURSE_END = FIRST_GATE + GATE_COUNT * GATE_SPACING + 26;
const ALT_MIN = 1.4;
const ALT_MAX = 7.5;
const FLAP_IMPULSE = 3.4;
const SKY_GRAVITY = 2.4;

function makePanelTexture(panel: Panel): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(128, 128, 118, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = "#38bdf8";
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#1f2937";

  if (panel.kind === "text") {
    ctx.font = "900 130px 'Comic Sans MS', 'Arial Rounded MT Bold', sans-serif";
    ctx.fillText(panel.value, 128, 136);
  } else if (panel.kind === "emoji") {
    const [emoji, word] = panel.value.split("\n");
    if (word) {
      ctx.font = "95px sans-serif";
      ctx.fillText(emoji, 128, 100);
      ctx.font = "900 40px 'Comic Sans MS', sans-serif";
      ctx.fillText(word, 128, 188);
    } else {
      ctx.font = "130px sans-serif";
      ctx.fillText(emoji, 128, 136);
    }
  } else if (panel.kind === "color") {
    ctx.fillStyle = panel.color ?? "#888";
    ctx.beginPath();
    ctx.arc(128, 128, 74, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = "rgba(0,0,0,0.15)";
    ctx.stroke();
  } else if (panel.kind === "shape") {
    ctx.fillStyle = "#6366f1";
    ctx.beginPath();
    if (panel.value === "CIRCLE") ctx.arc(128, 128, 72, 0, Math.PI * 2);
    else if (panel.value === "SQUARE") ctx.rect(60, 60, 136, 136);
    else {
      ctx.moveTo(128, 52);
      ctx.lineTo(202, 194);
      ctx.lineTo(54, 194);
      ctx.closePath();
    }
    ctx.fill();
  } else if (panel.kind === "count") {
    const n = panel.count ?? 1;
    ctx.font = n <= 3 ? "68px sans-serif" : "52px sans-serif";
    const cols = n <= 3 ? n : Math.ceil(n / 2);
    const rows = n <= 3 ? 1 : 2;
    for (let r = 0, i = 0; r < rows; r++) {
      const inRow = r === rows - 1 ? n - cols * (rows - 1) : cols;
      for (let k = 0; k < inRow; k++, i++) {
        const x = 128 + (k - (inRow - 1) / 2) * (n <= 3 ? 66 : 56);
        const y = rows === 1 ? 134 : 96 + r * 74;
        ctx.fillText(panel.value, x, y);
      }
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeBannerTexture(text: string): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 160;
  const ctx = c.getContext("2d")!;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 80px 'Comic Sans MS', sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = 10;
  ctx.strokeText(text, 256, 80);
  ctx.fillText(text, 256, 80);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Kalqy the fox with rainbow glider wings.
interface FlyerRig {
  group: THREE.Group;
  body: THREE.Group;
  wingL: THREE.Group;
  wingR: THREE.Group;
  tail: THREE.Group;
  legL: THREE.Mesh;
  legR: THREE.Mesh;
  scarf: THREE.Mesh;
}
function buildFlyer(): FlyerRig {
  const orange = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.7 });
  const cream = new THREE.MeshStandardMaterial({ color: 0xfff7ed, roughness: 0.8 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x3f2d20, roughness: 0.6 });
  const scarfMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.7 });
  const wingColors = [0xef4444, 0xf59e0b, 0x22c55e, 0x3b82f6, 0xa855f7];

  const group = new THREE.Group();
  const body = new THREE.Group();
  group.add(body);

  // superman-style flying pose: torso pitched toward horizontal
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.4, 0.6, 6, 14), orange);
  torso.rotation.x = Math.PI / 2 - 0.35;
  torso.position.set(0, 0, 0);
  body.add(torso);
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 12), cream);
  belly.position.set(0, -0.22, 0.1);
  belly.scale.set(1, 0.7, 1.2);
  body.add(belly);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 14), orange);
  head.position.set(0, 0.22, -0.62);
  body.add(head);
  const snout = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 10), cream);
  snout.position.set(0, 0.14, -0.9);
  body.add(snout);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), dark);
  nose.position.set(0, 0.16, -1.0);
  body.add(nose);
  for (const s of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 8), orange);
    ear.position.set(0.18 * s, 0.52, -0.6);
    ear.rotation.z = -0.22 * s;
    body.add(ear);
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), dark);
    eye.position.set(0.13 * s, 0.3, -0.88);
    body.add(eye);
  }
  // goggles band — a little aviator!
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.035, 8, 18), dark);
  band.position.set(0, 0.34, -0.6);
  band.rotation.x = Math.PI / 2 - 0.2;
  body.add(band);

  // flowing scarf
  const scarfGeo = new THREE.CapsuleGeometry(0.07, 0.5, 4, 8);
  scarfGeo.translate(0, -0.3, 0);
  const scarf = new THREE.Mesh(scarfGeo, scarfMat);
  scarf.position.set(0.1, 0.1, -0.35);
  scarf.rotation.x = -1.2;
  body.add(scarf);

  // rainbow feather wings — each wing pivots at the shoulder
  const mkWing = (side: 1 | -1) => {
    const wing = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const feather = new THREE.Mesh(
        new THREE.BoxGeometry(0.85 - i * 0.06, 0.05, 0.34),
        new THREE.MeshStandardMaterial({ color: wingColors[i], roughness: 0.6 }),
      );
      feather.position.set(side * (0.45 + i * 0.33), i * 0.02, 0.12 * i - 0.1);
      feather.rotation.y = side * i * 0.16;
      wing.add(feather);
    }
    wing.position.set(side * 0.32, 0.12, -0.15);
    return wing;
  };
  const wingL = mkWing(-1);
  const wingR = mkWing(1);
  body.add(wingL, wingR);

  // trailing legs + fluffy tail
  const legGeo = new THREE.CapsuleGeometry(0.1, 0.3, 4, 8);
  legGeo.translate(0, -0.2, 0);
  const legL = new THREE.Mesh(legGeo, orange);
  legL.position.set(-0.16, -0.1, 0.5);
  legL.rotation.x = 1.35;
  const legR = new THREE.Mesh(legGeo, orange);
  legR.position.set(0.16, -0.1, 0.5);
  legR.rotation.x = 1.35;
  body.add(legL, legR);

  const tail = new THREE.Group();
  const tailCone = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.6, 8), orange);
  tailCone.rotation.x = -Math.PI / 2;
  tailCone.position.z = 0.3;
  tail.add(tailCone);
  const tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), cream);
  tailTip.position.z = 0.6;
  tail.add(tailTip);
  tail.position.set(0, 0.05, 0.6);
  body.add(tail);

  return { group, body, wingL, wingR, tail, legL, legR, scarf };
}

interface GateEntity {
  d: number;
  group: THREE.Group;
  panels: THREE.Mesh[];
  q: Question;
  asked: boolean;
  resolved: boolean;
}
interface StormEntity {
  d: number;
  lane: number;
  alt: number;
  group: THREE.Group;
  resolved: boolean;
}
interface StarEntity {
  d: number;
  lane: number;
  alt: number;
  mesh: THREE.Object3D;
  taken: boolean;
}
interface ConfettiBurst {
  points: THREE.Points;
  vel: Float32Array;
  life: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function KalqySkyQuest({ onBack, onComplete }: KalqySkyQuestProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<Phase>("menu");
  const phaseRef = useRef<Phase>("menu");
  const setPhaseBoth = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  const [band, setBand] = useState<BandDef>(BANDS[0]);
  const bandRef = useRef<BandDef>(BANDS[0]);

  const signalsRef = useRef(createPoseSignals());
  const [poseStatus, setPoseStatus] = useState<PoseStatus>("idle");
  const [calibrating, setCalibrating] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [muted, setMutedState] = useState(isMuted());

  const [question, setQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [hud, setHud] = useState({ stars: 0, coins: 0, progress: 0 });
  const [lostBody, setLostBody] = useState(false);

  interface RunStats {
    correct: number;
    total: number;
    coins: number;
    flaps: number;
    dives: number;
    steers: number;
    bumps: number;
    byDomain: Record<string, { correct: number; total: number }>;
  }
  const emptyStats = (): RunStats => ({
    correct: 0,
    total: 0,
    coins: 0,
    flaps: 0,
    dives: 0,
    steers: 0,
    bumps: 0,
    byDomain: {},
  });
  const statsRef = useRef<RunStats>(emptyStats());
  const [finalStats, setFinalStats] = useState<RunStats | null>(null);
  const completedRef = useRef(false);

  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    course: THREE.Group;
    flyer: FlyerRig;
    sunRays: THREE.Group;
    clouds: { mesh: THREE.Group; drift: number }[];
    earth: THREE.Group;
    earthTex: THREE.CanvasTexture;
    earthItems: { obj: THREE.Object3D; span: number }[];
    critters: THREE.Group[];
    birds: THREE.Group[];
    gates: GateEntity[];
    storms: StormEntity[];
    stars: StarEntity[];
    confetti: ConfettiBurst[];
    finishD: number;
  } | null>(null);

  const runRef = useRef({
    traveled: 0,
    lane: 1,
    alt: 3.2, // flying altitude
    vAlt: 0,
    curSpeed: 0,
    slowUntil: 0,
    rollUntil: 0, // barrel-roll celebration
    clock: 0,
    handsUpPrev: false,
    lastJumpCount: 0,
    flapAnim: 0, // extra wing-beat energy right after a flap
    diving: false,
  });

  const keysRef = useRef({ up: false, down: false, lane: 1 });
  const kbModeRef = useRef(false);
  const poseStatusRef = useRef<PoseStatus>("idle");
  useEffect(() => {
    poseStatusRef.current = poseStatus;
  }, [poseStatus]);
  const lostBodyRef = useRef(false);

  // ---------------------------------------------------------------- scene --
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x7dd3fc);
    scene.fog = new THREE.Fog(0x7dd3fc, 45, 130);

    const camera = new THREE.PerspectiveCamera(
      58,
      mount.clientWidth / mount.clientHeight,
      0.1,
      260,
    );
    camera.position.set(0, 4.4, 9);
    camera.lookAt(0, 3.2, -16);

    scene.add(new THREE.HemisphereLight(0xfff9e8, 0xbae6fd, 1.15));
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.3);
    sunLight.position.set(8, 14, 6);
    scene.add(sunLight);

    // big smiling sun with spinning rays
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(2.6, 18, 16),
      new THREE.MeshBasicMaterial({ color: 0xffd23f }),
    );
    sun.position.set(-16, 16, -70);
    scene.add(sun);
    const sunRays = new THREE.Group();
    const rayMat = new THREE.MeshBasicMaterial({ color: 0xffe27a });
    for (let i = 0; i < 8; i++) {
      const ray = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.8, 4), rayMat);
      const a = (i / 8) * Math.PI * 2;
      ray.position.set(Math.cos(a) * 3.8, Math.sin(a) * 3.8, 0);
      ray.rotation.z = a - Math.PI / 2;
      sunRays.add(ray);
    }
    sunRays.position.copy(sun.position);
    scene.add(sunRays);

    // ------------------------------------------------------------ the earth
    // Everything below lives in one group that shifts sideways with the
    // S-curve path, so the countryside slides beneath the flyer like real
    // ground seen from a low flight.
    const earth = new THREE.Group();
    scene.add(earth);

    // patchwork farmland with a winding river, painted into the ground texture
    const gc = document.createElement("canvas");
    gc.width = 512;
    gc.height = 512;
    const g2 = gc.getContext("2d")!;
    g2.fillStyle = "#79c25e";
    g2.fillRect(0, 0, 512, 512);
    const patchColors = ["#8fd977", "#6db452", "#b6d957", "#e5cf6b", "#a3d977"];
    for (let i = 0; i < 26; i++) {
      g2.fillStyle = patchColors[rand(patchColors.length)];
      g2.fillRect(rand(512), rand(512), 50 + rand(90), 40 + rand(70));
    }
    // hedgerows between fields
    g2.strokeStyle = "rgba(60,110,50,0.5)";
    g2.lineWidth = 3;
    for (let i = 0; i < 12; i++) {
      g2.beginPath();
      if (i % 2) {
        g2.moveTo(0, rand(512));
        g2.lineTo(512, rand(512));
      } else {
        g2.moveTo(rand(512), 0);
        g2.lineTo(rand(512), 512);
      }
      g2.stroke();
    }
    // winding river (drawn vertically so it flows along the flight direction)
    g2.strokeStyle = "#3fa9f5";
    g2.lineWidth = 34;
    g2.lineCap = "round";
    g2.beginPath();
    g2.moveTo(150, -20);
    g2.bezierCurveTo(210, 128, 90, 256, 165, 384);
    g2.bezierCurveTo(205, 460, 140, 500, 150, 532);
    g2.stroke();
    g2.strokeStyle = "#7cc8f8";
    g2.lineWidth = 20;
    g2.stroke();
    const earthTex = new THREE.CanvasTexture(gc);
    earthTex.colorSpace = THREE.SRGBColorSpace;
    earthTex.wrapS = THREE.RepeatWrapping;
    earthTex.wrapT = THREE.RepeatWrapping;
    earthTex.repeat.set(2, 10);
    const groundPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(160, 340),
      new THREE.MeshStandardMaterial({ map: earthTex, roughness: 1 }),
    );
    groundPlane.rotation.x = -Math.PI / 2;
    groundPlane.position.set(0, 0, -110);
    earth.add(groundPlane);

    // mountain range on the horizon
    const mtnMat = new THREE.MeshStandardMaterial({ color: 0x7c8fa6, roughness: 1 });
    const snowMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9 });
    for (let i = 0; i < 7; i++) {
      const h = 10 + Math.random() * 9;
      const mtn = new THREE.Mesh(new THREE.ConeGeometry(7 + Math.random() * 5, h, 6), mtnMat);
      const side = i % 2 === 0 ? -1 : 1;
      mtn.position.set(side * (24 + Math.random() * 34), h / 2, -105 - Math.random() * 15);
      earth.add(mtn);
      const cap = new THREE.Mesh(new THREE.ConeGeometry(2.4, h * 0.28, 6), snowMat);
      cap.position.set(mtn.position.x, h - h * 0.14, mtn.position.z);
      earth.add(cap);
    }

    // streaming ground scenery: houses, forests, a palace, grazing animals
    const earthItems: { obj: THREE.Object3D; span: number }[] = [];
    const critters: THREE.Group[] = [];
    const addItem = (obj: THREE.Object3D, x: number, z: number, span = 160) => {
      obj.position.x = x;
      obj.position.z = z;
      earth.add(obj);
      earthItems.push({ obj, span });
    };

    const mkHouse = () => {
      const house = new THREE.Group();
      const wallColors = [0xfff1d6, 0xffe0e0, 0xe0ecff, 0xfdf3c7];
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 1, 1.2),
        new THREE.MeshStandardMaterial({ color: wallColors[rand(wallColors.length)] }),
      );
      wall.position.y = 0.5;
      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(1.25, 0.8, 4),
        new THREE.MeshStandardMaterial({ color: 0xc2542e, roughness: 0.9 }),
      );
      roof.position.y = 1.4;
      roof.rotation.y = Math.PI / 4;
      const door = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.5, 0.06),
        new THREE.MeshStandardMaterial({ color: 0x6b4423 }),
      );
      door.position.set(0, 0.25, 0.62);
      house.add(wall, roof, door);
      return house;
    };
    for (let i = 0; i < 8; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      addItem(mkHouse(), side * (7 + Math.random() * 14), -i * 20 - Math.random() * 10);
    }

    const mkTreeCluster = () => {
      const cluster = new THREE.Group();
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8a6134 });
      const leafColors = [0x2f9e44, 0x37b24d, 0x2b8a3e];
      const n = 3 + rand(3);
      for (let k = 0; k < n; k++) {
        const s = 0.7 + Math.random() * 0.7;
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.7, 6), trunkMat);
        const leaves = new THREE.Mesh(
          new THREE.ConeGeometry(0.7 * s, 1.6 * s, 7),
          new THREE.MeshStandardMaterial({ color: leafColors[rand(leafColors.length)] }),
        );
        const ox = (Math.random() - 0.5) * 3.4;
        const oz = (Math.random() - 0.5) * 3.4;
        trunk.position.set(ox, 0.35, oz);
        leaves.position.set(ox, 0.9 + 0.8 * s, oz);
        cluster.add(trunk, leaves);
      }
      return cluster;
    };
    for (let i = 0; i < 7; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      addItem(mkTreeCluster(), side * (10 + Math.random() * 16), -i * 24 - Math.random() * 12);
    }

    // a grand palace with towers and flags
    const mkPalace = () => {
      const palace = new THREE.Group();
      const stone = new THREE.MeshStandardMaterial({ color: 0xf2e3c6, roughness: 0.9 });
      const roofMat = new THREE.MeshStandardMaterial({ color: 0x9b5de5, roughness: 0.7 });
      const keep = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.8, 2), stone);
      keep.position.y = 0.9;
      palace.add(keep);
      for (const [tx, tz] of [
        [-1.9, -1.1],
        [1.9, -1.1],
        [-1.9, 1.1],
        [1.9, 1.1],
      ]) {
        const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.55, 2.8, 8), stone);
        tower.position.set(tx, 1.4, tz);
        palace.add(tower);
        const cap = new THREE.Mesh(new THREE.ConeGeometry(0.65, 0.9, 8), roofMat);
        cap.position.set(tx, 3.2, tz);
        palace.add(cap);
      }
      const centerTower = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.65, 3.6, 8), stone);
      centerTower.position.y = 1.8;
      palace.add(centerTower);
      const centerCap = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.1, 8), roofMat);
      centerCap.position.y = 4.1;
      palace.add(centerCap);
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 0.9, 5),
        new THREE.MeshStandardMaterial({ color: 0x8b7355 }),
      );
      pole.position.y = 5.05;
      palace.add(pole);
      const flag = new THREE.Mesh(
        new THREE.PlaneGeometry(0.55, 0.32),
        new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide }),
      );
      flag.position.set(0.3, 5.25, 0);
      palace.add(flag);
      const gate = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 0.1, 12, 1, false, 0, Math.PI),
        new THREE.MeshStandardMaterial({ color: 0x6b4423 }),
      );
      gate.rotation.set(Math.PI / 2, 0, Math.PI / 2);
      gate.position.set(0, 0.5, 1.06);
      palace.add(gate);
      return palace;
    };
    addItem(mkPalace(), 14, -60, 170);
    addItem(mkPalace(), -16, -145, 170);

    // grazing sheep and cows
    const mkCritter = (kind: "sheep" | "cow") => {
      const critter = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({
        color: kind === "sheep" ? 0xfafafa : 0xffffff,
        roughness: 1,
      });
      const darkMat = new THREE.MeshStandardMaterial({
        color: kind === "sheep" ? 0x44403c : 0x3f2d20,
        roughness: 0.9,
      });
      const bodyMesh = new THREE.Mesh(new THREE.SphereGeometry(0.36, 10, 8), bodyMat);
      bodyMesh.position.y = 0.42;
      bodyMesh.scale.set(1.25, 0.9, 0.9);
      critter.add(bodyMesh);
      if (kind === "cow") {
        for (let s = 0; s < 3; s++) {
          const spot = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), darkMat);
          spot.position.set((Math.random() - 0.5) * 0.6, 0.5 + (Math.random() - 0.5) * 0.2, 0.3);
          critter.add(spot);
        }
      }
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), darkMat);
      head.position.set(0.48, 0.42, 0);
      critter.add(head);
      for (const [lx, lz] of [
        [-0.2, -0.15],
        [-0.2, 0.15],
        [0.25, -0.15],
        [0.25, 0.15],
      ]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3, 5), darkMat);
        leg.position.set(lx, 0.15, lz);
        critter.add(leg);
      }
      critter.rotation.y = Math.random() * Math.PI * 2;
      return critter;
    };
    for (let i = 0; i < 10; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const critter = mkCritter(i % 3 === 0 ? "cow" : "sheep");
      addItem(critter, side * (5 + Math.random() * 12), -i * 16 - Math.random() * 8);
      critters.push(critter);
    }

    // course group slides toward the player
    const course = new THREE.Group();
    scene.add(course);

    // puffy cloud field (recycled along z)
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 });
    const clouds: { mesh: THREE.Group; drift: number }[] = [];
    for (let i = 0; i < 24; i++) {
      const cl = new THREE.Group();
      for (let k = 0; k < 3; k++) {
        const puff = new THREE.Mesh(
          new THREE.SphereGeometry(0.8 + Math.random() * 0.9, 10, 8),
          cloudMat,
        );
        puff.position.set(k * 1.3 - 1.3, Math.random() * 0.4, 0);
        cl.add(puff);
      }
      const side = i % 2 === 0 ? -1 : 1;
      cl.position.set(
        side * (7 + Math.random() * 16),
        1 + Math.random() * 9,
        -Math.random() * 140 + 5,
      );
      scene.add(cl);
      clouds.push({ mesh: cl, drift: 0.2 + Math.random() * 0.4 });
    }

    // little birds flying across
    const birdMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 });
    const birds: THREE.Group[] = [];
    for (let i = 0; i < 4; i++) {
      const bird = new THREE.Group();
      for (const s of [-1, 1]) {
        const w = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.16), birdMat);
        w.position.x = 0.28 * s;
        w.rotation.z = 0.4 * s;
        bird.add(w);
      }
      bird.position.set(-30 - Math.random() * 20, 4 + Math.random() * 5, -30 - Math.random() * 50);
      scene.add(bird);
      birds.push(bird);
    }

    const flyer = buildFlyer();
    flyer.group.position.set(0, 3.2, 0);
    scene.add(flyer.group);

    threeRef.current = {
      renderer,
      scene,
      camera,
      course,
      flyer,
      sunRays,
      clouds,
      earth,
      earthTex,
      earthItems,
      critters,
      birds,
      gates: [],
      storms: [],
      stars: [],
      confetti: [],
      finishD: COURSE_END,
    };

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    renderer.setAnimationLoop(() => {
      try {
        tick();
      } catch (err) {
        console.error("KalqySkyQuest tick error", err);
      }
    });

    return () => {
      window.removeEventListener("resize", onResize);
      renderer.setAnimationLoop(null);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      threeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------------------------------ course gen --
  const buildCourse = useCallback(() => {
    const t = threeRef.current;
    if (!t) return;
    for (const g of t.gates) t.course.remove(g.group);
    for (const s of t.storms) t.course.remove(s.group);
    for (const s of t.stars) t.course.remove(s.mesh);
    for (const cf of t.confetti) t.scene.remove(cf.points);
    t.gates = [];
    t.storms = [];
    t.stars = [];
    t.confetti = [];
    t.course.position.z = 0;

    const starMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.3,
      metalness: 0.4,
      emissive: 0x8a6100,
    });
    const starGeo = new THREE.OctahedronGeometry(0.32);

    const addStars = (d: number, lane: number, alt: number) => {
      for (let k = 0; k < 3; k++) {
        const dk = d + k * 2;
        const mesh = new THREE.Mesh(starGeo, starMat);
        // stars follow the winding path so they trace the curve ahead
        mesh.position.set(LANE_X[lane] + pathX(dk), alt + Math.sin(k * 1.5) * 0.4, -dk);
        t.course.add(mesh);
        t.stars.push({ d: dk, lane, alt, mesh, taken: false });
      }
    };

    const addStorm = (d: number, lane: number, alt: number) => {
      const group = new THREE.Group();
      const stormMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 1 });
      for (let k = 0; k < 3; k++) {
        const puff = new THREE.Mesh(
          new THREE.SphereGeometry(0.7 + (k % 2) * 0.35, 10, 8),
          stormMat,
        );
        puff.position.set(k * 0.9 - 0.9, (k % 2) * 0.25, 0);
        group.add(puff);
      }
      // little lightning bolt
      const bolt = new THREE.Mesh(
        new THREE.ConeGeometry(0.16, 0.8, 4),
        new THREE.MeshBasicMaterial({ color: 0xfde047 }),
      );
      bolt.position.set(0, -0.9, 0);
      bolt.rotation.x = Math.PI;
      group.add(bolt);
      group.position.set(LANE_X[lane] + pathX(d), alt, -d);
      t.course.add(group);
      t.storms.push({ d, lane, alt, group, resolved: false });
    };

    const addGate = (d: number, q: Question) => {
      const group = new THREE.Group();
      const panels: THREE.Mesh[] = [];
      for (let lane = 0; lane < 3; lane++) {
        // each answer floats inside a cloud ring
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(1.25, 0.22, 10, 24),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 }),
        );
        ring.position.set(LANE_X[lane] * 1.15, 3.4, 0);
        group.add(ring);
        const panel = new THREE.Mesh(
          new THREE.PlaneGeometry(2.0, 2.0),
          new THREE.MeshBasicMaterial({
            map: makePanelTexture(q.options[lane]),
            transparent: true,
          }),
        );
        panel.position.set(LANE_X[lane] * 1.15, 3.4, 0.05);
        group.add(panel);
        panels.push(panel);
      }
      group.position.set(pathX(d), 0, -d);
      t.course.add(group);
      t.gates.push({ d, group, panels, q, asked: false, resolved: false });
    };

    // rainbow finish arch
    const finish = new THREE.Group();
    const rainbowColors = [0xef4444, 0xf59e0b, 0xfde047, 0x22c55e, 0x3b82f6, 0xa855f7];
    rainbowColors.forEach((col, i) => {
      const arc = new THREE.Mesh(
        new THREE.TorusGeometry(6 + i * 0.42, 0.2, 8, 30, Math.PI),
        new THREE.MeshStandardMaterial({ color: col, roughness: 0.7 }),
      );
      arc.position.y = 0.5;
      finish.add(arc);
    });
    const banner = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 1.8),
      new THREE.MeshBasicMaterial({ map: makeBannerTexture("🏁 FINISH 🏁"), transparent: true }),
    );
    banner.position.y = 3.6;
    finish.add(banner);
    finish.position.set(pathX(COURSE_END), 0, -COURSE_END);
    t.course.add(finish);
    t.finishD = COURSE_END;

    for (let i = 0; i < GATE_COUNT; i++) {
      const gd = FIRST_GATE + i * GATE_SPACING;
      addStars(gd - 22, rand(3), 2 + rand(4));
      addStorm(gd - 12, rand(3), 2.2 + rand(3));
      addGate(gd, bandRef.current.make());
    }
    addStars(COURSE_END - 12, 1, 3.2);
  }, []);

  // -------------------------------------------------------------- gameplay --
  const finishRun = useCallback(() => {
    const s = statsRef.current;
    stopMusic();
    sfx.fanfare();
    say("Hooray! You flew all the way! Put both hands up in the air!", { interrupt: true });
    setQuestion(null);
    setFeedback(null);
    setFinalStats({ ...s, byDomain: { ...s.byDomain } });
    setPhaseBoth("complete");
    logEvent({ game: "sky-quest", type: "session-end" });
    if (!completedRef.current) {
      completedRef.current = true;
      const stars = Math.max(1, Math.round((s.correct / Math.max(1, s.total)) * 5));
      onComplete?.({
        stars,
        correct: s.correct,
        total: s.total,
        coins: s.coins,
        movements: { Jump: s.flaps, Squat: s.dives, Walk: s.steers },
      });
    }
  }, [onComplete, setPhaseBoth]);

  const spawnConfetti = useCallback((x: number, y: number, z: number) => {
    const t = threeRef.current;
    if (!t) return;
    const N = 90;
    const pos = new Float32Array(N * 3);
    const vel = new Float32Array(N * 3);
    const colors = new Float32Array(N * 3);
    const palette = [0xef4444, 0x3b82f6, 0x22c55e, 0xeab308, 0xec4899, 0xa855f7];
    for (let i = 0; i < N; i++) {
      pos[i * 3] = x + (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      vel[i * 3] = (Math.random() - 0.5) * 6;
      vel[i * 3 + 1] = 3 + Math.random() * 5;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 6;
      const c = new THREE.Color(palette[rand(palette.length)]);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const points = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ size: 0.16, vertexColors: true }),
    );
    t.scene.add(points);
    t.confetti.push({ points, vel, life: 1.4 });
  }, []);

  const resolveGate = useCallback(
    (gate: GateEntity, lane: number) => {
      gate.resolved = true;
      const s = statsRef.current;
      const q = gate.q;
      s.total++;
      const dom = (s.byDomain[q.domain] ??= { correct: 0, total: 0 });
      dom.total++;
      const ok = lane === q.correct;
      if (ok) {
        s.correct++;
        dom.correct++;
        sfx.star();
        say(q.praise, { interrupt: true });
        spawnConfetti(LANE_X[lane], runRef.current.alt + 1, 0.5);
        setFeedback({ ok: true, text: q.praise });
        runRef.current.rollUntil = runRef.current.clock + 0.9; // barrel roll!
      } else {
        sfx.mud();
        const wrongMsg = `You chose ${q.labels[lane]}. ${q.teach}`;
        say(wrongMsg, { interrupt: true });
        setFeedback({ ok: false, text: wrongMsg });
      }
      logEvent({
        game: "sky-quest",
        type: ok ? "correct" : "wrong",
        skill: q.domain === "numbers" ? "numeracy" : "vocabulary",
        label: `${q.domain}: ${q.prompt}`,
      });
      setHud((h) => ({ ...h, stars: s.correct }));
      runRef.current.slowUntil = runRef.current.clock + 1.9;
      window.setTimeout(() => setFeedback(null), 2100);
      setQuestion(null);
    },
    [spawnConfetti],
  );

  // ------------------------------------------------------------------ tick --
  const lastTsRef = useRef(0);
  const tick = useCallback(() => {
    const t = threeRef.current;
    if (!t) return;
    const now = performance.now();
    const dt = Math.min(0.05, (now - lastTsRef.current) / 1000 || 0.016);
    lastTsRef.current = now;
    const r = runRef.current;
    r.clock += dt;

    const playing = phaseRef.current === "playing";
    const sig = signalsRef.current;

    // ambient: sun rays spin, clouds drift, birds cross, islands bob
    t.sunRays.rotation.z += dt * 0.25;
    for (const cl of t.clouds) {
      cl.mesh.position.x += dt * cl.drift * 0.4;
      if (cl.mesh.position.x > 30) cl.mesh.position.x = -30;
    }
    for (const bird of t.birds) {
      bird.position.x += dt * 4;
      bird.children.forEach((w, i) => {
        w.rotation.z =
          (i === 0 ? 1 : -1) * (0.4 + Math.sin(r.clock * 14) * 0.45) * (i === 0 ? -1 : 1);
      });
      if (bird.position.x > 40) {
        bird.position.set(-40, 3 + Math.random() * 6, -20 - Math.random() * 60);
      }
    }
    // grazing animals nibble and hop about
    t.critters.forEach((c, i) => {
      c.position.y = Math.max(0, Math.sin(r.clock * 2 + i * 1.7)) * 0.06;
      c.rotation.y += Math.sin(r.clock * 0.5 + i) * dt * 0.15;
    });

    if (playing) {
      const useBody = !kbModeRef.current && sig.calibrated;
      const bodyLost = useBody && poseStatusRef.current === "ready" && !sig.present;
      if (bodyLost !== lostBodyRef.current) {
        lostBodyRef.current = bodyLost;
        setLostBody(bodyLost);
      }

      if (!bodyLost) {
        const keys = keysRef.current;
        const nextGate = t.gates.find((g) => !g.resolved);

        // ---- steering (body lean / arrows) ----
        const targetLane = useBody ? 1 + sig.lean : keys.lane;
        if (targetLane !== r.lane) {
          r.lane = targetLane;
          statsRef.current.steers++;
        }
        keys.lane = r.lane;

        // While a gate is near, pulse the ring the child is lined up with so
        // they can see which answer they are about to fly through.
        if (nextGate && nextGate.asked && nextGate.d - r.traveled < 20) {
          nextGate.panels.forEach((p, i) => {
            const target = i === r.lane ? 1.18 + Math.sin(r.clock * 9) * 0.05 : 1;
            p.scale.setScalar(p.scale.x + (target - p.scale.x) * Math.min(1, dt * 10));
          });
        }

        // ---- flapping: both hands up = one wing-beat (or real-life jump) ----
        const handsUpNow = useBody && sig.handsUp;
        const jumped = useBody && sig.jumpCount !== r.lastJumpCount;
        r.lastJumpCount = sig.jumpCount;
        const wantsFlap = (handsUpNow && !r.handsUpPrev) || jumped || keys.up;
        r.handsUpPrev = handsUpNow;
        keys.up = false;
        if (wantsFlap) {
          r.vAlt = FLAP_IMPULSE;
          r.flapAnim = 1;
          statsRef.current.flaps++;
          sfx.jump();
          logEvent({ game: "sky-quest", type: "movement", skill: "balance", value: 0.7 });
        }

        // ---- diving ----
        const divingNow = (useBody && sig.duck) || keys.down;
        if (divingNow && !r.diving) {
          statsRef.current.dives++;
          sfx.duck();
          logEvent({ game: "sky-quest", type: "movement", skill: "bodyAwareness", value: 0.6 });
        }
        r.diving = divingNow;

        // ---- flight physics ----
        r.vAlt -= SKY_GRAVITY * dt;
        if (r.diving) r.vAlt -= 6 * dt;
        r.vAlt = THREE.MathUtils.clamp(r.vAlt, -6, 5);
        r.alt += r.vAlt * dt;
        if (r.alt < ALT_MIN) {
          r.alt = ALT_MIN;
          r.vAlt = Math.max(0, r.vAlt);
        }
        if (r.alt > ALT_MAX) {
          r.alt = ALT_MAX;
          r.vAlt = Math.min(0, r.vAlt);
        }

        // ---- travel ----
        let slow = r.clock < r.slowUntil ? 0.35 : 1;
        // Glide up slowly to question rings so there is time to pick a lane.
        if (nextGate && !nextGate.resolved) {
          const ahead = nextGate.d - r.traveled;
          if (ahead > 0 && ahead < 20) slow = Math.min(slow, 0.28 + 0.72 * (ahead / 20));
        }
        const speed = FLY_SPEED * slow;
        r.curSpeed = speed;
        const prevTraveled = r.traveled;
        r.traveled += speed * dt;
        t.course.position.z = r.traveled;
        // slide the world sideways along the S-curve — this IS the turning
        t.course.position.x = -pathX(r.traveled);
        t.earth.position.x = -pathX(r.traveled);
        // the countryside streams past below: fields scroll, scenery recycles
        t.earthTex.offset.y = r.traveled / 34;
        for (const item of t.earthItems) {
          item.obj.position.z += speed * dt;
          if (item.obj.position.z > 16) item.obj.position.z -= item.span;
        }

        // ---- gates ask/resolve ----
        for (const gate of t.gates) {
          if (!gate.asked && r.traveled > gate.d - 22) {
            gate.asked = true;
            setQuestion(gate.q);
            say(gate.q.speak, { interrupt: true });
            logEvent({ game: "sky-quest", type: "attempt", label: gate.q.domain });
          }
          if (!gate.resolved && prevTraveled < gate.d && r.traveled >= gate.d) {
            resolveGate(gate, r.lane);
          }
        }

        // ---- storm clouds: dodge by steering or changing height ----
        for (const st of t.storms) {
          if (!st.resolved && prevTraveled < st.d && r.traveled >= st.d) {
            st.resolved = true;
            const hit = st.lane === r.lane && Math.abs(st.alt - r.alt) < 1.5;
            if (hit) {
              statsRef.current.bumps++;
              sfx.hit();
              say("Whoosh! Fly around the storm clouds!");
              r.slowUntil = r.clock + 0.8;
            } else {
              sfx.coin();
              statsRef.current.coins++;
            }
          }
        }

        // ---- star pickups ----
        for (const s of t.stars) {
          if (
            !s.taken &&
            s.lane === r.lane &&
            Math.abs(r.traveled - s.d) < 0.9 &&
            Math.abs(s.alt - r.alt) < 1.3
          ) {
            s.taken = true;
            s.mesh.visible = false;
            statsRef.current.coins++;
            sfx.coin();
          }
        }

        const progress = Math.min(1, r.traveled / t.finishD);
        setHud((h) => {
          const p = Math.round(progress * 100);
          return h.progress === p && h.coins === statsRef.current.coins
            ? h
            : { ...h, coins: statsRef.current.coins, progress: p };
        });

        if (r.traveled >= t.finishD) finishRun();
      }
    }

    // ---- flyer animation ----
    const f = t.flyer;
    const targetX = LANE_X[r.lane];
    const dx = targetX - f.group.position.x;
    f.group.position.x += dx * Math.min(1, dt * 7);
    const hoverBob = Math.sin(r.clock * 3.2) * 0.12;
    const targetY = playing ? r.alt : 3.2;
    f.group.position.y += (targetY + hoverBob - f.group.position.y) * Math.min(1, dt * 8);

    // wing beats: constant glide flutter + a strong beat right after a flap
    r.flapAnim = Math.max(0, r.flapAnim - dt * 1.8);
    const beat =
      Math.sin(r.clock * (5 + r.flapAnim * 14)) * (0.25 + r.flapAnim * 0.75) +
      Math.sin(r.clock * 2.1) * 0.08;
    f.wingL.rotation.z = -beat;
    f.wingR.rotation.z = beat;

    // posture: pitch with vertical speed, dive tuck, bank into turns.
    // The bank combines lane changes with the slope of the S-curve path, so
    // the flyer leans into every bend of the winding route.
    const curveSlope = (pathX(r.traveled + 3) - pathX(r.traveled - 3)) / 6;
    const pitch = THREE.MathUtils.clamp(-r.vAlt * 0.12, -0.45, 0.5) + (r.diving ? 0.4 : 0);
    f.body.rotation.x += (pitch - f.body.rotation.x) * Math.min(1, dt * 8);
    const bank = -dx * 0.28 - curveSlope * 0.6;
    f.body.rotation.z += (bank - f.body.rotation.z) * Math.min(1, dt * 8);
    // yaw slightly toward where the path curves next
    f.group.rotation.y += (curveSlope * 0.35 - f.group.rotation.y) * Math.min(1, dt * 5);
    // barrel roll celebration
    if (r.clock < r.rollUntil) {
      const k = 1 - (r.rollUntil - r.clock) / 0.9;
      const eased = 1 - Math.pow(1 - k, 2);
      f.group.rotation.z = eased * Math.PI * 2;
    } else {
      f.group.rotation.z = 0;
    }
    // scarf and tail stream behind
    f.scarf.rotation.x = -1.2 + Math.sin(r.clock * 6) * 0.25 + r.vAlt * 0.05;
    f.tail.rotation.y = Math.sin(r.clock * 4.5) * 0.3 + dx * 0.4;
    f.legL.rotation.x = 1.35 + Math.sin(r.clock * 4) * 0.12;
    f.legR.rotation.x = 1.35 + Math.cos(r.clock * 4) * 0.12;

    // spin the pickup stars
    for (const s of t.stars) if (!s.taken) s.mesh.rotation.y += dt * 2.5;
    // gates bob gently
    for (const gate of t.gates) {
      if (!gate.resolved) gate.group.position.y = Math.sin(r.clock * 1.6 + gate.d) * 0.15;
    }
    // storms rumble in place (keeping their spot on the winding path)
    for (const st of t.storms) {
      if (!st.resolved)
        st.group.position.x = LANE_X[st.lane] + pathX(st.d) + Math.sin(r.clock * 7 + st.d) * 0.06;
    }

    // hands-up confetti on the finish screen
    if (phaseRef.current === "complete" && sig.handsUp && r.clock > r.slowUntil) {
      r.slowUntil = r.clock + 1.2;
      spawnConfetti(f.group.position.x, f.group.position.y + 1, 1);
      sfx.star();
    }

    // confetti update
    for (let i = t.confetti.length - 1; i >= 0; i--) {
      const cf = t.confetti[i];
      cf.life -= dt;
      const pos = cf.points.geometry.getAttribute("position") as THREE.BufferAttribute;
      for (let k = 0; k < pos.count; k++) {
        cf.vel[k * 3 + 1] -= 7 * dt;
        pos.setX(k, pos.getX(k) + cf.vel[k * 3] * dt);
        pos.setY(k, pos.getY(k) + cf.vel[k * 3 + 1] * dt);
        pos.setZ(k, pos.getZ(k) + cf.vel[k * 3 + 2] * dt);
      }
      pos.needsUpdate = true;
      (cf.points.material as THREE.PointsMaterial).opacity = Math.max(0, cf.life / 1.4);
      (cf.points.material as THREE.PointsMaterial).transparent = true;
      if (cf.life <= 0) {
        t.scene.remove(cf.points);
        cf.points.geometry.dispose();
        (cf.points.material as THREE.Material).dispose();
        t.confetti.splice(i, 1);
      }
    }

    // camera follows lane + altitude softly
    t.camera.position.x += (f.group.position.x * 0.4 - t.camera.position.x) * Math.min(1, dt * 3);
    t.camera.position.y += (f.group.position.y + 1.6 - t.camera.position.y) * Math.min(1, dt * 3);
    t.camera.lookAt(f.group.position.x * 0.6, f.group.position.y - 0.4, -18);

    t.renderer.render(t.scene, t.camera);
  }, [finishRun, resolveGate, spawnConfetti]);

  // keyboard fallback
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = keysRef.current;
      if (e.key === "ArrowLeft") k.lane = Math.max(0, k.lane - 1);
      else if (e.key === "ArrowRight") k.lane = Math.min(2, k.lane + 1);
      else if (e.key === "ArrowUp") k.up = true;
      else if (e.key === "ArrowDown") k.down = true;
      else return;
      e.preventDefault();
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") keysRef.current.down = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => () => stopMusic(), []);

  // ------------------------------------------------------------- flow ctrl --
  const startRun = useCallback(
    (b: BandDef) => {
      audioInit();
      sfx.click();
      setBand(b);
      bandRef.current = b;
      statsRef.current = emptyStats();
      completedRef.current = false;
      runRef.current = {
        traveled: 0,
        lane: 1,
        alt: 3.2,
        vAlt: 0,
        curSpeed: 0,
        slowUntil: 0,
        rollUntil: 0,
        clock: runRef.current.clock,
        handsUpPrev: false,
        lastJumpCount: signalsRef.current.jumpCount,
        flapAnim: 0,
        diving: false,
      };
      keysRef.current.lane = 1;
      setHud({ stars: 0, coins: 0, progress: 0 });
      setQuestion(null);
      setFeedback(null);
      setFinalStats(null);
      buildCourse();
      kbModeRef.current = false;
      if (signalsRef.current.calibrated) {
        beginCountdown();
      } else {
        setCalibrating(true);
        setPhaseBoth("calibrate");
        say("Stand back so I can see your whole body, from head to toes!", { interrupt: true });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [buildCourse, setPhaseBoth],
  );

  const beginCountdown = useCallback(() => {
    setPhaseBoth("countdown");
    setCountdown(3);
    let n = 3;
    sfx.countdown();
    const iv = window.setInterval(() => {
      if (phaseRef.current !== "countdown") {
        window.clearInterval(iv);
        return;
      }
      n--;
      if (n > 0) {
        sfx.countdown();
        setCountdown(n);
      } else {
        window.clearInterval(iv);
        sfx.go();
        startMusic(1);
        runRef.current.lastJumpCount = signalsRef.current.jumpCount;
        setPhaseBoth("playing");
        logEvent({ game: "sky-quest", type: "session-start", label: bandRef.current.id });
        say("Flap your arms to fly higher! Squat to swoop down!", { interrupt: true });
      }
    }, 900);
  }, [setPhaseBoth]);

  const onCalibrated = useCallback(() => {
    setCalibrating(false);
    sfx.meterFull();
    say("I can see you! Spread your wings!", { interrupt: true });
    window.setTimeout(() => {
      if (phaseRef.current === "calibrate") beginCountdown();
    }, 700);
  }, [beginCountdown]);

  const skipToKeyboard = useCallback(() => {
    sfx.click();
    kbModeRef.current = true;
    setCalibrating(false);
    beginCountdown();
  }, [beginCountdown]);

  const togglePause = useCallback(() => {
    sfx.click();
    if (phaseRef.current === "playing") {
      setPhaseBoth("paused");
      stopMusic();
    } else if (phaseRef.current === "paused") {
      setPhaseBoth("playing");
      startMusic(1);
    }
  }, [setPhaseBoth]);

  const goHome = useCallback(() => {
    stopMusic();
    setQuestion(null);
    setFeedback(null);
    setPhaseBoth("menu");
  }, [setPhaseBoth]);

  const toggleMute = useCallback(() => {
    const m = !isMuted();
    setMuted(m);
    setMutedState(m);
  }, []);

  const camVisible = phase !== "menu" && phase !== "complete";
  const showHud = phase === "playing" || phase === "paused";

  // ------------------------------------------------------------------ UI --
  return (
    <div className="relative h-screen w-full select-none overflow-hidden bg-sky-300">
      <div ref={mountRef} className="absolute inset-0" />

      {camVisible && (
        <div
          className={
            phase === "calibrate"
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
            size={phase === "calibrate" ? "lg" : "sm"}
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
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 rounded-full bg-card/95 px-3 py-2 text-sm font-black shadow-lg backdrop-blur">
              ⭐ {hud.stars}
            </div>
            <div className="flex items-center gap-1 rounded-full bg-card/95 px-3 py-2 text-sm font-black shadow-lg backdrop-blur">
              🪙 {hud.coins}
            </div>
            <button
              onClick={togglePause}
              aria-label="Pause"
              className="grid h-9 w-9 place-items-center rounded-full bg-card/95 text-foreground shadow-lg backdrop-blur"
            >
              {phase === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
          </div>
        )}
      </div>

      {showHud && (
        <div className="absolute left-1/2 top-14 z-20 w-[min(60vw,420px)] -translate-x-1/2 md:top-16">
          <div className="h-3 overflow-hidden rounded-full bg-card/70 shadow backdrop-blur">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all"
              style={{ width: `${hud.progress}%` }}
            />
          </div>
        </div>
      )}

      {showHud && question && !feedback && (
        <div className="pointer-events-none absolute left-1/2 top-20 z-20 -translate-x-1/2 md:top-24">
          <div className="animate-bounce-soft rounded-3xl border-4 border-sky-300 bg-card/95 px-6 py-3 text-center shadow-xl backdrop-blur">
            <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              {DOMAIN_LABEL[question.domain]}
            </div>
            <div className="text-xl font-black text-foreground md:text-2xl">{question.prompt}</div>
            <div className="mt-1 rounded-full bg-primary/15 px-3 py-1 text-xs font-black text-primary">
              ✈️ Steer into the right ring and fly through it!
            </div>
          </div>
        </div>
      )}

      {feedback && (
        <div className="pointer-events-none absolute left-1/2 top-20 z-20 -translate-x-1/2 md:top-24">
          <div
            className={`rounded-3xl border-4 px-6 py-3 text-center text-lg font-black shadow-xl backdrop-blur md:text-xl ${
              feedback.ok
                ? "border-green-400 bg-green-50/95 text-green-700"
                : "border-amber-400 bg-amber-50/95 text-amber-700"
            }`}
          >
            {feedback.ok ? "🎉 " : "💛 "}
            {feedback.text}
          </div>
        </div>
      )}

      {phase === "playing" && lostBody && (
        <div className="absolute inset-0 z-40 grid place-items-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-3xl bg-card p-6 text-center shadow-2xl">
            <div className="text-5xl">🙈</div>
            <div className="mt-2 text-xl font-black text-foreground">Where did you go?</div>
            <div className="text-sm font-semibold text-muted-foreground">
              Step back in front of the camera to keep flying!
            </div>
          </div>
        </div>
      )}

      {/* ---------------- menu ---------------- */}
      {phase === "menu" && (
        <div className="absolute inset-0 z-30 overflow-y-auto bg-gradient-to-b from-sky-400/70 via-transparent to-transparent">
          <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col items-center justify-center gap-5 px-4 py-16">
            <div className="text-center">
              <div className="text-5xl">🦊🎈</div>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-foreground drop-shadow md:text-5xl">
                Kalqy Sky Quest
              </h1>
              <p className="mt-1 text-sm font-bold text-foreground/80">
                Spread your wings! Flap, swoop and steer through the clouds.
              </p>
            </div>

            <div className="grid w-full gap-3 md:grid-cols-3">
              {BANDS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => startRun(b)}
                  className={`group flex flex-col items-start gap-1 rounded-3xl border-4 bg-card/95 p-4 text-left shadow-xl backdrop-blur transition-all hover:-translate-y-1 hover:shadow-2xl ${
                    band.id === b.id ? "border-primary" : "border-transparent"
                  }`}
                >
                  <div className="text-4xl transition-transform group-hover:scale-110">
                    {b.emoji}
                  </div>
                  <div className="text-lg font-black text-foreground">
                    {b.label}{" "}
                    <span className="text-xs font-bold text-muted-foreground">{b.age}</span>
                  </div>
                  <div className="text-xs font-semibold text-muted-foreground">{b.blurb}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {b.domains.map((d) => (
                      <span
                        key={d}
                        className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 w-full rounded-full bg-primary px-4 py-2 text-center text-sm font-black text-primary-foreground shadow group-hover:scale-[1.02]">
                    Fly ▶
                  </div>
                </button>
              ))}
            </div>

            <div className="grid w-full grid-cols-2 gap-2 rounded-3xl bg-card/80 p-4 text-center shadow-lg backdrop-blur md:grid-cols-5">
              {[
                ["🙌", "Flap both arms", "fly higher"],
                ["🐸", "Squat", "swoop down"],
                ["🚶", "Step left & right", "steer"],
                ["💫", "Fly through", "the right ring"],
                ["⛈️", "Dodge", "storm clouds"],
              ].map(([e, a, b2]) => (
                <div key={a as string}>
                  <div className="text-2xl">{e}</div>
                  <div className="text-xs font-black text-foreground">{a}</div>
                  <div className="text-[10px] font-semibold text-muted-foreground">{b2}</div>
                </div>
              ))}
            </div>
            <div className="text-center text-[10px] font-bold text-foreground/60">
              NEP 2020 · NCF Foundational Stage aligned · Movement-based learning
            </div>
          </div>
        </div>
      )}

      {/* ---------------- calibrate ---------------- */}
      {phase === "calibrate" && (
        <div className="absolute inset-x-0 bottom-8 z-40 flex flex-col items-center gap-2 px-4 text-center">
          <div className="rounded-3xl bg-card/95 px-6 py-3 shadow-xl backdrop-blur">
            <div className="text-lg font-black text-foreground">
              🧍 Stand back — fit your whole body in the box!
            </div>
            <div className="text-xs font-semibold text-muted-foreground">
              {poseStatus === "ready"
                ? "Head to toes visible, then hold still for a moment…"
                : "Waking up the camera…"}
            </div>
          </div>
          <button
            onClick={skipToKeyboard}
            className="rounded-full bg-card/80 px-4 py-1.5 text-xs font-bold text-muted-foreground shadow backdrop-blur transition-colors hover:text-foreground"
          >
            No camera? Play with arrow keys ⌨️
          </button>
        </div>
      )}

      {/* ---------------- countdown ---------------- */}
      {phase === "countdown" && (
        <div className="pointer-events-none absolute inset-0 z-40 grid place-items-center">
          <div
            key={countdown}
            className="animate-bounce-soft text-9xl font-black text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.4)]"
          >
            {countdown}
          </div>
        </div>
      )}

      {/* ---------------- paused ---------------- */}
      {phase === "paused" && (
        <div className="absolute inset-0 z-40 grid place-items-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-3xl bg-card p-8 shadow-2xl">
            <div className="text-2xl font-black text-foreground">Paused</div>
            <button
              onClick={togglePause}
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-black text-primary-foreground shadow"
            >
              <Play className="h-4 w-4" /> Keep Flying
            </button>
            <button
              onClick={goHome}
              className="flex items-center gap-2 rounded-full bg-secondary px-6 py-3 font-black text-secondary-foreground"
            >
              <Home className="h-4 w-4" /> Home
            </button>
          </div>
        </div>
      )}

      {/* ---------------- complete ---------------- */}
      {phase === "complete" && finalStats && (
        <div className="absolute inset-0 z-40 overflow-y-auto bg-black/55 backdrop-blur-sm">
          <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col items-center justify-center gap-4 px-4 py-10">
            <div className="w-full rounded-3xl bg-card p-6 shadow-2xl">
              <div className="text-center">
                <div className="text-5xl">🏅</div>
                <h2 className="mt-1 text-3xl font-black text-foreground">
                  You flew the whole sky!
                </h2>
                <div className="mt-2 flex items-center justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-8 w-8 ${
                        i <
                        Math.max(
                          1,
                          Math.round((finalStats.correct / Math.max(1, finalStats.total)) * 5),
                        )
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-1 text-sm font-bold text-muted-foreground">
                  {finalStats.correct} of {finalStats.total} answers correct · 🪙 {finalStats.coins}{" "}
                  coins
                </div>
                <div className="mt-1 text-xs font-semibold text-muted-foreground">
                  🙌 Put both hands up for confetti!
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-secondary/60 p-4">
                  <div className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    📚 Academic Indicators
                  </div>
                  <div className="mt-2 flex flex-col gap-1.5">
                    {Object.entries(finalStats.byDomain).map(([dom, v]) => (
                      <div key={dom} className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-foreground">
                          {DOMAIN_LABEL[dom as Domain] ?? dom}
                        </span>
                        <span className="rounded-full bg-card px-2 py-0.5 text-xs font-black">
                          {v.correct}/{v.total}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl bg-secondary/60 p-4">
                  <div className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    🏃 Physical Indicators
                  </div>
                  <div className="mt-2 flex flex-col gap-1.5 text-sm font-bold text-foreground">
                    <div className="flex justify-between">
                      <span>🙌 Arm flaps (gross motor)</span>
                      <span>{finalStats.flaps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🐸 Dives / squats</span>
                      <span>{finalStats.dives}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🚶 Side steps (steering)</span>
                      <span>{finalStats.steers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>⛈️ Storms dodged</span>
                      <span>
                        {GATE_COUNT - finalStats.bumps}/{GATE_COUNT}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => startRun(band)}
                  className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-black text-primary-foreground shadow transition-transform hover:scale-105"
                >
                  <RotateCw className="h-4 w-4" /> Fly Again
                </button>
                <button
                  onClick={goHome}
                  className="flex items-center gap-2 rounded-full bg-secondary px-6 py-3 font-black text-secondary-foreground"
                >
                  <Home className="h-4 w-4" /> Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
