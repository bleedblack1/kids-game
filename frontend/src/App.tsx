import { useEffect, useState } from "react";
import { Sidebar, type View } from "@/components/kalqy/Sidebar";
import { Dashboard, type Stats } from "@/components/kalqy/Dashboard";
import { GameScreen, type GameResult } from "@/components/kalqy/GameScreen";
import { FingerGestureQuiz } from "@/components/kalqy/FingerGestureQuiz";
import { EndlessRunner } from "@/components/kalqy/EndlessRunner";
import { MathAdventure } from "@/components/kalqy/MathAdventure";
import { StickerBook } from "@/components/kalqy/StickerBook";
import { Leaderboard } from "@/components/kalqy/Leaderboard";
import { VocabFaceQuiz } from "@/components/kalqy/VocabFaceQuiz";
import { PointAndSpell } from "@/components/kalqy/PointAndSpell";
import { getRole, setRole as saveRole, type Role } from "@/lib/roles";

const SKILL_MAP: Record<string, keyof Pick<Stats, "balance" | "coordination" | "bodyAwareness">> = {
  Jump: "balance",
  Crawl: "coordination",
  Squat: "bodyAwareness",
  Walk: "coordination",
};

export function App() {
  const [view, setView] = useState<View>("dashboard");
  const [role, setRoleState] = useState<Role>("kid");
  const [stats, setStats] = useState<Stats>({
    gamesPlayed: 0,
    stars: 0,
    balance: 35,
    coordination: 40,
    bodyAwareness: 30,
  });

  useEffect(() => {
    setRoleState(getRole());
  }, []);

  const changeRole = (r: Role) => {
    setRoleState(r);
    saveRole(r);
  };

  const handleComplete = (result: GameResult) => {
    setStats((prev) => {
      const next = { ...prev };
      next.gamesPlayed += 1;
      next.stars += result.stars;
      for (const [movement, count] of Object.entries(result.movements)) {
        const skill = SKILL_MAP[movement];
        if (skill) next[skill] = Math.min(100, next[skill] + count * 6);
      }
      next.balance = Math.min(100, next.balance + 2);
      next.coordination = Math.min(100, next.coordination + 2);
      next.bodyAwareness = Math.min(100, next.bodyAwareness + 2);
      return next;
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar view={view} onNavigate={setView} role={role} onRoleChange={changeRole} />
      <main className="flex-1 overflow-x-hidden">
        {view === "dashboard" && (
          <Dashboard
            role={role}
            stats={stats}
            onPlay={() => setView("game")}
            onOpenStickers={() => setView("sticker-book")}
            onOpenLeaderboard={() => setView("leaderboard")}
          />
        )}
        {view === "game" && (
          <GameScreen onBack={() => setView("dashboard")} onComplete={handleComplete} />
        )}
        {view === "finger-quiz" && (
          <FingerGestureQuiz
            onBack={() => setView("dashboard")}
            onComplete={(s) =>
              setStats((p) => ({ ...p, gamesPlayed: p.gamesPlayed + 1, stars: p.stars + s }))
            }
          />
        )}
        {view === "endless-runner" && (
          <EndlessRunner
            onBack={() => setView("dashboard")}
            onComplete={(_score, coins) =>
              setStats((p) => ({
                ...p,
                gamesPlayed: p.gamesPlayed + 1,
                stars: p.stars + Math.min(5, Math.floor(coins / 5)),
                coordination: Math.min(100, p.coordination + 3),
              }))
            }
          />
        )}
        {view === "math-adventure" && (
          <MathAdventure
            onBack={() => setView("dashboard")}
            onComplete={({ correct }) =>
              setStats((p) => ({
                ...p,
                gamesPlayed: p.gamesPlayed + 1,
                stars: p.stars + Math.min(5, Math.ceil(correct / 2)),
                bodyAwareness: Math.min(100, p.bodyAwareness + 2),
              }))
            }
          />
        )}
        {view === "vocab-face" && (
          <VocabFaceQuiz
            onBack={() => setView("dashboard")}
            onComplete={({ correct, coins }) =>
              setStats((p) => ({
                ...p,
                gamesPlayed: p.gamesPlayed + 1,
                stars: p.stars + Math.min(5, Math.ceil(correct / 2)),
                coordination: Math.min(100, p.coordination + Math.floor(coins / 6)),
              }))
            }
          />
        )}
        {view === "point-spell" && (
          <PointAndSpell
            onBack={() => setView("dashboard")}
            onComplete={(s) =>
              setStats((p) => ({
                ...p,
                gamesPlayed: p.gamesPlayed + 1,
                stars: p.stars + s,
                coordination: Math.min(100, p.coordination + 3),
              }))
            }
          />
        )}
        {view === "sticker-book" && <StickerBook onBack={() => setView("dashboard")} />}
        {view === "leaderboard" && <Leaderboard onBack={() => setView("dashboard")} />}
      </main>
    </div>
  );
}
