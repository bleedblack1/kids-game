// Shared win / try-again banner used by every game's end screen so the
// messaging is consistent: a celebration when the child wins, and a warm
// "best wishes, try again" when they don't.
export function GameResultBanner({
  won,
  className = "",
}: {
  won: boolean;
  className?: string;
}) {
  if (won) {
    return (
      <div className={`animate-pop text-center ${className}`}>
        <div className="mb-2 text-7xl">🏆</div>
        <h1 className="text-4xl font-black text-jungle md:text-5xl">You Win! 🎉</h1>
        <p className="mt-1 text-lg font-bold text-foreground/80">
          Amazing job — you're a superstar! 🌟
        </p>
      </div>
    );
  }
  return (
    <div className={`animate-pop text-center ${className}`}>
      <div className="mb-2 text-7xl">🌈</div>
      <h1 className="text-4xl font-black text-coral md:text-5xl">Best wishes for next time!</h1>
      <p className="mt-1 text-lg font-bold text-foreground/80">Try again — you can do it! 💪</p>
    </div>
  );
}
