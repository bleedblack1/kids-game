import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, CameraOff, RotateCcw } from "lucide-react";

// Full-body pose control for Dino Adventure Run (MediaPipe PoseLandmarker).
// The game reads live control signals from a mutable ref every frame — no
// React re-renders on the hot path.

interface Baseline {
  mirroredX: number; // 1 - shoulderCenter.x
  shoulderY: number;
  hipY: number;
  torso: number; // hipY - shoulderY
}

export interface PoseSignals {
  present: boolean; // a person is detected
  fullBody: boolean; // head + shoulders + hips + knees visible
  inBox: boolean; // whole body inside the calibration box
  calibrated: boolean;
  // Standing-pose reference captured during calibration. Lives here (not in
  // component state) so it survives DinoPoseControl unmounting between levels.
  baseline: Baseline | null;
  lean: -1 | 0 | 1; // -1 = lean left (as the child sees it)
  duck: boolean;
  handsUp: boolean;
  jumpCount: number; // increments once per detected real-life jump
  // Which side a single raised hand points to (as the child sees it):
  // -1 left, 0 straight up / centre, 1 right, null when no hand is raised.
  pick: -1 | 0 | 1 | null;
}

export function createPoseSignals(): PoseSignals {
  return {
    present: false,
    fullBody: false,
    inBox: false,
    calibrated: false,
    baseline: null,
    lean: 0,
    duck: false,
    handsUp: false,
    jumpCount: 0,
    pick: null,
  };
}

export type PoseStatus = "idle" | "loading" | "ready" | "denied" | "error";

interface Props {
  active: boolean; // classify gestures only while true
  signalsRef: React.MutableRefObject<PoseSignals>;
  calibrating: boolean; // while true, sample a standing baseline
  onCalibrated?: () => void;
  onStatusChange?: (s: PoseStatus) => void;
  size?: "sm" | "lg";
}

// MediaPipe Pose landmark indices
const NOSE = 0;
const L_SHOULDER = 11;
const R_SHOULDER = 12;
const L_WRIST = 15;
const R_WRIST = 16;
const L_HIP = 23;
const R_HIP = 24;
const L_KNEE = 25;
const R_KNEE = 26;
const L_ANKLE = 27;
const R_ANKLE = 28;

const BODY_KEYS = [NOSE, L_SHOULDER, R_SHOULDER, L_HIP, R_HIP, L_KNEE, R_KNEE];

// The calibration box, in normalized video coordinates.
export const BOX = { x0: 0.14, x1: 0.86, y0: 0.02, y1: 0.98 };

const CONNECTIONS: [number, number][] = [
  [L_SHOULDER, R_SHOULDER],
  [L_SHOULDER, L_HIP],
  [R_SHOULDER, R_HIP],
  [L_HIP, R_HIP],
  [L_SHOULDER, 13],
  [13, L_WRIST],
  [R_SHOULDER, 14],
  [14, R_WRIST],
  [L_HIP, L_KNEE],
  [L_KNEE, L_ANKLE],
  [R_HIP, R_KNEE],
  [R_KNEE, R_ANKLE],
];

type LM = { x: number; y: number; visibility?: number };

interface PoseResult {
  landmarks?: LM[][];
}

interface Landmarker {
  detectForVideo: (video: HTMLVideoElement, ts: number) => PoseResult;
  close?: () => void;
}

const vis = (l: LM | undefined) => (l ? (l.visibility ?? 1) : 0);

export function DinoPoseControl({
  active,
  signalsRef,
  calibrating,
  onCalibrated,
  onStatusChange,
  size = "sm",
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const landmarkerRef = useRef<Landmarker | null>(null);
  const lastVideoTimeRef = useRef(-1);
  const [status, setStatus] = useState<PoseStatus>("idle");
  const [action, setAction] = useState<string>("");

  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const calibratingRef = useRef(calibrating);
  const samplesRef = useRef<Baseline[]>([]);
  useEffect(() => {
    calibratingRef.current = calibrating;
    if (calibrating) {
      samplesRef.current = [];
      signalsRef.current.calibrated = false;
      signalsRef.current.baseline = null;
    }
  }, [calibrating, signalsRef]);

  const onCalibratedRef = useRef(onCalibrated);
  useEffect(() => {
    onCalibratedRef.current = onCalibrated;
  }, [onCalibrated]);

  const smoothRef = useRef<{ x: number; sy: number; hy: number } | null>(null);
  const jumpArmedRef = useRef(true);
  const lastActionRef = useRef("");

  const setStatusBoth = useCallback(
    (s: PoseStatus) => {
      setStatus(s);
      onStatusChange?.(s);
    },
    [onStatusChange],
  );

  const initLandmarker = useCallback(async () => {
    if (landmarkerRef.current) return landmarkerRef.current;
    const { FilesetResolver, PoseLandmarker } = await import("@mediapipe/tasks-vision");
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm",
    );
    const lm = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numPoses: 1,
    });
    landmarkerRef.current = lm;
    return lm;
  }, []);

  const process = useCallback(
    (result: PoseResult) => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const s = signalsRef.current;
      if (!canvas || !video) return;
      const w = video.videoWidth || 640;
      const h = video.videoHeight || 480;
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      const lms: LM[] = result?.landmarks?.[0] ?? [];
      if (!lms.length || vis(lms[NOSE]) < 0.4) {
        s.present = false;
        s.fullBody = false;
        s.inBox = false;
        s.lean = 0;
        s.duck = false;
        s.handsUp = false;
        s.pick = null;
        smoothRef.current = null;
        setActionOnce("");
        return;
      }
      s.present = true;

      // Hand-pick: a single raised wrist pointing left / centre / right.
      // Works without calibration — uses only this frame's wrists + shoulders.
      {
        const lw = lms[L_WRIST];
        const rw = lms[R_WRIST];
        const shY = (lms[L_SHOULDER].y + lms[R_SHOULDER].y) / 2;
        const shX = (lms[L_SHOULDER].x + lms[R_SHOULDER].x) / 2;
        const raised: LM[] = [];
        if (vis(lw) > 0.5 && lw.y < shY - 0.04) raised.push(lw);
        if (vis(rw) > 0.5 && rw.y < shY - 0.04) raised.push(rw);
        if (!raised.length) {
          s.pick = null;
        } else {
          const w =
            raised.length === 1 ? raised[0] : raised[0].y < raised[1].y ? raised[0] : raised[1];
          const dx = shX - w.x; // horizontal offset, mirrored to how the child sees it
          s.pick = dx > 0.09 ? 1 : dx < -0.09 ? -1 : 0;
        }
      }

      const fullBody = BODY_KEYS.every((i) => vis(lms[i]) > 0.5);
      s.fullBody = fullBody;

      let inBox = fullBody;
      if (fullBody) {
        for (const i of BODY_KEYS) {
          const p = lms[i];
          if (p.x < BOX.x0 || p.x > BOX.x1 || p.y < BOX.y0 || p.y > BOX.y1) {
            inBox = false;
            break;
          }
        }
      }
      s.inBox = inBox;

      // Skeleton overlay (canvas is CSS-mirrored together with the video)
      const good = s.calibrated || inBox;
      ctx.lineWidth = Math.max(3, w / 160);
      ctx.strokeStyle = good ? "#22c55e" : "#f59e0b";
      ctx.fillStyle = ctx.strokeStyle;
      ctx.lineCap = "round";
      for (const [a, b] of CONNECTIONS) {
        if (vis(lms[a]) < 0.4 || vis(lms[b]) < 0.4) continue;
        ctx.beginPath();
        ctx.moveTo(lms[a].x * w, lms[a].y * h);
        ctx.lineTo(lms[b].x * w, lms[b].y * h);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(lms[NOSE].x * w, lms[NOSE].y * h, Math.max(8, w / 55), 0, Math.PI * 2);
      ctx.stroke();

      // Calibration target box while not calibrated
      if (!s.calibrated) {
        ctx.setLineDash([12, 10]);
        ctx.lineWidth = Math.max(3, w / 200);
        ctx.strokeStyle = inBox ? "#22c55e" : "#ffffff";
        ctx.strokeRect(BOX.x0 * w, BOX.y0 * h, (BOX.x1 - BOX.x0) * w, (BOX.y1 - BOX.y0) * h);
        ctx.setLineDash([]);
      }

      // ---- derived body measures (EMA-smoothed) ----
      const shoulderX = (lms[L_SHOULDER].x + lms[R_SHOULDER].x) / 2;
      const shoulderY = (lms[L_SHOULDER].y + lms[R_SHOULDER].y) / 2;
      const hipY = (lms[L_HIP].y + lms[R_HIP].y) / 2;
      const mirroredX = 1 - shoulderX;

      const prev = smoothRef.current;
      const a = 0.5;
      const sm = prev
        ? {
            x: prev.x + a * (mirroredX - prev.x),
            sy: prev.sy + a * (shoulderY - prev.sy),
            hy: prev.hy + a * (hipY - prev.hy),
          }
        : { x: mirroredX, sy: shoulderY, hy: hipY };
      smoothRef.current = sm;

      // ---- baseline sampling during calibration ----
      if (calibratingRef.current && !s.calibrated && fullBody && inBox) {
        samplesRef.current.push({
          mirroredX: sm.x,
          shoulderY: sm.sy,
          hipY: sm.hy,
          torso: sm.hy - sm.sy,
        });
        if (samplesRef.current.length >= 24) {
          const n = samplesRef.current.length;
          const avg = samplesRef.current.reduce(
            (acc, b) => ({
              mirroredX: acc.mirroredX + b.mirroredX / n,
              shoulderY: acc.shoulderY + b.shoulderY / n,
              hipY: acc.hipY + b.hipY / n,
              torso: acc.torso + b.torso / n,
            }),
            { mirroredX: 0, shoulderY: 0, hipY: 0, torso: 0 },
          );
          s.baseline = avg;
          s.calibrated = true;
          jumpArmedRef.current = true;
          onCalibratedRef.current?.();
        }
      }

      // ---- gesture classification (only when calibrated + game active) ----
      const base = s.baseline;
      if (!s.calibrated || !base || !activeRef.current) {
        setActionOnce("");
        return;
      }
      const torso = Math.max(0.05, base.torso);

      // Lean: shoulder-center X offset, with hysteresis
      const dx = sm.x - base.mirroredX;
      const enter = 0.055;
      const exit = 0.03;
      if (s.lean === 0) {
        if (dx < -enter) s.lean = -1;
        else if (dx > enter) s.lean = 1;
      } else if (s.lean === -1 && dx > -exit) s.lean = 0;
      else if (s.lean === 1 && dx < exit) s.lean = 0;

      // Duck: shoulders drop well below standing baseline
      const drop = sm.sy - base.shoulderY;
      if (!s.duck && drop > torso * 0.5) s.duck = true;
      else if (s.duck && drop < torso * 0.32) s.duck = false;

      // Jump: hips rise above standing baseline, re-armed on landing
      const rise = base.hipY - sm.hy;
      if (jumpArmedRef.current && rise > torso * 0.3) {
        jumpArmedRef.current = false;
        s.jumpCount++;
      } else if (!jumpArmedRef.current && rise < torso * 0.12) {
        jumpArmedRef.current = true;
      }

      // Both hands up: wrists above the nose
      const lw = lms[L_WRIST];
      const rw = lms[R_WRIST];
      s.handsUp =
        vis(lw) > 0.4 && vis(rw) > 0.4 && lw.y < lms[NOSE].y - 0.02 && rw.y < lms[NOSE].y - 0.02;

      setActionOnce(
        s.handsUp
          ? "🙌 Hands up!"
          : s.duck
            ? "⬇ Duck!"
            : !jumpArmedRef.current
              ? "⬆ Jump!"
              : s.lean === -1
                ? "← Left"
                : s.lean === 1
                  ? "Right →"
                  : "",
      );
    },
    [signalsRef],
  );

  const setActionOnce = (label: string) => {
    if (lastActionRef.current !== label) {
      lastActionRef.current = label;
      setAction(label);
    }
  };

  const loop = useCallback(() => {
    const tick = () => {
      const video = videoRef.current;
      const landmarker = landmarkerRef.current;
      if (video && landmarker && !document.hidden) {
        if (video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
          lastVideoTimeRef.current = video.currentTime;
          try {
            const result = landmarker.detectForVideo(video, performance.now());
            process(result);
          } catch {
            /* skip frame */
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [process]);

  const startCamera = useCallback(async () => {
    setStatusBoth("loading");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      try {
        await video.play();
      } catch (e) {
        if ((e as { name?: string })?.name === "AbortError") return;
        throw e;
      }
      await initLandmarker();
      setStatusBoth("ready");
      loop();
    } catch (err) {
      console.error("Dino pose camera error", err);
      const name = (err as { name?: string })?.name;
      if (name === "NotAllowedError" || name === "SecurityError") setStatusBoth("denied");
      else setStatusBoth("error");
    }
  }, [initLandmarker, loop, setStatusBoth]);

  const stopCamera = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    try {
      landmarkerRef.current?.close?.();
    } catch {
      /* already closed */
    }
    landmarkerRef.current = null;
  }, []);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lg = size === "lg";

  return (
    <div
      className={`pointer-events-auto overflow-hidden rounded-2xl border-4 border-card bg-card/95 shadow-xl backdrop-blur ${
        lg ? "w-[min(90vw,460px)]" : "w-[170px] md:w-[210px]"
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 text-[11px] font-black text-foreground">
        <span className="flex items-center gap-1.5">
          <Camera className="h-3.5 w-3.5 text-primary" /> Body Tracking
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] ${
            status === "ready"
              ? "bg-jungle/20 text-jungle"
              : status === "denied" || status === "error"
                ? "bg-coral/20 text-coral"
                : "bg-muted text-muted-foreground"
          }`}
        >
          {status === "ready" ? "LIVE" : status.toUpperCase()}
        </span>
      </div>
      <div className={`relative w-full bg-black ${lg ? "aspect-[4/3]" : "aspect-[4/3]"}`}>
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full -scale-x-100 object-cover"
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full -scale-x-100"
        />
        {status === "ready" && action && (
          <div className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-primary/90 px-3 py-1 text-xs font-black text-primary-foreground shadow">
            {action}
          </div>
        )}
        {status !== "ready" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/75 p-3 text-center text-white">
            {status === "loading" && (
              <>
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <div className="text-xs font-bold">Waking up the camera…</div>
              </>
            )}
            {status === "idle" && (
              <button
                onClick={startCamera}
                className="rounded-full bg-primary px-4 py-2 text-xs font-black text-primary-foreground"
              >
                Enable Camera
              </button>
            )}
            {(status === "denied" || status === "error") && (
              <>
                <CameraOff className="h-6 w-6" />
                <div className="text-xs font-bold">
                  {status === "denied" ? "Camera blocked" : "Camera unavailable"}
                </div>
                <button
                  onClick={startCamera}
                  className="flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-black text-primary-foreground"
                >
                  <RotateCcw className="h-3 w-3" /> Try Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
