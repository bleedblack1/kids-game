import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Camera, RotateCcw, Star } from "lucide-react";
import { logEvent } from "@/lib/analytics";
import { addCoins, tickStreak, unlockSticker } from "@/lib/rewards";

interface Props {
  onBack: () => void;
  onComplete?: (stars: number) => void;
}

type WordItem = { word: string; emoji: string };

// Beginner-friendly vocabulary. Sessions ramp difficulty by word length.
const WORD_BANK: WordItem[] = [
  { word: "SUN", emoji: "☀️" },
  { word: "CAT", emoji: "🐱" },
  { word: "DOG", emoji: "🐶" },
  { word: "BUS", emoji: "🚌" },
  { word: "BALL", emoji: "⚽" },
  { word: "FISH", emoji: "🐟" },
  { word: "KITE", emoji: "🪁" },
  { word: "STAR", emoji: "⭐" },
  { word: "TREE", emoji: "🌳" },
  { word: "DUCK", emoji: "🦆" },
  { word: "MOON", emoji: "🌙" },
  { word: "LION", emoji: "🦁" },
  { word: "APPLE", emoji: "🍎" },
  { word: "MANGO", emoji: "🥭" },
  { word: "TIGER", emoji: "🐯" },
  { word: "CHAIR", emoji: "🪑" },
  { word: "TABLE", emoji: "🪵" },
  { word: "HOUSE", emoji: "🏠" },
  { word: "RABBIT", emoji: "🐰" },
  { word: "FLOWER", emoji: "🌸" },
];

const WORDS_PER_SESSION = 5;
const OPTIONS_PER_ROUND = 8;
// Unhurried pacing for little hands: dwell time to select, cooldown between
// selections, and cursor smoothing (lower = slower, steadier cursor).
const HOVER_MS = 1800;
const ACTIVATE_COOLDOWN_MS = 1000;
const CURSOR_SMOOTHING = 0.22;

const PRAISE = ["🎉 Excellent!", "🌟 Great Job!", "✨ Awesome!"];
const SPELL_PRAISE = ["Amazing!", "Fantastic!", "Super speller!"];

function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.92;
    u.pitch = 1.15;
    window.speechSynthesis.speak(u);
  } catch {
    // speech unsupported
  }
}

function playTone(freq: number, duration = 0.2, type: OscillatorType = "sine") {
  try {
    const Ctx = (window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext) as
      typeof AudioContext | undefined;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.05);
  } catch {
    // audio unsupported
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickSessionWords(): WordItem[] {
  return shuffle(WORD_BANK)
    .slice(0, WORDS_PER_SESSION)
    .sort((a, b) => a.word.length - b.word.length);
}

function pickOptions(target: WordItem): WordItem[] {
  const decoys = shuffle(WORD_BANK.filter((w) => w.word !== target.word)).slice(
    0,
    OPTIONS_PER_ROUND - 1,
  );
  return shuffle([target, ...decoys]);
}

type Tile = { id: number; char: string; slot: number | null; locked: boolean; wrong: boolean };

function makeTiles(word: string): Tile[] {
  const chars = shuffle(word.split(""));
  // Reshuffle if the bank accidentally spells the word already.
  if (chars.join("") === word && word.length > 1) {
    [chars[0], chars[chars.length - 1]] = [chars[chars.length - 1], chars[0]];
  }
  return chars.map((char, id) => ({ id, char, slot: null, locked: false, wrong: false }));
}

type Status = "idle" | "loading" | "ready" | "denied" | "error";
type Mode = "find" | "spell" | "end";

type Frame = { x: number; y: number; pinch: boolean } | null;

export function PointAndSpell({ onBack, onComplete }: Props) {
  const [mode, setMode] = useState<Mode>("find");
  const [sessionWords, setSessionWords] = useState<WordItem[]>(() => pickSessionWords());
  const [wordIndex, setWordIndex] = useState(0);
  const [options, setOptions] = useState<WordItem[]>([]);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [heldTile, setHeldTile] = useState<number | null>(null);
  const [stars, setStars] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [mascotMsg, setMascotMsg] = useState("Show your hand to the camera!");
  const [wrongPick, setWrongPick] = useState<string | null>(null);
  const [correctPick, setCorrectPick] = useState<string | null>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [handVisible, setHandVisible] = useState(false);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [hoverProgress, setHoverProgress] = useState(0);
  const [hoverHit, setHoverHit] = useState<string | null>(null);
  const [pinched, setPinched] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const landmarkerRef = useRef<{
    detectForVideo: (
      v: HTMLVideoElement,
      ts: number,
    ) => { landmarks?: { x: number; y: number }[][] };
    close?: () => void;
  } | null>(null);
  const lastVideoTimeRef = useRef(-1);
  const playAreaRef = useRef<HTMLDivElement | null>(null);

  const hoverIdRef = useRef<string | null>(null);
  const hoverStartRef = useRef<number>(0);
  const smoothCursorRef = useRef<{ x: number; y: number } | null>(null);
  const pinchWasDownRef = useRef(false);
  const lastActivateRef = useRef(0);
  const lockedRef = useRef(false);

  const target = sessionWords[wordIndex];

  // ----- Round setup -----

  const startFindRound = useCallback((word: WordItem) => {
    setMode("find");
    setOptions(pickOptions(word));
    setWrongPick(null);
    setCorrectPick(null);
    setHeldTile(null);
    const line = `Find the ${word.word.toLowerCase()}!`;
    setMascotMsg(line);
    setTimeout(() => speak(line), 400);
  }, []);

  useEffect(() => {
    logEvent({ game: "point-spell", type: "session-start" });
    tickStreak();
    startFindRound(sessionWords[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- Game actions -----

  const selectObject = useCallback(
    (word: string) => {
      if (lockedRef.current || mode !== "find" || !target) return;
      if (word === target.word) {
        lockedRef.current = true;
        setCorrectPick(word);
        setConfetti(true);
        const praise = PRAISE[Math.floor(Math.random() * PRAISE.length)];
        setMascotMsg(`${praise} Let's spell it!`);
        speak(`${praise.replace(/[^\w\s!']/g, "")} Let's spell it!`);
        playTone(880, 0.15);
        setTimeout(() => playTone(1320, 0.2), 130);
        logEvent({ game: "point-spell", type: "correct", skill: "vocabulary" });
        setTimeout(() => {
          setConfetti(false);
          setCorrectPick(null);
          setTiles(makeTiles(target.word));
          setHeldTile(null);
          setMode("spell");
          setMascotMsg(`Drag the letters to spell ${target.word}!`);
          lockedRef.current = false;
        }, 2600);
      } else {
        setWrongPick(word);
        setMascotMsg("Oops! Try again.");
        speak("Oops! Try again.");
        playTone(330, 0.2, "triangle");
        logEvent({ game: "point-spell", type: "wrong", skill: "vocabulary" });
        setTimeout(() => setWrongPick(null), 900);
      }
    },
    [mode, target],
  );

  const finishWord = useCallback(() => {
    setStars((s) => s + 1);
    setConfetti(true);
    addCoins(2, { game: "point-spell", label: "word" });
    const praise = SPELL_PRAISE[Math.floor(Math.random() * SPELL_PRAISE.length)];
    setMascotMsg(`${praise} You spelled ${target.word} correctly! ⭐`);
    speak(`${praise} You spelled ${target.word.toLowerCase()} correctly!`);
    playTone(880, 0.12);
    setTimeout(() => playTone(1100, 0.12), 120);
    setTimeout(() => playTone(1320, 0.25), 240);
    logEvent({ game: "point-spell", type: "correct", skill: "vocabulary", label: target.word });
    if (wordIndex + 1 >= 3) unlockSticker("spelling-champ", "point-spell");
    // Advance by absolute index so an accidental double call can't skip a
    // word and leave the screen graded against the wrong target.
    const nextIndex = wordIndex + 1;
    setTimeout(() => {
      setConfetti(false);
      if (nextIndex >= sessionWords.length) {
        setMode("end");
        setMascotMsg("You finished all the words! 🏆");
        speak("You finished all the words! Hooray!");
        onComplete?.(stars + 1);
      } else {
        setWordIndex(nextIndex);
        startFindRound(sessionWords[nextIndex]);
      }
      lockedRef.current = false;
    }, 3200);
  }, [target, wordIndex, sessionWords, stars, onComplete, startFindRound]);

  const validateSpelling = useCallback(
    (placed: Tile[]) => {
      if (!target) return;
      lockedRef.current = true;
      const allCorrect = placed.every((t) => t.slot === null || t.char === target.word[t.slot]);
      if (allCorrect) {
        setTiles((ts) => ts.map((t) => ({ ...t, locked: true })));
        finishWord();
      } else {
        setMascotMsg("Almost! Try again.");
        speak("Almost! Try again.");
        playTone(330, 0.2, "triangle");
        logEvent({ game: "point-spell", type: "wrong", skill: "vocabulary", label: target.word });
        // Lock the correct letters, flag the wrong ones red.
        setTiles((ts) =>
          ts.map((t) => {
            if (t.slot === null) return t;
            return t.char === target.word[t.slot] ? { ...t, locked: true } : { ...t, wrong: true };
          }),
        );
        // Then send only the wrong letters back to the bank.
        setTimeout(() => {
          setTiles((ts) => ts.map((t) => (t.wrong ? { ...t, slot: null, wrong: false } : t)));
          lockedRef.current = false;
        }, 1600);
      }
    },
    [target, finishWord],
  );

  const grabTile = useCallback((tileId: number) => {
    setHeldTile(tileId);
    playTone(660, 0.08);
  }, []);

  const dropTile = useCallback(
    (slotIndex: number) => {
      if (heldTile === null) return;
      if (tiles.some((t) => t.slot === slotIndex)) return;
      playTone(760, 0.1);
      setHeldTile(null);
      // Compute the next tiles OUTSIDE the state updater: React may invoke
      // updater functions more than once, so side effects inside one (like
      // scheduling validation) can fire twice and double-advance the game.
      const next = tiles.map((t) => (t.id === heldTile ? { ...t, slot: slotIndex } : t));
      setTiles(next);
      if (next.every((t) => t.slot !== null)) {
        // All boxes filled — lock input now, check after the tile visually lands.
        lockedRef.current = true;
        setTimeout(() => validateSpelling(next), 350);
      }
    },
    [heldTile, tiles, validateSpelling],
  );

  // Central dispatcher: a hit id was activated by hover-dwell or pinch.
  const activate = useCallback(
    (hitId: string) => {
      if (lockedRef.current) return;
      if (mode === "find" && hitId.startsWith("opt:")) {
        selectObject(hitId.slice(4));
      } else if (mode === "spell") {
        if (hitId.startsWith("tile:")) {
          const id = Number(hitId.slice(5));
          const tile = tiles.find((t) => t.id === id);
          if (tile && !tile.locked) {
            if (tile.slot !== null) {
              // Pick a placed (unlocked) letter back up.
              setTiles((ts) => ts.map((t) => (t.id === id ? { ...t, slot: null } : t)));
            }
            grabTile(id);
          }
        } else if (hitId.startsWith("slot:") && heldTile !== null) {
          dropTile(Number(hitId.slice(5)));
        }
      }
    },
    [mode, tiles, heldTile, selectObject, grabTile, dropTile],
  );

  // ----- Hand tracking → cursor → hit testing -----
  // The rAF loop lives for the whole session, so it calls the latest frame
  // handler through a ref (never a captured closure).
  const onFrameRef = useRef<(f: Frame) => void>(() => {});

  const handleFrame = useCallback(
    (frame: Frame) => {
      if (!frame) {
        setHandVisible(false);
        setCursor(null);
        setHoverProgress(0);
        setHoverHit(null);
        setPinched(false);
        hoverIdRef.current = null;
        pinchWasDownRef.current = false;
        return;
      }
      setHandVisible(true);
      setCursor({ x: frame.x, y: frame.y });
      setPinched(frame.pinch);

      const area = playAreaRef.current;
      if (!area) return;
      const rect = area.getBoundingClientRect();
      const clientX = rect.left + frame.x * rect.width;
      const clientY = rect.top + frame.y * rect.height;
      const el = document.elementFromPoint(clientX, clientY);
      const hit = (el?.closest("[data-hit]") as HTMLElement | null)?.dataset.hit ?? null;
      setHoverHit(lockedRef.current ? null : hit);

      const now = performance.now();

      // Pinch: activate on the pinch-down edge, with a cooldown.
      if (frame.pinch && !pinchWasDownRef.current) {
        pinchWasDownRef.current = true;
        if (hit && now - lastActivateRef.current > ACTIVATE_COOLDOWN_MS) {
          lastActivateRef.current = now;
          hoverIdRef.current = null;
          setHoverProgress(0);
          activate(hit);
          return;
        }
      }
      if (!frame.pinch) pinchWasDownRef.current = false;

      // Hover dwell.
      if (!hit || lockedRef.current) {
        hoverIdRef.current = null;
        setHoverProgress(0);
        return;
      }
      if (hoverIdRef.current !== hit) {
        hoverIdRef.current = hit;
        hoverStartRef.current = now;
        setHoverProgress(0);
        return;
      }
      const elapsed = now - hoverStartRef.current;
      setHoverProgress(Math.min(1, elapsed / HOVER_MS));
      if (elapsed >= HOVER_MS && now - lastActivateRef.current > ACTIVATE_COOLDOWN_MS) {
        lastActivateRef.current = now;
        hoverIdRef.current = null;
        setHoverProgress(0);
        activate(hit);
      }
    },
    [activate],
  );

  useEffect(() => {
    onFrameRef.current = handleFrame;
  }, [handleFrame]);

  // ----- Camera / MediaPipe -----

  const initLandmarker = useCallback(async () => {
    if (landmarkerRef.current) return landmarkerRef.current;
    const { FilesetResolver, HandLandmarker } = await import("@mediapipe/tasks-vision");
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm",
    );
    const landmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 1,
    });
    landmarkerRef.current = landmarker;
    return landmarker;
  }, []);

  const loop = useCallback(() => {
    const tick = () => {
      const video = videoRef.current;
      const landmarker = landmarkerRef.current;
      if (!video || !landmarker) return;
      if (
        !document.hidden &&
        video.readyState >= 2 &&
        video.currentTime !== lastVideoTimeRef.current
      ) {
        lastVideoTimeRef.current = video.currentTime;
        try {
          const result = landmarker.detectForVideo(video, performance.now());
          const lm = result?.landmarks?.[0];
          if (lm && lm.length >= 21) {
            // Mirror x so the cursor follows the on-screen (selfie) view.
            const tip = lm[8];
            const thumb = lm[4];
            const palm = Math.hypot(lm[0].x - lm[9].x, lm[0].y - lm[9].y) || 0.001;
            const pinch = Math.hypot(tip.x - thumb.x, tip.y - thumb.y) < palm * 0.4;
            const rawX = Math.min(1, Math.max(0, 1 - tip.x));
            const rawY = Math.min(1, Math.max(0, tip.y));
            // Ease the cursor toward the fingertip so it glides instead of
            // jumping — steadier and calmer for small hands.
            const prev = smoothCursorRef.current;
            const x = prev ? prev.x + (rawX - prev.x) * CURSOR_SMOOTHING : rawX;
            const y = prev ? prev.y + (rawY - prev.y) * CURSOR_SMOOTHING : rawY;
            smoothCursorRef.current = { x, y };
            onFrameRef.current({ x, y, pinch });
          } else {
            smoothCursorRef.current = null;
            onFrameRef.current(null);
          }
        } catch {
          // transient detector error
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const startCamera = useCallback(async () => {
    setStatus("loading");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      await initLandmarker();
      setStatus("ready");
      loop();
    } catch (err) {
      console.error("Camera error", err);
      const name = (err as { name?: string })?.name;
      if (name === "NotAllowedError" || name === "SecurityError") setStatus("denied");
      else setStatus("error");
    }
  }, [initLandmarker, loop]);

  const stopCamera = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    try {
      landmarkerRef.current?.close?.();
    } catch {
      // already closed
    }
    landmarkerRef.current = null;
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      window.speechSynthesis?.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const restart = () => {
    const words = pickSessionWords();
    setSessionWords(words);
    setWordIndex(0);
    setStars(0);
    lockedRef.current = false;
    startFindRound(words[0]);
  };

  const progressPct = Math.round(
    ((wordIndex + (mode === "end" ? 1 : 0)) / sessionWords.length) * 100,
  );
  const heldTileObj = heldTile !== null ? tiles.find((t) => t.id === heldTile) : null;
  const paused = status === "ready" && !handVisible && mode !== "end";

  return (
    <div className="relative min-h-full overflow-hidden bg-gradient-to-b from-sunshine/25 via-background to-sky/30">
      {/* Floating background decorations */}
      <div className="pointer-events-none absolute inset-0 select-none overflow-hidden" aria-hidden>
        {[
          { emoji: "☁️", left: "6%", top: "12%", size: "text-5xl", delay: "0s", dur: "5s" },
          { emoji: "☁️", left: "78%", top: "8%", size: "text-6xl", delay: "1.2s", dur: "6s" },
          { emoji: "⭐", left: "88%", top: "38%", size: "text-3xl", delay: "0.6s", dur: "4s" },
          { emoji: "🌈", left: "3%", top: "58%", size: "text-4xl", delay: "1.8s", dur: "5.5s" },
          { emoji: "🎈", left: "92%", top: "68%", size: "text-4xl", delay: "0.3s", dur: "4.5s" },
          { emoji: "🦋", left: "12%", top: "82%", size: "text-3xl", delay: "2.2s", dur: "5s" },
        ].map((d, i) => (
          <span
            key={i}
            className={`animate-float absolute opacity-40 ${d.size}`}
            style={{ left: d.left, top: d.top, animationDelay: d.delay, animationDuration: d.dur }}
          >
            {d.emoji}
          </span>
        ))}
      </div>
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 md:px-8 md:py-8">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              window.speechSynthesis?.cancel();
              stopCamera();
              onBack();
            }}
            className="flex items-center gap-2 rounded-2xl bg-card px-4 py-2 text-sm font-bold text-foreground shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="flex items-center gap-3">
            {status === "ready" && (
              <span
                className={`flex items-center gap-1.5 rounded-2xl px-3 py-2 text-xs font-black shadow-sm ${
                  handVisible ? "bg-jungle/15 text-jungle" : "bg-card text-muted-foreground"
                }`}
              >
                <Camera className="h-3.5 w-3.5" />
                {handVisible ? "Camera Connected ✓" : "Show your hand ✋"}
              </span>
            )}
            <div className="flex items-center gap-3 rounded-2xl bg-card px-4 py-2 shadow-sm">
              <span className="text-sm font-black text-foreground">
                Word {Math.min(wordIndex + 1, sessionWords.length)} / {sessionWords.length}
              </span>
              <span className="flex items-center gap-1 text-sm font-black text-coral">
                <Star className="h-4 w-4 fill-current" />
                <span key={stars} className="animate-pop inline-block">
                  {stars}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Mascot */}
        <div className="mb-4 flex items-center gap-3">
          <div className="animate-bounce-soft grid h-14 w-14 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-sunshine to-coral text-3xl shadow-md">
            🦊
          </div>
          <div
            key={mascotMsg}
            className="animate-pop rounded-3xl rounded-bl-md bg-card px-5 py-3 text-lg font-black text-foreground shadow-sm"
          >
            {mascotMsg}
          </div>
        </div>

        {/* Play area (hand-cursor hit testing happens inside this box) */}
        <div ref={playAreaRef} className="relative flex-1">
          {mode === "find" && target && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-5">
              {options.map((opt, idx) => {
                const isWrong = wrongPick === opt.word;
                const isCorrect = correctPick === opt.word;
                const isHovered = hoverHit === `opt:${opt.word}`;
                return (
                  <div
                    key={opt.word}
                    data-hit={`opt:${opt.word}`}
                    style={{ animationDelay: `${idx * 70}ms`, animationFillMode: "backwards" }}
                    className={`animate-pop flex aspect-square flex-col items-center justify-center gap-1 rounded-3xl border-4 bg-card shadow-lg transition-all duration-200 ${
                      isCorrect
                        ? "scale-110 border-jungle ring-4 ring-jungle/50"
                        : isWrong
                          ? "animate-wiggle border-coral ring-4 ring-coral/40"
                          : isHovered
                            ? "-translate-y-2 scale-105 border-primary ring-4 ring-primary/30"
                            : "border-card"
                    }`}
                  >
                    <span
                      className={`text-5xl transition-transform duration-200 md:text-7xl ${
                        isCorrect
                          ? "animate-bounce-soft"
                          : isHovered
                            ? "scale-125"
                            : "animate-float"
                      }`}
                      style={{ animationDelay: isCorrect || isHovered ? "0s" : `${idx * 350}ms` }}
                    >
                      {opt.emoji}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {mode === "spell" && target && (
            <div className="flex flex-col items-center gap-6">
              {/* Big object image */}
              <div className="animate-pop flex flex-col items-center">
                <span className="animate-bounce-soft text-7xl md:text-8xl">{target.emoji}</span>
              </div>

              {/* Letter boxes */}
              <div className="flex flex-wrap justify-center gap-3">
                {target.word.split("").map((_, i) => {
                  const occupant = tiles.find((t) => t.slot === i);
                  const slotHovered = !occupant && hoverHit === `slot:${i}`;
                  const tileHovered = occupant && hoverHit === `tile:${occupant.id}`;
                  return (
                    <div
                      key={i}
                      data-hit={occupant ? undefined : `slot:${i}`}
                      style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}
                      className={`animate-pop grid h-16 w-16 place-items-center rounded-2xl border-4 text-3xl font-black shadow-inner transition-all duration-200 md:h-20 md:w-20 md:text-4xl ${
                        occupant?.locked
                          ? "border-jungle bg-jungle/15 text-jungle"
                          : occupant?.wrong
                            ? "animate-wiggle border-coral bg-coral/15 text-coral"
                            : occupant
                              ? tileHovered
                                ? "scale-110 border-primary bg-card text-foreground ring-4 ring-primary/30"
                                : "border-primary bg-card text-foreground"
                              : slotHovered && heldTile !== null
                                ? "scale-110 border-dashed border-jungle bg-jungle/15 ring-4 ring-jungle/30"
                                : heldTile !== null
                                  ? "animate-bounce-soft border-dashed border-primary bg-primary/10"
                                  : "border-dashed border-muted-foreground/40 bg-card/60"
                      }`}
                    >
                      {occupant ? (
                        occupant.locked ? (
                          <span className="animate-pop inline-block">{occupant.char}</span>
                        ) : (
                          <div
                            data-hit={`tile:${occupant.id}`}
                            className="animate-pop grid h-full w-full place-items-center rounded-xl text-inherit"
                          >
                            {occupant.char}
                          </div>
                        )
                      ) : null}
                    </div>
                  );
                })}
              </div>

              {/* Letter bank */}
              <div className="flex min-h-20 flex-wrap items-center justify-center gap-3 rounded-3xl bg-card/70 px-6 py-4 shadow-inner">
                {tiles.filter((t) => t.slot === null && t.id !== heldTile).length === 0 &&
                  heldTile === null && (
                    <span className="animate-pop text-sm font-bold text-muted-foreground">
                      All letters placed!
                    </span>
                  )}
                {tiles
                  .filter((t) => t.slot === null && t.id !== heldTile)
                  .map((t, idx) => {
                    const isHovered = hoverHit === `tile:${t.id}`;
                    return (
                      <div
                        key={t.id}
                        data-hit={`tile:${t.id}`}
                        style={{ animationDelay: `${idx * 80}ms`, animationFillMode: "backwards" }}
                        className={`animate-pop grid h-16 w-16 place-items-center rounded-2xl border-4 border-sunshine bg-sunshine/20 text-3xl font-black text-foreground shadow-md transition-all duration-200 md:h-20 md:w-20 md:text-4xl ${
                          isHovered ? "-translate-y-2 scale-110 ring-4 ring-sunshine/50" : ""
                        }`}
                      >
                        {t.char}
                      </div>
                    );
                  })}
              </div>
              <p className="text-center text-xs font-bold text-muted-foreground">
                Point at a letter to pick it up, then point at a box to drop it. Pinch 🤏 to grab
                faster!
              </p>
            </div>
          )}

          {mode === "end" && (
            <div className="flex h-full flex-1 items-center justify-center">
              <div className="animate-pop text-center">
                <div className="animate-bounce-soft mb-4 text-7xl">🏆</div>
                <h1 className="mb-2 text-4xl font-black text-foreground md:text-6xl">All done!</h1>
                <p className="mb-6 text-lg font-bold text-foreground/80">
                  You spelled {stars} word{stars === 1 ? "" : "s"}! ⭐
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={restart}
                    className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-lg font-black text-primary-foreground shadow-lg transition-all hover:scale-105 active:scale-95"
                  >
                    <RotateCcw className="h-4 w-4" /> Play Again
                  </button>
                  <button
                    onClick={() => {
                      stopCamera();
                      onBack();
                    }}
                    className="rounded-2xl bg-card px-6 py-3 text-lg font-black text-foreground shadow-lg transition-all hover:scale-105 active:scale-95"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Held letter follows the finger */}
          {heldTileObj && cursor && (
            <div
              className="animate-wiggle pointer-events-none absolute z-30 grid h-16 w-16 -translate-x-1/2 -translate-y-[120%] place-items-center rounded-2xl border-4 border-primary bg-card text-3xl font-black text-foreground shadow-xl"
              style={{ left: `${cursor.x * 100}%`, top: `${cursor.y * 100}%` }}
            >
              {heldTileObj.char}
            </div>
          )}

          {/* Glowing fingertip cursor with dwell ring */}
          {cursor && mode !== "end" && (
            <div
              className="pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${cursor.x * 100}%`, top: `${cursor.y * 100}%` }}
            >
              {hoverHit && (
                <span className="absolute inset-3 animate-ping rounded-full bg-primary/40" />
              )}
              <svg
                width="56"
                height="56"
                viewBox="0 0 56 56"
                className={`transition-transform duration-150 ${pinched ? "scale-75" : ""}`}
              >
                <circle cx="28" cy="28" r="10" className="fill-primary/80" />
                <circle cx="28" cy="28" r="14" className="fill-primary/25" />
                {hoverProgress > 0 && (
                  <circle
                    cx="28"
                    cy="28"
                    r="20"
                    fill="none"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="stroke-primary"
                    strokeDasharray={2 * Math.PI * 20}
                    strokeDashoffset={2 * Math.PI * 20 * (1 - hoverProgress)}
                    transform="rotate(-90 28 28)"
                  />
                )}
              </svg>
            </div>
          )}

          {/* Paused: hand not visible */}
          {paused && (
            <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center rounded-3xl bg-background/70 backdrop-blur-sm">
              <div className="animate-pop rounded-3xl bg-card px-8 py-6 text-center shadow-xl">
                <div className="mb-2 text-5xl">✋</div>
                <div className="text-xl font-black text-foreground">Game paused</div>
                <div className="text-sm font-bold text-muted-foreground">
                  Show your hand to the camera to keep playing.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Camera preview */}
        <div className="pointer-events-none fixed bottom-4 right-4 z-30 w-40 overflow-hidden rounded-2xl border-4 border-card bg-black shadow-xl md:w-52">
          <video
            ref={videoRef}
            className="aspect-[4/3] w-full -scale-x-100 object-cover"
            playsInline
            muted
          />
          {status !== "ready" && (
            <div className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/75 p-2 text-center text-white">
              {status === "loading" && (
                <>
                  <div className="h-6 w-6 animate-spin rounded-full border-4 border-white/30 border-t-white" />
                  <div className="text-[11px] font-bold">Loading hand tracking…</div>
                </>
              )}
              {(status === "idle" || status === "denied" || status === "error") && (
                <>
                  <div className="text-[11px] font-bold">
                    {status === "denied"
                      ? "Camera access is needed to play."
                      : status === "error"
                        ? "Could not start the camera."
                        : "Camera needed to play."}
                  </div>
                  <button
                    onClick={startCamera}
                    className="rounded-xl bg-primary px-3 py-1.5 text-xs font-black text-primary-foreground"
                  >
                    {status === "idle" ? "Allow camera" : "Retry"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {confetti && <Confetti />}
    </div>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 44 });
  const colors = ["#f97316", "#facc15", "#22c55e", "#38bdf8", "#a855f7", "#ef4444"];
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.3;
        const duration = 1.2 + Math.random() * 0.8;
        const color = colors[i % colors.length];
        const size = 6 + Math.random() * 8;
        const balloon = i % 9 === 0;
        return balloon ? (
          <div
            key={i}
            style={{
              left: `${left}%`,
              bottom: "-10vh",
              animation: `balloon-rise ${1.8 + Math.random()}s ${delay}s ease-in forwards`,
            }}
            className="absolute text-4xl"
          >
            🎈
          </div>
        ) : (
          <div
            key={i}
            style={{
              left: `${left}%`,
              top: "-10vh",
              width: size,
              height: size,
              background: color,
              animation: `confetti-fall ${duration}s ${delay}s linear forwards`,
              borderRadius: i % 3 === 0 ? "50%" : "2px",
            }}
            className="absolute"
          />
        );
      })}
    </div>
  );
}
