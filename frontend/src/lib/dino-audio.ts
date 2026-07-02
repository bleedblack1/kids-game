// Audio engine for Dino Adventure Run: WebAudio SFX, per-world background
// music (tiny step sequencer) and cheerful voice guidance via speechSynthesis.
// Everything is generated in code — no audio assets to load.

const MUTE_KEY = "kalqy.dino.muted";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicGain: GainNode | null = null;
let mutedFlag = loadMuted();

function loadMuted(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(MUTE_KEY) === "1";
}

export function isMuted() {
  return mutedFlag;
}

export function setMuted(m: boolean) {
  mutedFlag = m;
  if (typeof window !== "undefined") window.localStorage.setItem(MUTE_KEY, m ? "1" : "0");
  if (master) master.gain.value = m ? 0 : 1;
  if (m && typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

// Must be called from a user gesture (Start button) so audio can play.
export function audioInit() {
  if (typeof window === "undefined") return;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = mutedFlag ? 0 : 1;
    master.connect(ctx.destination);
    musicGain = ctx.createGain();
    musicGain.gain.value = 0.55;
    musicGain.connect(master);
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
}

interface ToneOpts {
  freq: number;
  dur?: number;
  type?: OscillatorType;
  vol?: number;
  slide?: number; // target freq to glide to
  when?: number; // absolute AudioContext time
  dest?: AudioNode;
}

function tone({ freq, dur = 0.15, type = "sine", vol = 0.2, slide, when, dest }: ToneOpts) {
  if (!ctx || !master) return;
  const t0 = when ?? ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, slide), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g);
  g.connect(dest ?? master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function noise(dur = 0.2, vol = 0.15, when?: number) {
  if (!ctx || !master) return;
  const t0 = when ?? ctx.currentTime;
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 900;
  src.connect(filter);
  filter.connect(g);
  g.connect(master);
  src.start(t0);
}

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

export const sfx = {
  click() {
    tone({ freq: 660, dur: 0.08, type: "triangle", vol: 0.15 });
  },
  jump() {
    tone({ freq: 320, slide: 720, dur: 0.22, type: "square", vol: 0.08 });
  },
  duck() {
    tone({ freq: 500, slide: 220, dur: 0.16, type: "triangle", vol: 0.1 });
  },
  coin() {
    tone({ freq: midi(88), dur: 0.09, type: "triangle", vol: 0.16 });
    tone({
      freq: midi(93),
      dur: 0.14,
      type: "triangle",
      vol: 0.16,
      when: ctx ? ctx.currentTime + 0.07 : undefined,
    });
  },
  egg() {
    tone({ freq: midi(76), dur: 0.12, type: "sine", vol: 0.2 });
    tone({
      freq: midi(83),
      dur: 0.18,
      type: "sine",
      vol: 0.18,
      when: ctx ? ctx.currentTime + 0.09 : undefined,
    });
  },
  gem() {
    const base = ctx?.currentTime ?? 0;
    [84, 88, 91, 96].forEach((n, i) =>
      tone({ freq: midi(n), dur: 0.14, type: "triangle", vol: 0.14, when: base + i * 0.06 }),
    );
  },
  star() {
    const base = ctx?.currentTime ?? 0;
    [79, 84, 88, 91, 96, 100].forEach((n, i) =>
      tone({ freq: midi(n), dur: 0.16, type: "sine", vol: 0.13, when: base + i * 0.05 }),
    );
  },
  hit() {
    noise(0.25, 0.25);
    tone({ freq: 180, slide: 60, dur: 0.3, type: "sawtooth", vol: 0.12 });
  },
  splash() {
    noise(0.4, 0.2);
    tone({ freq: 400, slide: 120, dur: 0.3, type: "sine", vol: 0.1 });
  },
  mud() {
    noise(0.3, 0.15);
    tone({ freq: 140, slide: 90, dur: 0.25, type: "triangle", vol: 0.12 });
  },
  heart() {
    tone({ freq: midi(72), dur: 0.12, type: "sine", vol: 0.18 });
    tone({
      freq: midi(79),
      dur: 0.2,
      type: "sine",
      vol: 0.16,
      when: ctx ? ctx.currentTime + 0.1 : undefined,
    });
  },
  meterFull() {
    const base = ctx?.currentTime ?? 0;
    [72, 76, 79, 84, 88].forEach((n, i) =>
      tone({ freq: midi(n), dur: 0.14, type: "square", vol: 0.07, when: base + i * 0.07 }),
    );
  },
  countdown() {
    tone({ freq: 520, dur: 0.16, type: "triangle", vol: 0.18 });
  },
  go() {
    tone({ freq: 660, dur: 0.12, type: "triangle", vol: 0.2 });
    tone({
      freq: 880,
      dur: 0.3,
      type: "triangle",
      vol: 0.2,
      when: ctx ? ctx.currentTime + 0.1 : undefined,
    });
  },
  chest() {
    const base = ctx?.currentTime ?? 0;
    [67, 71, 74, 79, 83, 86, 91].forEach((n, i) =>
      tone({ freq: midi(n), dur: 0.16, type: "triangle", vol: 0.12, when: base + i * 0.06 }),
    );
  },
  fanfare() {
    const base = ctx?.currentTime ?? 0;
    const seq: [number, number, number][] = [
      [72, 0, 0.18],
      [72, 0.18, 0.18],
      [72, 0.36, 0.18],
      [76, 0.54, 0.34],
      [74, 0.92, 0.18],
      [76, 1.1, 0.5],
    ];
    for (const [n, at, d] of seq) {
      tone({ freq: midi(n), dur: d, type: "square", vol: 0.08, when: base + at });
      tone({ freq: midi(n + 12), dur: d, type: "triangle", vol: 0.1, when: base + at });
    }
  },
};

// ---------- Background music: a tiny per-world step sequencer ----------

interface Song {
  tempo: number; // BPM
  wave: OscillatorType;
  root: number; // midi root of melody
  melody: number[]; // 16 steps of scale degrees (or -1 for rest)
  scale: number[];
}

const SONGS: Song[] = [
  // Green Forest — bouncy major
  {
    tempo: 108,
    wave: "triangle",
    root: 72,
    scale: [0, 2, 4, 7, 9],
    melody: [0, 2, 4, 2, 0, 4, 2, -1, 3, 2, 1, 2, 4, 3, 2, -1],
  },
  // River Valley — flowing
  {
    tempo: 100,
    wave: "sine",
    root: 74,
    scale: [0, 2, 4, 5, 7, 9],
    melody: [0, 2, 3, 4, 5, 4, 3, 2, 0, 2, 3, 4, 2, 1, 0, -1],
  },
  // Volcano Land — adventurous
  {
    tempo: 122,
    wave: "square",
    root: 69,
    scale: [0, 3, 5, 7, 10],
    melody: [0, 0, 2, 0, 3, 2, 1, 0, 0, 2, 3, 4, 3, 2, 1, -1],
  },
  // Snow World — twinkly
  {
    tempo: 92,
    wave: "sine",
    root: 79,
    scale: [0, 2, 4, 7, 9],
    melody: [4, 2, 0, 2, 4, 4, 4, -1, 2, 2, 2, -1, 4, 7, 4, -1],
  },
  // Candy Land — sugary happy
  {
    tempo: 126,
    wave: "triangle",
    root: 76,
    scale: [0, 2, 4, 5, 7, 9],
    melody: [0, 4, 2, 4, 5, 4, 2, 0, 1, 2, 3, 4, 5, 4, 2, -1],
  },
];

let musicTimer: ReturnType<typeof setInterval> | null = null;
let step = 0;
let nextStepTime = 0;
let currentSong: Song | null = null;

export function startMusic(worldIdx: number) {
  stopMusic();
  if (!ctx || !musicGain) return;
  currentSong = SONGS[worldIdx % SONGS.length];
  step = 0;
  nextStepTime = ctx.currentTime + 0.1;
  musicTimer = setInterval(() => {
    if (!ctx || !currentSong || !musicGain) return;
    const stepDur = 60 / currentSong.tempo / 2; // 8th notes
    while (nextStepTime < ctx.currentTime + 0.25) {
      const s = currentSong;
      const deg = s.melody[step % 16];
      if (deg >= 0) {
        const note = s.root + s.scale[deg % s.scale.length] + 12 * Math.floor(deg / s.scale.length);
        tone({
          freq: midi(note),
          dur: stepDur * 0.9,
          type: s.wave,
          vol: 0.055,
          when: nextStepTime,
          dest: musicGain,
        });
      }
      if (step % 4 === 0) {
        const bassNote = s.root - 24 + (step % 8 === 0 ? 0 : 7);
        tone({
          freq: midi(bassNote),
          dur: stepDur * 1.6,
          type: "sine",
          vol: 0.09,
          when: nextStepTime,
          dest: musicGain,
        });
      }
      nextStepTime += stepDur;
      step++;
    }
  }, 80);
}

export function stopMusic() {
  if (musicTimer) clearInterval(musicTimer);
  musicTimer = null;
  currentSong = null;
}

// ---------- Voice guidance ----------

let cachedVoice: SpeechSynthesisVoice | null = null;

function pickVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  cachedVoice =
    voices.find((v) => /en/i.test(v.lang) && /google.*(us|uk).*english/i.test(v.name)) ||
    voices.find((v) => /en/i.test(v.lang) && /female|kid|child|samantha|zira/i.test(v.name)) ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    voices[0];
  return cachedVoice;
}

export function say(text: string, opts?: { interrupt?: boolean }) {
  if (mutedFlag) return;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    if (opts?.interrupt) window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice();
    if (v) u.voice = v;
    u.pitch = 1.35;
    u.rate = 1.05;
    u.volume = 1;
    window.speechSynthesis.speak(u);
  } catch {
    /* voice is a nice-to-have */
  }
}
