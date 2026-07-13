import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ArrowLeft, Home, Pause, Play, RotateCw, Star, Volume2, VolumeX } from "lucide-react";
import { DinoPoseControl, createPoseSignals, type PoseStatus } from "./DinoPoseControl";
import { GameResultBanner } from "@/components/kalqy/GameResultBanner";
import { audioInit, isMuted, say, setMuted, sfx, startMusic, stopMusic } from "@/lib/dino-audio";
import { logEvent } from "@/lib/analytics";

// KALQY 3D World — a full-body Three.js learning runner.
//
// The child IS the controller (MediaPipe PoseLandmarker via DinoPoseControl):
//   step / lean left-right  → change lane
//   jump in real life       → jump over logs
//   squat                   → duck under branches
//   both hands up           → celebrate at the finish line
//
// Learning gates come from the KALQY Foundational Stage framework
// (kalqy-for-schools.md) and the NCF-FS band progressions
// (aligning-curriculum-to-ncf.md): colours, shapes, animal sounds and
// big/small for Band 1 (3–4); letters, numbers and counting-to-5 for
// Band 2 (4–5); rhymes, beginning sounds, addition within 10 and
// feelings for Bands 3–4 (5–6).

interface KalqyWorld3DProps {
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
// Learning content (from kalqy-for-schools.md + aligning-curriculum-to-ncf.md)
// ---------------------------------------------------------------------------

type Domain = "colours" | "shapes" | "listening" | "letters" | "numbers" | "phonics" | "feelings";

interface Panel {
  kind: "text" | "emoji" | "color" | "shape" | "count" | "sum";
  value: string; // text / emoji / shape name / numeral
  color?: string;
  count?: number; // for "count" panels: how many emoji to draw
}

interface Question {
  domain: Domain;
  prompt: string; // HUD banner
  speak: string; // spoken by Kalqy
  options: Panel[]; // exactly 3, one per lane
  labels: string[]; // spoken name of each option ("the letter D", "the red circle", …)
  correct: number; // lane index 0..2
  praise: string;
  teach: string; // gentle re-teach after a wrong answer
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
// Pick `n` distinct items, always including `must`.
function optionsWith<T>(pool: T[], must: T, n = 3): { options: T[]; correct: number } {
  const rest = shuffled(pool.filter((x) => x !== must)).slice(0, n - 1);
  const options = shuffled([must, ...rest]);
  return { options, correct: options.indexOf(must) };
}

// --- Band 1 (Age 3–4) ---
const B1_COLORS = [
  { name: "RED", hex: "#ef4444" },
  { name: "BLUE", hex: "#3b82f6" },
  { name: "GREEN", hex: "#22c55e" },
  { name: "YELLOW", hex: "#eab308" },
];
const B2_COLORS = [
  { name: "ORANGE", hex: "#f97316" },
  { name: "PURPLE", hex: "#a855f7" },
  { name: "PINK", hex: "#ec4899" },
  { name: "BROWN", hex: "#92400e" },
];

function qColourHunt(pool: typeof B1_COLORS): Question {
  const target = pick(pool);
  const { options, correct } = optionsWith(pool, target);
  return {
    domain: "colours",
    prompt: `Find something ${target.name}!`,
    speak: `Find something ${target.name.toLowerCase()}! Step into the ${target.name.toLowerCase()} gate!`,
    options: options.map((c) => ({ kind: "color", value: c.name, color: c.hex })),
    labels: options.map((c) => c.name.toLowerCase()),
    correct,
    praise: `Yes! That is ${target.name.toLowerCase()}!`,
    teach: `Almost! Look, this one is ${target.name.toLowerCase()}. Let's find it next time!`,
  };
}

const SHAPES = ["CIRCLE", "SQUARE", "TRIANGLE"];
function qShapeCatcher(): Question {
  const target = pick(SHAPES);
  const { options, correct } = optionsWith(SHAPES, target);
  return {
    domain: "shapes",
    prompt: `Catch the ${target}!`,
    speak: `Catch the ${target.toLowerCase()}! Run through the ${target.toLowerCase()} gate!`,
    options: options.map((s) => ({ kind: "shape", value: s })),
    labels: options.map((s) => `the ${s.toLowerCase()}`),
    correct,
    praise: `Wonderful! You caught the ${target.toLowerCase()}!`,
    teach: `Oops! A ${target.toLowerCase()} looks like this. You will catch it next time!`,
  };
}

const ANIMAL_SOUNDS = [
  { emoji: "🐮", name: "cow", sound: "Moo" },
  { emoji: "🐶", name: "dog", sound: "Woof" },
  { emoji: "🐱", name: "cat", sound: "Meow" },
  { emoji: "🦆", name: "duck", sound: "Quack" },
  { emoji: "🐸", name: "frog", sound: "Ribbit" },
];
function qSoundSafari(): Question {
  const target = pick(ANIMAL_SOUNDS);
  const { options, correct } = optionsWith(ANIMAL_SOUNDS, target);
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

// --- Band 2 (Age 4–5) ---
const LETTERS = "ABCDEFGHKMNPRST".split("");
function qAlphabetJump(): Question {
  const target = pick(LETTERS);
  const { options, correct } = optionsWith(LETTERS, target);
  return {
    domain: "letters",
    prompt: `Find the letter ${target}!`,
    speak: `Find the letter ${target}! Run through the ${target} gate!`,
    options: options.map((l) => ({ kind: "text", value: l })),
    labels: options.map((l) => `the letter ${l}`),
    correct,
    praise: `Super! That is the letter ${target}!`,
    teach: `Almost! This is the letter ${target}. Say it with me: ${target}!`,
  };
}

function qNumberHop(max: number): Question {
  const nums = Array.from({ length: max }, (_, i) => String(i + 1));
  const target = pick(nums);
  const { options, correct } = optionsWith(nums, target);
  return {
    domain: "numbers",
    prompt: `Find the number ${target}!`,
    speak: `Find the number ${target}! Hop into the ${target} gate!`,
    options: options.map((n) => ({ kind: "text", value: n })),
    labels: options.map((n) => `the number ${n}`),
    correct,
    praise: `Yes! That is the number ${target}!`,
    teach: `Nice try! This is ${target}. Let's count together next time!`,
  };
}

// Counting stays within 5 for Band 2 (NCF-FS G8) and 10 for Band 3.
const COUNT_EMOJI = ["🍌", "🍎", "⭐", "🐟", "🌸"];
function qBananaCount(max: number): Question {
  const target = 1 + rand(Math.min(max, 6));
  const emoji = pick(COUNT_EMOJI);
  const pool = [1, 2, 3, 4, 5, 6].filter((n) => n <= Math.max(3, max));
  const { options, correct } = optionsWith(pool, target);
  return {
    domain: "numbers",
    prompt: `Which gate has ${target} ${emoji}?`,
    speak: `Count carefully! Find the gate with ${target}!`,
    options: options.map((n) => ({ kind: "count", value: emoji, count: n })),
    labels: options.map((n) => `the gate with ${n}`),
    correct,
    praise: `Great counting! One, two... ${target}!`,
    teach: `Let's count again together next time. We needed ${target}!`,
  };
}

// --- Band 3/4 (Age 5–6) ---
// Rhyming pairs straight from the NCF alignment doc (Band 3 phoneme prep).
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
function qRhymeTime(): Question {
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

const FIRST_SOUNDS = [
  { sound: "buh", letter: "B", match: { word: "BALL", emoji: "⚽" } },
  { sound: "sss", letter: "S", match: { word: "SUN", emoji: "☀️" } },
  { sound: "mmm", letter: "M", match: { word: "MANGO", emoji: "🥭" } },
  { sound: "duh", letter: "D", match: { word: "DUCK", emoji: "🦆" } },
  { sound: "fff", letter: "F", match: { word: "FISH", emoji: "🐟" } },
];
const SOUND_DISTRACTORS = [
  { word: "CAT", emoji: "🐱" },
  { word: "TREE", emoji: "🌳" },
  { word: "KITE", emoji: "🪁" },
  { word: "APPLE", emoji: "🍎" },
  { word: "RAIN", emoji: "🌧️" },
];
function qFirstSound(): Question {
  const target = pick(FIRST_SOUNDS);
  const distractors = shuffled(
    SOUND_DISTRACTORS.filter((d) => !d.word.startsWith(target.letter)),
  ).slice(0, 2);
  const opts = shuffled([target.match, ...distractors]);
  const correct = opts.indexOf(target.match);
  return {
    domain: "phonics",
    prompt: `What starts with "${target.letter}"?`,
    speak: `${target.sound}, ${target.sound}! Which word starts with the ${target.sound} sound?`,
    options: opts.map((o) => ({ kind: "emoji", value: `${o.emoji}\n${o.word}` })),
    labels: opts.map((o) => o.word.toLowerCase()),
    correct,
    praise: `Yes! ${target.match.word} starts with ${target.letter}!`,
    teach: `${target.match.word} starts with the ${target.sound} sound. ${target.sound}, ${target.match.word}!`,
  };
}

// Addition stays within 10 with visual dot support (NCF-FS G9 recommendation).
function qAdditionTreasure(): Question {
  const a = 1 + rand(5);
  const b = 1 + rand(Math.min(5, 9 - a));
  const sum = a + b;
  const pool = Array.from({ length: 10 }, (_, i) => i + 1);
  const { options, correct } = optionsWith(pool, sum);
  return {
    domain: "numbers",
    prompt: `${a} + ${b} = ?`,
    speak: `Treasure time! What is ${a} plus ${b}?`,
    options: options.map((n) => ({ kind: "sum", value: String(n), count: n })),
    labels: options.map((n) => `the number ${n}`),
    correct,
    praise: `Treasure found! ${a} plus ${b} is ${sum}!`,
    teach: `${a} plus ${b} makes ${sum}. Let's count it out next time!`,
  };
}

// Feeling Pond (R2): basic emotion recognition, Band-appropriate set.
const FEELINGS = [
  { name: "HAPPY", emoji: "😊" },
  { name: "SAD", emoji: "😢" },
  { name: "ANGRY", emoji: "😠" },
  { name: "SCARED", emoji: "😨" },
  { name: "SLEEPY", emoji: "😴" },
  { name: "SURPRISED", emoji: "😲" },
];
function qFeelingPond(): Question {
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
    teach: `This face is ${target.name.toLowerCase()}. Can you make a ${target.name.toLowerCase()} face too?`,
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
    blurb: "Colours, shapes & animal sounds — 80% moving, 20% thinking!",
    domains: ["Colours", "Shapes", "Animal sounds"],
    make: () => pick([() => qColourHunt(B1_COLORS), qShapeCatcher, qSoundSafari])(),
  },
  {
    id: "band2",
    label: "LKG",
    age: "Age 4–5",
    emoji: "🦊",
    blurb: "Letters, numbers & counting to 5 — jump on the answer!",
    domains: ["Letters", "Numbers 1–10", "Counting", "New colours"],
    make: () =>
      pick([
        qAlphabetJump,
        () => qNumberHop(10),
        () => qBananaCount(5),
        () => qColourHunt(B2_COLORS),
      ])(),
  },
  {
    id: "band3",
    label: "UKG",
    age: "Age 5–6",
    emoji: "🦉",
    blurb: "Rhymes, first sounds, adding & feelings — the big kid trail!",
    domains: ["Rhymes", "First sounds", "Addition to 10", "Feelings"],
    make: () =>
      pick([qRhymeTime, qFirstSound, qAdditionTreasure, () => qBananaCount(6), qFeelingPond])(),
  },
];

// ---------------------------------------------------------------------------
// Three.js world
// ---------------------------------------------------------------------------

const LANE_X = [-2.6, 0, 2.6];
const RUN_SPEED = 5; // units per second — gentle pace for little runners
const GATE_COUNT = 8;
const GATE_SPACING = 28;
const FIRST_GATE = 32;
const COURSE_END = FIRST_GATE + GATE_COUNT * GATE_SPACING + 24;
const JUMP_V = 8.2;
const GRAVITY = 22;

function makePanelTexture(panel: Panel): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  // card background
  ctx.fillStyle = "#fffdf5";
  ctx.beginPath();
  ctx.roundRect(8, 8, 240, 240, 28);
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = "#fbbf24";
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#1f2937";

  if (panel.kind === "text") {
    ctx.font = "900 150px 'Comic Sans MS', 'Arial Rounded MT Bold', sans-serif";
    ctx.fillText(panel.value, 128, 138);
  } else if (panel.kind === "emoji") {
    const [emoji, word] = panel.value.split("\n");
    if (word) {
      ctx.font = "110px sans-serif";
      ctx.fillText(emoji, 128, 100);
      ctx.font = "900 44px 'Comic Sans MS', sans-serif";
      ctx.fillText(word, 128, 200);
    } else {
      ctx.font = "150px sans-serif";
      ctx.fillText(emoji, 128, 138);
    }
  } else if (panel.kind === "color") {
    ctx.fillStyle = panel.color ?? "#888";
    ctx.beginPath();
    ctx.arc(128, 128, 82, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = "rgba(0,0,0,0.15)";
    ctx.stroke();
  } else if (panel.kind === "shape") {
    ctx.fillStyle = "#6366f1";
    ctx.beginPath();
    if (panel.value === "CIRCLE") ctx.arc(128, 128, 80, 0, Math.PI * 2);
    else if (panel.value === "SQUARE") ctx.rect(52, 52, 152, 152);
    else {
      ctx.moveTo(128, 42);
      ctx.lineTo(212, 200);
      ctx.lineTo(44, 200);
      ctx.closePath();
    }
    ctx.fill();
  } else if (panel.kind === "count") {
    const n = panel.count ?? 1;
    ctx.font = n <= 3 ? "78px sans-serif" : "60px sans-serif";
    const cols = n <= 3 ? n : Math.ceil(n / 2);
    const rows = n <= 3 ? 1 : 2;
    let i = 0;
    for (let r = 0; r < rows; r++) {
      const inRow = r === rows - 1 ? n - cols * (rows - 1) : cols;
      for (let k = 0; k < inRow; k++) {
        const x = 128 + (k - (inRow - 1) / 2) * (n <= 3 ? 74 : 62);
        const y = rows === 1 ? 132 : 90 + r * 84;
        ctx.fillText(panel.value, x, y);
        i++;
      }
    }
  } else if (panel.kind === "sum") {
    // numeral with supporting dots below (concrete representation first)
    ctx.font = "900 120px 'Comic Sans MS', sans-serif";
    ctx.fillText(panel.value, 128, 100);
    const n = panel.count ?? 0;
    ctx.fillStyle = "#f59e0b";
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / 5);
      const inRow = row === Math.floor((n - 1) / 5) ? n - row * 5 : 5;
      const x = 128 + ((i % 5) - (inRow - 1) / 2) * 38;
      ctx.beginPath();
      ctx.arc(x, 190 + row * 36, 13, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeTextSprite(text: string, font: string, w = 512, h = 160): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = font;
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = 10;
  ctx.strokeText(text, w / 2, h / 2);
  ctx.fillText(text, w / 2, h / 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Playable characters, built from primitives. Both share one animation rig:
// `tail` is the wag pivot (fox tail / Kali's braid) and earL/earR twitch
// (fox ears / Kali's pigtails).
interface CharacterRig {
  group: THREE.Group;
  body: THREE.Group;
  legL: THREE.Mesh;
  legR: THREE.Mesh;
  armL: THREE.Mesh;
  armR: THREE.Mesh;
  tail: THREE.Group;
  earL: THREE.Mesh;
  earR: THREE.Mesh;
}
function buildFox(): CharacterRig {
  const orange = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.7 });
  const cream = new THREE.MeshStandardMaterial({ color: 0xfff7ed, roughness: 0.8 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x3f2d20, roughness: 0.6 });

  const group = new THREE.Group();
  const body = new THREE.Group();
  group.add(body);

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.5, 6, 14), orange);
  torso.position.y = 0.95;
  body.add(torso);

  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.3, 14, 12), cream);
  belly.position.set(0, 0.9, 0.26);
  belly.scale.set(1, 1.25, 0.6);
  body.add(belly);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 14), orange);
  head.position.y = 1.72;
  body.add(head);

  const snout = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), cream);
  snout.position.set(0, 1.64, 0.3);
  body.add(snout);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), dark);
  nose.position.set(0, 1.66, 0.42);
  body.add(nose);

  const ears: THREE.Mesh[] = [];
  const arms: THREE.Mesh[] = [];
  for (const s of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.32, 8), orange);
    ear.position.set(0.2 * s, 2.06, 0);
    ear.rotation.z = -0.25 * s;
    body.add(ear);
    ears.push(ear);
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), dark);
    eye.position.set(0.14 * s, 1.78, 0.3);
    body.add(eye);
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.3, 4, 8), orange);
    // shift the capsule so it swings from the shoulder, not its middle
    arm.geometry.translate(0, -0.18, 0);
    arm.position.set(0.46 * s, 1.22, 0);
    arm.rotation.z = 0.5 * s;
    body.add(arm);
    arms.push(arm);
  }

  // tail in its own pivot group so it can wag
  const tail = new THREE.Group();
  const tailCone = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.7, 8), orange);
  tailCone.position.set(0, -0.15, -0.28);
  tailCone.rotation.x = 1.2;
  tail.add(tailCone);
  const tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), cream);
  tailTip.position.set(0, 0, -0.56);
  tail.add(tailTip);
  tail.position.set(0, 1.0, -0.22);
  body.add(tail);

  const legGeo = new THREE.CapsuleGeometry(0.11, 0.34, 4, 8);
  const legL = new THREE.Mesh(legGeo, orange);
  legL.position.set(-0.18, 0.32, 0);
  const legR = new THREE.Mesh(legGeo, orange);
  legR.position.set(0.18, 0.32, 0);
  group.add(legL, legR);

  // The fox runs INTO the screen, so it shows its back to the camera.
  group.rotation.y = Math.PI;

  return {
    group,
    body,
    legL,
    legR,
    armL: arms[0],
    armR: arms[1],
    tail,
    earL: ears[0],
    earR: ears[1],
  };
}

// Kali — the Level 2 hero, a little girl with pigtails and a purple dress.
function buildGirl(): CharacterRig {
  const skin = new THREE.MeshStandardMaterial({ color: 0xf1c27d, roughness: 0.75 });
  const hair = new THREE.MeshStandardMaterial({ color: 0x4a2c17, roughness: 0.65 });
  const dress = new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.7 });
  const trim = new THREE.MeshStandardMaterial({ color: 0xfdf4ff, roughness: 0.8 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x30231a, roughness: 0.6 });
  const bowMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.6 });

  const group = new THREE.Group();
  const body = new THREE.Group();
  group.add(body);

  // dress: chest + flared skirt
  const chest = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 0.4, 6, 14), dress);
  chest.position.y = 1.1;
  body.add(chest);
  const skirt = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.75, 14), dress);
  skirt.position.y = 0.78;
  body.add(skirt);
  const hem = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.045, 8, 18), trim);
  hem.rotation.x = Math.PI / 2;
  hem.position.y = 0.44;
  body.add(hem);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 14), skin);
  head.position.y = 1.72;
  body.add(head);
  // hair cap sits over the back and top of the head
  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.37, 16, 14), hair);
  hairCap.position.set(0, 1.78, -0.06);
  hairCap.scale.set(1, 0.95, 0.95);
  body.add(hairCap);
  const fringe = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), hair);
  fringe.position.set(0, 1.98, 0.16);
  fringe.scale.set(1.5, 0.55, 0.8);
  body.add(fringe);
  // bow on top
  const bowKnot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), bowMat);
  bowKnot.position.set(0.16, 2.08, 0);
  body.add(bowKnot);
  for (const s of [-1, 1]) {
    const loop = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.2, 8), bowMat);
    loop.position.set(0.16 + 0.11 * s, 2.12, 0);
    loop.rotation.z = (Math.PI / 2) * s;
    body.add(loop);
  }

  // pigtails (twitch like the fox's ears)
  const pigtails: THREE.Mesh[] = [];
  for (const s of [-1, 1]) {
    const tailGeo = new THREE.CapsuleGeometry(0.11, 0.3, 4, 8);
    tailGeo.translate(0, -0.2, 0); // hang from the tie point
    const pig = new THREE.Mesh(tailGeo, hair);
    pig.position.set(0.36 * s, 1.82, -0.05);
    pig.rotation.z = -0.35 * s;
    body.add(pig);
    pigtails.push(pig);
    const tie = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), bowMat);
    tie.position.set(0.36 * s, 1.82, -0.05);
    body.add(tie);
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), dark);
    eye.position.set(0.13 * s, 1.76, 0.29);
    body.add(eye);
  }
  // little smile
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.016, 6, 10, Math.PI), dark);
  smile.position.set(0, 1.63, 0.31);
  smile.rotation.x = Math.PI;
  body.add(smile);

  // arms with puff sleeves
  const arms: THREE.Mesh[] = [];
  for (const s of [-1, 1]) {
    const sleeve = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), dress);
    sleeve.position.set(0.38 * s, 1.32, 0);
    body.add(sleeve);
    const armGeo = new THREE.CapsuleGeometry(0.075, 0.3, 4, 8);
    armGeo.translate(0, -0.18, 0);
    const arm = new THREE.Mesh(armGeo, skin);
    arm.position.set(0.42 * s, 1.28, 0);
    arm.rotation.z = 0.4 * s;
    body.add(arm);
    arms.push(arm);
  }

  // back braid — the wag pivot
  const tail = new THREE.Group();
  const braidGeo = new THREE.CapsuleGeometry(0.09, 0.4, 4, 8);
  braidGeo.translate(0, -0.28, 0);
  const braid = new THREE.Mesh(braidGeo, hair);
  tail.add(braid);
  const braidTie = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), bowMat);
  braidTie.position.y = -0.52;
  tail.add(braidTie);
  tail.position.set(0, 1.78, -0.3);
  body.add(tail);

  const legGeo = new THREE.CapsuleGeometry(0.1, 0.3, 4, 8);
  const shoeGeo = new THREE.SphereGeometry(0.11, 10, 8);
  const legL = new THREE.Mesh(legGeo, skin);
  legL.position.set(-0.16, 0.3, 0);
  const legR = new THREE.Mesh(legGeo, skin);
  legR.position.set(0.16, 0.3, 0);
  for (const leg of [legL, legR]) {
    const shoe = new THREE.Mesh(shoeGeo, bowMat);
    shoe.position.set(0, -0.2, 0.04);
    shoe.scale.set(1, 0.7, 1.3);
    leg.add(shoe); // shoes swing with the legs
  }
  group.add(legL, legR);

  // Kali also runs INTO the screen.
  group.rotation.y = Math.PI;

  return {
    group,
    body,
    legL,
    legR,
    armL: arms[0],
    armR: arms[1],
    tail,
    earL: pigtails[0],
    earR: pigtails[1],
  };
}

interface GateEntity {
  d: number; // course distance where the gate sits
  group: THREE.Group;
  panels: THREE.Mesh[];
  q: Question;
  asked: boolean;
  resolved: boolean;
}
interface ObstacleEntity {
  d: number;
  group: THREE.Group;
  kind: "log" | "branch";
  resolved: boolean;
}
interface CoinEntity {
  d: number;
  lane: number;
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

export function KalqyWorld3D({ onBack, onComplete }: KalqyWorld3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<Phase>("menu");
  const phaseRef = useRef<Phase>("menu");
  const setPhaseBoth = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  const [band, setBand] = useState<BandDef>(BANDS[0]);
  const bandRef = useRef<BandDef>(BANDS[0]);
  const [level, setLevel] = useState(1); // 1 = Kalqy's forest, 2 = Kali's valley
  const levelRef = useRef(1);

  const signalsRef = useRef(createPoseSignals());
  const [poseStatus, setPoseStatus] = useState<PoseStatus>("idle");
  const [calibrating, setCalibrating] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [muted, setMutedState] = useState(isMuted());

  // HUD state (updated sparsely, never per frame)
  const [question, setQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [hud, setHud] = useState({ stars: 0, coins: 0, progress: 0 });
  const [lostBody, setLostBody] = useState(false);
  const [pointMode, setPointMode] = useState(false); // stopped at a gate, picking by hand

  interface RunStats {
    correct: number;
    total: number;
    coins: number;
    jumps: number;
    squats: number;
    sideSteps: number;
    reaches: number;
    bumps: number;
    byDomain: Record<string, { correct: number; total: number }>;
  }
  const emptyStats = (): RunStats => ({
    correct: 0,
    total: 0,
    coins: 0,
    jumps: 0,
    squats: 0,
    sideSteps: 0,
    reaches: 0,
    bumps: 0,
    byDomain: {},
  });
  const statsRef = useRef<RunStats>(emptyStats());
  const [finalStats, setFinalStats] = useState<RunStats | null>(null);
  const completedRef = useRef(false);

  // ---- three.js refs ----
  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    course: THREE.Group;
    fox: CharacterRig; // the ACTIVE character (Kalqy on L1, Kali on L2)
    applyLevel: (lvl: number) => void;
    groundTex: THREE.CanvasTexture;
    clouds: THREE.Group[];
    trees: THREE.Group[];
    gates: GateEntity[];
    obstacles: ObstacleEntity[];
    coins: CoinEntity[];
    confetti: ConfettiBurst[];
    finishD: number;
  } | null>(null);

  const runRef = useRef({
    traveled: 0,
    lane: 1,
    y: 0,
    vy: 0,
    airborne: false,
    ducking: false,
    lastJumpCount: 0,
    slowUntil: 0,
    spinUntil: 0,
    lastLean: 0 as -1 | 0 | 1,
    clock: 0,
    speedMul: 1, // Level 2 runs a touch faster
    // animation state
    stridePhase: 0, // advances with ground speed so feet never slide
    curSpeed: 0,
    landAt: -1, // clock time of the last landing (for squash)
    // stop-and-point answering state
    answering: false,
    pickCand: null as number | null,
    pickSince: 0,
    remindAt: 0,
  });

  const keysRef = useRef({ up: false, down: false, lane: 1 });
  // Camera-free fallback: lets kids play with arrow keys if the camera is
  // blocked or unavailable (also useful for quick testing).
  const kbModeRef = useRef(false);

  // ---------------------------------------------------------------- scene --
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x8ee3f5);
    scene.fog = new THREE.Fog(0x8ee3f5, 40, 110);

    // Level themes: Level 1 is Kalqy's Sunny Forest, Level 2 is Kali's
    // Blossom Valley (soft lavender sky, cherry-blossom trees, sandy path).
    const LEVEL_THEMES = [
      {
        sky: 0x8ee3f5,
        grass: "#7ecb52",
        grassDark: "#6dbb45",
        grassColor: 0x7ecb52,
        track: "#e7c07a",
        trackDark: "#d9ad5f",
        laneLine: "#fff3d6",
        leaf: 0x2f9e44,
        cloud: 0xffffff,
      },
      {
        sky: 0xdcc7f5,
        grass: "#93d977",
        grassDark: "#7fc964",
        grassColor: 0x93d977,
        track: "#f2ddb5",
        trackDark: "#e3c894",
        laneLine: "#ffffff",
        leaf: 0xf6a5c8,
        cloud: 0xfff0f7,
      },
    ];

    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      220,
    );
    camera.position.set(0, 4.6, 8.5);
    camera.lookAt(0, 1.4, -14);

    scene.add(new THREE.HemisphereLight(0xfffbe8, 0x7ecb52, 1.05));
    const sun = new THREE.DirectionalLight(0xffffff, 1.4);
    sun.position.set(6, 12, 4);
    scene.add(sun);

    // ground: canvas texture with grass + 3-lane sand track, scrolled along z
    const g = document.createElement("canvas");
    g.width = 256;
    g.height = 256;
    const gc = g.getContext("2d")!;
    const drawGround = (theme: (typeof LEVEL_THEMES)[number]) => {
      gc.setLineDash([]);
      gc.fillStyle = theme.grass;
      gc.fillRect(0, 0, 256, 256);
      gc.fillStyle = theme.grassDark;
      for (let i = 0; i < 40; i++) gc.fillRect(rand(256), rand(256), 10, 4);
      gc.fillStyle = theme.track;
      gc.fillRect(64, 0, 128, 256);
      gc.fillStyle = theme.trackDark;
      for (let i = 0; i < 14; i++) gc.fillRect(64 + rand(128), rand(256), 8, 3);
      gc.strokeStyle = theme.laneLine;
      gc.lineWidth = 4;
      gc.setLineDash([18, 16]);
      for (const x of [107, 149]) {
        gc.beginPath();
        gc.moveTo(x, 0);
        gc.lineTo(x, 256);
        gc.stroke();
      }
    };
    drawGround(LEVEL_THEMES[0]);
    const groundTex = new THREE.CanvasTexture(g);
    groundTex.colorSpace = THREE.SRGBColorSpace;
    groundTex.wrapS = THREE.RepeatWrapping;
    groundTex.wrapT = THREE.RepeatWrapping;
    groundTex.repeat.set(1, 22);
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(15.6, 260),
      new THREE.MeshStandardMaterial({ map: groundTex, roughness: 1 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.z = -100;
    scene.add(ground);
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x7ecb52, roughness: 1 });
    const grass = new THREE.Mesh(new THREE.PlaneGeometry(240, 260), grassMat);
    grass.rotation.x = -Math.PI / 2;
    grass.position.set(0, -0.02, -100);
    scene.add(grass);

    // course group carries gates/obstacles/coins and slides toward the player
    const course = new THREE.Group();
    scene.add(course);

    // recycled scenery trees
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8a6134 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2f9e44 });
    const trees: THREE.Group[] = [];
    for (let i = 0; i < 26; i++) {
      const t = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 1.1, 7), trunkMat);
      trunk.position.y = 0.55;
      const s = 0.8 + Math.random() * 0.9;
      const leaves = new THREE.Mesh(new THREE.ConeGeometry(0.9 * s, 1.9 * s, 8), leafMat);
      leaves.position.y = 1.1 + 0.9 * s;
      t.add(trunk, leaves);
      const side = i % 2 === 0 ? -1 : 1;
      t.position.set(side * (9 + Math.random() * 14), 0, -Math.random() * 130 + 5);
      scene.add(t);
      trees.push(t);
    }

    // drifting clouds
    const clouds: THREE.Group[] = [];
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 });
    for (let i = 0; i < 7; i++) {
      const cl = new THREE.Group();
      for (let k = 0; k < 3; k++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(1.1 + Math.random(), 10, 8), cloudMat);
        puff.position.set(k * 1.5 - 1.5, Math.random() * 0.5, 0);
        cl.add(puff);
      }
      cl.position.set(-40 + Math.random() * 80, 14 + Math.random() * 8, -60 - Math.random() * 40);
      scene.add(cl);
      clouds.push(cl);
    }

    const charFox = buildFox();
    const charGirl = buildGirl();
    charGirl.group.visible = false;
    scene.add(charFox.group, charGirl.group);

    const applyLevel = (lvl: number) => {
      const theme = LEVEL_THEMES[Math.min(lvl - 1, LEVEL_THEMES.length - 1)];
      (scene.background as THREE.Color).set(theme.sky);
      scene.fog?.color.set(theme.sky);
      grassMat.color.set(theme.grassColor);
      leafMat.color.set(theme.leaf);
      cloudMat.color.set(theme.cloud);
      drawGround(theme);
      groundTex.needsUpdate = true;
      const active = lvl >= 2 ? charGirl : charFox;
      const idle = lvl >= 2 ? charFox : charGirl;
      idle.group.visible = false;
      active.group.visible = true;
      active.group.position.copy(idle.group.position);
      if (threeRef.current) threeRef.current.fox = active;
    };

    threeRef.current = {
      renderer,
      scene,
      camera,
      course,
      fox: charFox,
      applyLevel,
      groundTex,
      clouds,
      trees,
      gates: [],
      obstacles: [],
      coins: [],
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

    // A thrown frame would silently kill setAnimationLoop's rAF chain — catch
    // and log instead so one bad frame can't freeze the whole game.
    renderer.setAnimationLoop(() => {
      try {
        tick();
      } catch (err) {
        console.error("KalqyWorld3D tick error", err);
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
    // clear previous run
    for (const g of t.gates) t.course.remove(g.group);
    for (const o of t.obstacles) t.course.remove(o.group);
    for (const c of t.coins) t.course.remove(c.mesh);
    for (const cf of t.confetti) t.scene.remove(cf.points);
    t.gates = [];
    t.obstacles = [];
    t.coins = [];
    t.confetti = [];
    t.course.position.z = 0;

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x9c6b3c, roughness: 0.9 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2f9e44, roughness: 0.9 });
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.35,
      metalness: 0.4,
    });
    const coinGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.08, 18);

    const addCoins = (d: number, lane: number) => {
      for (let k = 0; k < 3; k++) {
        const mesh = new THREE.Mesh(coinGeo, coinMat);
        mesh.rotation.x = Math.PI / 2;
        mesh.position.set(LANE_X[lane], 1.0, -(d + k * 2));
        t.course.add(mesh);
        t.coins.push({ d: d + k * 2, lane, mesh, taken: false });
      }
    };

    const addObstacle = (d: number, kind: "log" | "branch") => {
      const group = new THREE.Group();
      if (kind === "log") {
        const log = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 8.4, 12), woodMat);
        log.rotation.z = Math.PI / 2;
        log.position.y = 0.42;
        group.add(log);
        for (const s of [-1, 1]) {
          const end = new THREE.Mesh(
            new THREE.CylinderGeometry(0.43, 0.43, 0.1, 12),
            new THREE.MeshStandardMaterial({ color: 0xc49a6c }),
          );
          end.rotation.z = Math.PI / 2;
          end.position.set(4.2 * s, 0.42, 0);
          group.add(end);
        }
      } else {
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 8.4, 10), woodMat);
        bar.rotation.z = Math.PI / 2;
        bar.position.y = 1.55;
        group.add(bar);
        for (const s of [-1, 1]) {
          const post = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 1.55, 8), woodMat);
          post.position.set(4.1 * s, 0.78, 0);
          group.add(post);
        }
        const bush = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 8), leafMat);
        bush.position.set(0, 1.62, 0);
        bush.scale.set(4.5, 0.6, 1);
        group.add(bush);
      }
      group.position.z = -d;
      t.course.add(group);
      t.obstacles.push({ d, group, kind, resolved: false });
    };

    const addGate = (d: number, q: Question) => {
      const group = new THREE.Group();
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0xffb703, roughness: 0.6 });
      const panels: THREE.Mesh[] = [];
      for (let lane = 0; lane < 3; lane++) {
        const x = LANE_X[lane];
        for (const s of [-1, 1]) {
          const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 3.4, 8), pillarMat);
          pillar.position.set(x + s * 1.05, 1.7, 0);
          group.add(pillar);
        }
        const beam = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.16, 0.16), pillarMat);
        beam.position.set(x, 3.35, 0);
        group.add(beam);
        const panel = new THREE.Mesh(
          new THREE.PlaneGeometry(1.9, 1.9),
          new THREE.MeshBasicMaterial({
            map: makePanelTexture(q.options[lane]),
            transparent: true,
          }),
        );
        panel.position.set(x, 2.25, 0.02);
        group.add(panel);
        panels.push(panel);
      }
      group.position.z = -d;
      t.course.add(group);
      t.gates.push({ d, group, panels, q, asked: false, resolved: false });
    };

    // finish arch
    const finish = new THREE.Group();
    const finMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.6 });
    for (const s of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5, 10), finMat);
      post.position.set(5.4 * s, 2.5, 0);
      finish.add(post);
    }
    const bannerTex = makeTextSprite("🏁 FINISH 🏁", "900 84px 'Comic Sans MS', sans-serif");
    const banner = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 1.9),
      new THREE.MeshBasicMaterial({ map: bannerTex, transparent: true }),
    );
    banner.position.set(0, 4.4, 0);
    finish.add(banner);
    finish.position.z = -COURSE_END;
    t.course.add(finish);
    t.finishD = COURSE_END;

    // layout: coins → obstacle → coins → gate, repeated
    let obstacleKind: "log" | "branch" = "log";
    for (let i = 0; i < GATE_COUNT; i++) {
      const gd = FIRST_GATE + i * GATE_SPACING;
      addCoins(gd - 22, rand(3));
      addObstacle(gd - 12, obstacleKind);
      obstacleKind = obstacleKind === "log" ? "branch" : "log";
      addGate(gd, bandRef.current.make());
    }
    addCoins(COURSE_END - 12, 1);
  }, []);

  // -------------------------------------------------------------- gameplay --
  const finishRun = useCallback(() => {
    const s = statsRef.current;
    stopMusic();
    sfx.fanfare();
    say(
      levelRef.current === 1
        ? "Hooray! You finished level one! Kali is waiting for you in level two!"
        : "Amazing! You finished level two! Put both hands up in the air!",
      { interrupt: true },
    );
    setQuestion(null);
    setFeedback(null);
    setFinalStats({ ...s, byDomain: { ...s.byDomain } });
    setPhaseBoth("complete");
    logEvent({ game: "kalqy-world", type: "session-end", label: `level-${levelRef.current}` });
    if (!completedRef.current) {
      completedRef.current = true;
      const stars = Math.max(1, Math.round((s.correct / Math.max(1, s.total)) * 5));
      onComplete?.({
        stars,
        correct: s.correct,
        total: s.total,
        coins: s.coins,
        movements: { Jump: s.jumps, Squat: s.squats, Walk: s.sideSteps },
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
      vel[i * 3 + 1] = 4 + Math.random() * 5;
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
        spawnConfetti(LANE_X[lane], 2.2, 0.5);
        setFeedback({ ok: true, text: q.praise });
        runRef.current.spinUntil = runRef.current.clock + 0.7; // victory twirl
      } else {
        sfx.mud();
        // Tell the child what THEY picked, then re-teach the right answer.
        const chosen = q.labels[lane];
        const wrongMsg = `You chose ${chosen}. ${q.teach}`;
        say(wrongMsg, { interrupt: true });
        setFeedback({ ok: false, text: wrongMsg });
      }
      logEvent({
        game: "kalqy-world",
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

  // main frame tick — runs via renderer.setAnimationLoop
  const lastTsRef = useRef(0);
  const tick = useCallback(() => {
    const t = threeRef.current;
    if (!t) return;
    const now = performance.now();
    const dt = Math.min(0.05, (now - lastTsRef.current) / 1000 || 0.016);
    lastTsRef.current = now;
    const r = runRef.current;
    r.clock += dt;

    // clouds always drift, even in the menu
    for (const cl of t.clouds) {
      cl.position.x += dt * 0.4;
      if (cl.position.x > 46) cl.position.x = -46;
    }

    const playing = phaseRef.current === "playing";
    const sig = signalsRef.current;

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

        // ---- stop-and-point answering at question gates ----
        if (!r.answering && nextGate?.asked && nextGate.d - r.traveled <= 8) {
          r.answering = true;
          r.pickCand = null;
          r.pickSince = r.clock;
          r.remindAt = r.clock + 8;
          setPointMode(true);
          say("Stop! Raise one hand and point to your answer. Hold it there!", {
            interrupt: false,
          });
        }
        if (r.answering && nextGate) {
          const cand = useBody ? (sig.pick === null ? null : 1 + sig.pick) : keys.lane;
          if (cand !== r.pickCand) {
            r.pickCand = cand;
            r.pickSince = r.clock;
            if (cand !== null) sfx.click();
          }
          if (cand !== null) {
            r.lane = cand; // the fox steps toward the pointed panel
            const dwell = useBody ? 1.2 : 2.2; // keyboard gets extra thinking time
            if (r.clock - r.pickSince > dwell) {
              r.answering = false;
              r.pickCand = null;
              setPointMode(false);
              nextGate.panels.forEach((p) => p.scale.setScalar(1));
              statsRef.current.reaches++;
              logEvent({
                game: "kalqy-world",
                type: "movement",
                skill: "coordination",
                value: 0.6,
              });
              resolveGate(nextGate, cand);
            }
          } else if (r.clock > r.remindAt) {
            r.remindAt = r.clock + 8;
            say("Raise one hand up and point left, middle, or right!");
          }
          // pulse the panel the child is pointing at
          nextGate.panels.forEach((p, i) => {
            const target = i === cand ? 1.18 + Math.sin(r.clock * 9) * 0.05 : 1;
            p.scale.setScalar(p.scale.x + (target - p.scale.x) * Math.min(1, dt * 10));
          });
        }

        // ---- controls: body when calibrated, arrow keys otherwise ----
        if (!r.answering) {
          const targetLane = useBody ? 1 + sig.lean : keys.lane; // step left/right = move
          if (targetLane !== r.lane) {
            r.lane = targetLane;
            statsRef.current.sideSteps++;
          }
        }
        keys.lane = r.lane; // keep keyboard lane in sync after hand picks

        const wantsJump = (useBody && sig.jumpCount !== r.lastJumpCount) || keys.up;
        r.lastJumpCount = sig.jumpCount;
        keys.up = false;
        if (wantsJump && !r.airborne && !r.answering) {
          r.airborne = true;
          r.vy = JUMP_V;
          statsRef.current.jumps++;
          sfx.jump();
          logEvent({ game: "kalqy-world", type: "movement", skill: "balance", value: 0.6 });
        }

        const duckNow = ((useBody && sig.duck) || keys.down) && !r.airborne && !r.answering;
        if (duckNow && !r.ducking) {
          statsRef.current.squats++;
          sfx.duck();
          logEvent({ game: "kalqy-world", type: "movement", skill: "bodyAwareness", value: 0.6 });
        }
        r.ducking = duckNow;

        // ---- physics + travel ----
        if (r.airborne) {
          r.y += r.vy * dt;
          r.vy -= GRAVITY * dt;
          if (r.y <= 0) {
            r.y = 0;
            r.airborne = false;
            r.landAt = r.clock; // triggers the landing squash
          }
        }
        let slow = r.clock < r.slowUntil ? 0.35 : 1;
        // Ease down while nearing a question gate, and stop fully to answer.
        if (nextGate && !nextGate.resolved) {
          const ahead = nextGate.d - r.traveled;
          if (ahead > 0 && ahead < 18) slow = Math.min(slow, 0.3 + 0.7 * (ahead / 18));
        }
        if (r.answering) slow = 0;
        const speed = RUN_SPEED * r.speedMul * slow;
        r.curSpeed = speed;
        const prevTraveled = r.traveled;
        r.traveled += speed * dt;
        t.course.position.z = r.traveled;
        // scroll the track stripes toward the camera, same direction the
        // course objects move, so the ground never feels like it runs backward
        t.groundTex.offset.y = r.traveled / 11.8;
        for (const tree of t.trees) {
          tree.position.z += speed * dt;
          if (tree.position.z > 12) tree.position.z -= 135;
        }

        // ---- gates ----
        for (const gate of t.gates) {
          if (!gate.asked && r.traveled > gate.d - 22) {
            gate.asked = true;
            setQuestion(gate.q);
            say(gate.q.speak, { interrupt: true });
            logEvent({ game: "kalqy-world", type: "attempt", label: gate.q.domain });
          }
          if (!gate.resolved && prevTraveled < gate.d && r.traveled >= gate.d) {
            resolveGate(gate, r.lane);
          }
        }

        // ---- obstacles ----
        for (const ob of t.obstacles) {
          if (!ob.resolved && prevTraveled < ob.d && r.traveled >= ob.d) {
            ob.resolved = true;
            const cleared = ob.kind === "log" ? r.y > 0.45 : r.ducking;
            if (cleared) {
              sfx.coin();
              statsRef.current.coins++;
            } else {
              statsRef.current.bumps++;
              sfx.hit();
              say(ob.kind === "log" ? "Jump over the logs!" : "Squat down low under the branch!");
              r.slowUntil = r.clock + 0.8;
            }
          }
        }

        // ---- coins ----
        for (const c of t.coins) {
          if (!c.taken && c.lane === r.lane && Math.abs(r.traveled - c.d) < 0.9) {
            c.taken = true;
            c.mesh.visible = false;
            statsRef.current.coins++;
            sfx.coin();
          }
        }

        // ---- HUD progress (throttled) ----
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

    // ---- character animation (physically grounded) ----
    const fox = t.fox;
    const targetX = LANE_X[r.lane];
    const dx = targetX - fox.group.position.x;
    fox.group.position.x += dx * Math.min(1, dt * 9);

    // Stride phase advances with ACTUAL ground speed, so steps stay in sync
    // with the moving ground (no foot-sliding) and the run naturally winds
    // down to a standstill at question stops.
    const speedNow = playing ? r.curSpeed : 0;
    r.stridePhase += speedNow * 2.2 * dt;
    const stride = r.stridePhase;
    const runK = Math.min(1, speedNow / RUN_SPEED); // 0 = standing … 1 = full run

    // legs stride, arms pump opposite with a bent-elbow rest pose;
    // a slow idle sway takes over when standing still
    const idleSway = Math.sin(r.clock * 1.6) * 0.05 * (1 - runK);
    const swing = Math.sin(stride) * 0.75 * runK + idleSway;
    fox.legL.rotation.x = swing;
    fox.legR.rotation.x = -swing;
    fox.armL.rotation.x = r.airborne ? -2.4 : -0.2 - swing * 0.85;
    fox.armR.rotation.x = r.airborne ? -2.4 : -0.2 + swing * 0.85;

    // two footfalls per stride cycle drive the bounce; breathing when idle
    const bob =
      runK > 0.02
        ? Math.abs(Math.sin(stride)) * 0.09 * runK
        : 0.015 + Math.sin(r.clock * 2.2) * 0.015;
    fox.group.position.y = r.y + bob;

    // squash & stretch: stretch on the way up, squash briefly on landing
    let sy = 1;
    let sxz = 1;
    if (r.airborne) {
      const k = THREE.MathUtils.clamp(r.vy / JUMP_V, -1, 1);
      sy = 1 + 0.12 * k;
      sxz = 1 - 0.07 * k;
    } else if (r.landAt >= 0) {
      const since = r.clock - r.landAt;
      if (since < 0.22) {
        const e = 1 - since / 0.22;
        sy = 1 - 0.18 * e;
        sxz = 1 + 0.1 * e;
      }
    }
    const duckY = r.ducking ? 0.55 : 1;
    fox.body.scale.y += (duckY * sy - fox.body.scale.y) * Math.min(1, dt * 14);
    fox.body.scale.x += (sxz - fox.body.scale.x) * Math.min(1, dt * 14);
    fox.body.scale.z = fox.body.scale.x;

    // posture: lean into the run, crouch forward when ducking, tuck mid-air
    const leanFwd = 0.1 * runK + (r.ducking ? 0.4 : 0) + (r.airborne ? 0.28 : 0);
    fox.body.rotation.x += (leanFwd - fox.body.rotation.x) * Math.min(1, dt * 10);
    // step-synced torso roll & counter-sway, plus banking into lane changes
    fox.body.rotation.z = Math.sin(stride) * 0.05 * runK - dx * 0.14;
    fox.body.rotation.y = Math.sin(stride) * 0.06 * runK;

    // tail/braid wags with the stride and drags behind on lane changes
    fox.tail.rotation.y =
      Math.sin(stride + 0.6) * (0.18 + 0.32 * runK) +
      Math.sin(r.clock * 2.4) * 0.1 * (1 - runK) +
      dx * 0.5;
    const twitch = Math.max(0, Math.sin(r.clock * 1.7)) * 0.12;
    fox.earL.rotation.z = -0.25 + twitch + dx * 0.08;
    fox.earR.rotation.z = 0.25 - twitch + dx * 0.08;

    // victory spin after a correct answer (ease-out for a snappier twirl)
    if (r.clock < r.spinUntil) {
      const k = 1 - (r.spinUntil - r.clock) / 0.7;
      const eased = 1 - Math.pow(1 - k, 2.2);
      fox.group.rotation.y = Math.PI + eased * Math.PI * 2;
    } else {
      fox.group.rotation.y = Math.PI;
    }

    // gate panels float gently; coins bob and spin
    for (const gate of t.gates) {
      if (gate.resolved) continue;
      gate.panels.forEach((p, i) => {
        p.position.y = 2.25 + Math.sin(r.clock * 2 + i * 2.1) * 0.09;
      });
    }
    for (const c of t.coins) {
      if (!c.taken) c.mesh.position.y = 1.0 + Math.sin(r.clock * 4 + c.d) * 0.12;
    }
    // trees sway in the breeze
    for (let i = 0; i < t.trees.length; i++) {
      t.trees[i].rotation.z = Math.sin(r.clock * 1.4 + i * 1.3) * 0.035;
    }
    // camera: gently follows the lane with a step-synced bob — feels handheld
    t.camera.position.x +=
      (fox.group.position.x * 0.35 - t.camera.position.x) * Math.min(1, dt * 3.5);
    t.camera.position.y = 4.6 + Math.sin(stride * 0.5) * 0.06 * runK;
    t.camera.lookAt(fox.group.position.x * 0.5, 1.4, -14);

    // celebrate on the finish screen when both hands go up
    if (phaseRef.current === "complete" && sig.handsUp && r.clock > r.slowUntil) {
      r.slowUntil = r.clock + 1.2;
      spawnConfetti(fox.group.position.x, 2.4, 1);
      sfx.star();
    }

    // ---- confetti ----
    for (let i = t.confetti.length - 1; i >= 0; i--) {
      const cf = t.confetti[i];
      cf.life -= dt;
      const pos = cf.points.geometry.getAttribute("position") as THREE.BufferAttribute;
      for (let k = 0; k < pos.count; k++) {
        cf.vel[k * 3 + 1] -= 9 * dt;
        pos.setX(k, pos.getX(k) + cf.vel[k * 3] * dt);
        pos.setY(k, Math.max(0, pos.getY(k) + cf.vel[k * 3 + 1] * dt));
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

    // coins spin
    for (const c of t.coins) if (!c.taken) c.mesh.rotation.z += dt * 3;

    t.renderer.render(t.scene, t.camera);
  }, [finishRun, resolveGate, spawnConfetti]);

  const poseStatusRef = useRef<PoseStatus>("idle");
  useEffect(() => {
    poseStatusRef.current = poseStatus;
  }, [poseStatus]);
  const lostBodyRef = useRef(false);

  // keyboard fallback (also handy for testing without a camera)
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
    (b: BandDef, lvl: number = 1) => {
      audioInit();
      sfx.click();
      setBand(b);
      bandRef.current = b;
      setLevel(lvl);
      levelRef.current = lvl;
      threeRef.current?.applyLevel(lvl);
      statsRef.current = emptyStats();
      completedRef.current = false;
      runRef.current = {
        traveled: 0,
        lane: 1,
        y: 0,
        vy: 0,
        airborne: false,
        ducking: false,
        lastJumpCount: signalsRef.current.jumpCount,
        slowUntil: 0,
        spinUntil: 0,
        lastLean: 0,
        clock: runRef.current.clock,
        speedMul: lvl >= 2 ? 1.15 : 1,
        stridePhase: 0,
        curSpeed: 0,
        landAt: -1,
        answering: false,
        pickCand: null,
        pickSince: 0,
        remindAt: 0,
      };
      setPointMode(false);
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
        startMusic(0);
        runRef.current.lastJumpCount = signalsRef.current.jumpCount;
        setPhaseBoth("playing");
        logEvent({ game: "kalqy-world", type: "session-start", label: bandRef.current.id });
        say("Run, run, run! Step left and right to change lanes!", { interrupt: true });
      }
    }, 900);
  }, [setPhaseBoth]);

  const onCalibrated = useCallback(() => {
    setCalibrating(false);
    sfx.meterFull();
    say("I can see you! Get ready!", { interrupt: true });
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
      startMusic(0);
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
    <div className="relative h-screen w-full select-none overflow-hidden bg-sky-200">
      {/* 3D canvas */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* body tracking PiP */}
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
              {level === 1 ? "🦊" : "👧"} L{level}
            </div>
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

      {/* progress bar */}
      {showHud && (
        <div className="absolute left-1/2 top-14 z-20 w-[min(60vw,420px)] -translate-x-1/2 md:top-16">
          <div className="h-3 overflow-hidden rounded-full bg-card/70 shadow backdrop-blur">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
              style={{ width: `${hud.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* question banner */}
      {showHud && question && !feedback && (
        <div className="pointer-events-none absolute left-1/2 top-20 z-20 -translate-x-1/2 md:top-24">
          <div className="animate-bounce-soft rounded-3xl border-4 border-amber-300 bg-card/95 px-6 py-3 text-center shadow-xl backdrop-blur">
            <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              {DOMAIN_LABEL[question.domain]}
            </div>
            <div className="text-xl font-black text-foreground md:text-2xl">{question.prompt}</div>
            {pointMode && (
              <div className="mt-1 rounded-full bg-primary/15 px-3 py-1 text-xs font-black text-primary">
                👉 Raise a hand & point — hold it to choose!
              </div>
            )}
          </div>
        </div>
      )}

      {/* answer feedback */}
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

      {/* body lost overlay */}
      {phase === "playing" && lostBody && (
        <div className="absolute inset-0 z-40 grid place-items-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-3xl bg-card p-6 text-center shadow-2xl">
            <div className="text-5xl">🙈</div>
            <div className="mt-2 text-xl font-black text-foreground">Where did you go?</div>
            <div className="text-sm font-semibold text-muted-foreground">
              Step back in front of the camera to keep running!
            </div>
          </div>
        </div>
      )}

      {/* ---------------- menu ---------------- */}
      {phase === "menu" && (
        <div className="absolute inset-0 z-30 overflow-y-auto bg-gradient-to-b from-sky-300/80 via-transparent to-transparent">
          <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col items-center justify-center gap-5 px-4 py-16">
            <div className="text-center">
              <div className="text-5xl">🦊🌍</div>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-foreground drop-shadow md:text-5xl">
                Kalqy 3D World
              </h1>
              <p className="mt-1 text-sm font-bold text-foreground/80">
                Your body is the controller! Step, jump and squat to learn.
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
                  <div className="mt-1 text-[10px] font-bold text-muted-foreground">
                    🦊 Level 1: Kalqy's Forest · 👧 Level 2: Kali's Blossom Valley
                  </div>
                  <div className="mt-2 w-full rounded-full bg-primary px-4 py-2 text-center text-sm font-black text-primary-foreground shadow group-hover:scale-[1.02]">
                    Play ▶
                  </div>
                </button>
              ))}
            </div>

            <div className="grid w-full grid-cols-2 gap-2 rounded-3xl bg-card/80 p-4 text-center shadow-lg backdrop-blur md:grid-cols-5">
              {[
                ["🚶", "Step left & right", "change lane"],
                ["🦘", "Jump", "over logs"],
                ["🐸", "Squat", "under branches"],
                ["👉", "Point & hold", "to answer questions"],
                ["🙌", "Hands up", "to celebrate"],
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
              <Play className="h-4 w-4" /> Keep Running
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

      {/* ---------------- complete: analytics ---------------- */}
      {phase === "complete" && finalStats && (
        <div className="absolute inset-0 z-40 overflow-y-auto bg-black/55 backdrop-blur-sm">
          <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col items-center justify-center gap-4 px-4 py-10">
            <div className="w-full rounded-3xl bg-card p-6 shadow-2xl">
              <GameResultBanner won={finalStats.correct > 0} className="mb-6" />
              <div className="text-center">
                <h2 className="mt-1 text-2xl font-black text-foreground">
                  Level {level} complete!
                </h2>
                {level === 1 && (
                  <div className="mt-1 text-sm font-bold text-muted-foreground">
                    👧 Kali is waiting for you in Blossom Valley!
                  </div>
                )}
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
                    {Object.keys(finalStats.byDomain).length === 0 && (
                      <div className="text-xs text-muted-foreground">No questions this run</div>
                    )}
                  </div>
                </div>
                <div className="rounded-2xl bg-secondary/60 p-4">
                  <div className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    🏃 Physical Indicators
                  </div>
                  <div className="mt-2 flex flex-col gap-1.5 text-sm font-bold text-foreground">
                    <div className="flex justify-between">
                      <span>🦘 Jumps (balance)</span>
                      <span>{finalStats.jumps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🐸 Squats (body awareness)</span>
                      <span>{finalStats.squats}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🚶 Side steps (coordination)</span>
                      <span>{finalStats.sideSteps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>👉 Hand points (reach)</span>
                      <span>{finalStats.reaches}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>💨 Obstacles cleared</span>
                      <span>
                        {GATE_COUNT - finalStats.bumps}/{GATE_COUNT}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {level === 1 && (
                  <button
                    onClick={() => startRun(band, 2)}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500 px-6 py-3 font-black text-white shadow-lg transition-transform hover:scale-105"
                  >
                    👧 Level 2 with Kali ▶
                  </button>
                )}
                <button
                  onClick={() => startRun(band, level)}
                  className={`flex items-center gap-2 rounded-full px-6 py-3 font-black shadow transition-transform hover:scale-105 ${
                    level === 1
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <RotateCw className="h-4 w-4" /> Play Again
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
