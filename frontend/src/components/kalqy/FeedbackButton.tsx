import { useState } from "react";
import { MessageSquareHeart, Star, X, Check } from "lucide-react";
import { postFeedback } from "@/lib/api";

// A short, optimized parent-feedback widget distilled from the full Kalqy
// Parent Feedback Survey. Rendered app-wide except inside a game (games take
// over the screen and need zero distractions). Pinned to the top-right corner.

const ENJOY_OPTIONS = ["Yes, very much", "Yes", "Somewhat", "Not really"];

const ASPECT_OPTIONS = [
  "Jumping & movement",
  "Finding answers",
  "Animations",
  "Voice instructions",
  "Scoring points",
  "Playing like a game",
];

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [enjoyed, setEnjoyed] = useState("");
  const [aspects, setAspects] = useState<string[]>([]);
  const [recommend, setRecommend] = useState<number | null>(null);
  const [improve, setImprove] = useState("");
  const [email, setEmail] = useState("");

  const close = () => {
    setOpen(false);
    // Reset after the modal closes so the parent sees a fresh form next time.
    setTimeout(() => {
      setSent(false);
      setRating(0);
      setHover(0);
      setEnjoyed("");
      setAspects([]);
      setRecommend(null);
      setImprove("");
      setEmail("");
    }, 200);
  };

  const toggleAspect = (a: string) =>
    setAspects((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const canSend =
    rating > 0 || enjoyed !== "" || aspects.length > 0 || recommend !== null || improve.trim() !== "";

  const submit = () => {
    postFeedback({
      rating,
      enjoyed,
      aspects,
      recommend,
      improve: improve.trim(),
      email: email.trim(),
    });
    setSent(true);
    setTimeout(close, 1400);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Give feedback"
        title="Give feedback"
        className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <MessageSquareHeart className="h-5 w-5" />
        <span className="hidden sm:inline">Feedback</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
          onClick={close}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-background p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black text-foreground">Parent Feedback</h2>
                <p className="text-sm text-muted-foreground">
                  Takes under a minute — it helps us make Kalqy better.
                </p>
              </div>
              <button
                onClick={close}
                aria-label="Close"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {sent ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-8 w-8" />
                </div>
                <div className="text-lg font-extrabold text-foreground">Thank you! 🎉</div>
                <div className="text-sm text-muted-foreground">Your feedback helps us improve.</div>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {/* Overall satisfaction */}
                <Field label="How satisfied are you with Kalqy?">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setRating(n)}
                        onMouseEnter={() => setHover(n)}
                        onMouseLeave={() => setHover(0)}
                        aria-label={`${n} star${n > 1 ? "s" : ""}`}
                        className="p-0.5 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            n <= (hover || rating)
                              ? "fill-sunshine text-sunshine"
                              : "text-muted-foreground/40"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </Field>

                {/* Enjoyment */}
                <Field label="Did your child enjoy learning while playing?">
                  <div className="flex flex-wrap gap-2">
                    {ENJOY_OPTIONS.map((o) => (
                      <Chip key={o} active={enjoyed === o} onClick={() => setEnjoyed(o)}>
                        {o}
                      </Chip>
                    ))}
                  </div>
                </Field>

                {/* Favourite aspect (multi-select) */}
                <Field label="What did your child enjoy most?">
                  <div className="flex flex-wrap gap-2">
                    {ASPECT_OPTIONS.map((o) => (
                      <Chip key={o} active={aspects.includes(o)} onClick={() => toggleAspect(o)}>
                        {o}
                      </Chip>
                    ))}
                  </div>
                </Field>

                {/* Recommend (NPS 0–10) */}
                <Field label="How likely are you to recommend Kalqy to other parents?">
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from({ length: 11 }, (_, n) => (
                      <button
                        key={n}
                        onClick={() => setRecommend(n)}
                        className={`h-9 w-9 rounded-xl text-sm font-bold transition-all ${
                          recommend === n
                            ? "bg-primary text-primary-foreground shadow"
                            : "bg-card text-foreground hover:bg-muted"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                    <span>Not likely</span>
                    <span>Very likely</span>
                  </div>
                </Field>

                {/* Improvement */}
                <Field label="What can we improve?">
                  <textarea
                    value={improve}
                    onChange={(e) => setImprove(e.target.value)}
                    placeholder="Anything you'd love to see, or that could be better…"
                    rows={3}
                    className="w-full resize-none rounded-2xl border border-border bg-card p-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                  />
                </Field>

                {/* Optional email */}
                <Field label="Email (optional — if you'd like us to follow up)">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-border bg-card p-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                  />
                </Field>

                <button
                  onClick={submit}
                  disabled={!canSend}
                  className="w-full rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md transition-all hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Send Feedback
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-foreground">{label}</label>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
        active
          ? "bg-primary text-primary-foreground shadow"
          : "bg-card text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}
