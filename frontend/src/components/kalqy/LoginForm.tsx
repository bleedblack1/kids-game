import { useState } from "react";
import { ArrowLeft, LogIn, Lock } from "lucide-react";
import { login } from "@/lib/api";
import { authStore, type UserRole } from "@/lib/auth-store";

interface Props {
  title: string;
  subtitle: string;
  /** If set, the logged-in account must have this role (else an error shows). */
  requiredRole?: UserRole;
  onSuccess: () => void;
  onBack?: () => void;
}

// Real backend login (email + password → JWT). Used to gate the Teacher
// leaderboard and the admin feedback viewer so they can load real data.
export function LoginForm({ title, subtitle, requiredRole, onSuccess, onBack }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const ok = await login(email.trim(), password);
      if (!ok) {
        setError("Incorrect email or password.");
        return;
      }
      if (requiredRole && authStore.principal?.role !== requiredRole) {
        authStore.clearUser();
        setError(`This isn't a ${requiredRole.toLowerCase()} account.`);
        return;
      }
      onSuccess();
    } catch {
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-6 md:px-8 md:py-10">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 rounded-2xl bg-card px-4 py-2 text-sm font-bold text-foreground shadow-sm transition-all hover:scale-105"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      )}

      <div className="rounded-3xl border-2 border-border bg-card p-8 shadow-lg">
        <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Lock className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-black text-foreground">{title}</h1>
        <p className="mb-6 mt-1 text-sm font-semibold text-muted-foreground">{subtitle}</p>

        <input
          type="email"
          value={email}
          autoFocus
          autoComplete="username"
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          placeholder="Email"
          className="mb-3 w-full rounded-2xl border-2 border-border bg-background p-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="password"
          value={password}
          autoComplete="current-password"
          onChange={(e) => {
            setPassword(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Password"
          className="w-full rounded-2xl border-2 border-border bg-background p-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
        />
        {error && <p className="mt-2 text-xs font-bold text-coral">{error}</p>}

        <button
          onClick={submit}
          disabled={busy || !email || !password}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md transition-all hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogIn className="h-4 w-4" /> {busy ? "Signing in…" : "Sign in"}
        </button>
      </div>
    </div>
  );
}
