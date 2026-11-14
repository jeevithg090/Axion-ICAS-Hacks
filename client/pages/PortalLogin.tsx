import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, type AuthUser } from "@/context/AuthContext";
import { homeFor, safeRedirect } from "@/lib/auth-users";

type Mode = "signin" | "signup";

const DEMO_ACCOUNTS = [
  { label: "Demo student", email: "student@icas.edu", icon: GraduationCap },
  { label: "Demo admin", email: "admin@icas.edu", icon: ShieldCheck },
] as const;
const DEMO_PASSWORD = "icas123";

export default function PortalLogin() {
  const { login, signupStudent, mode: authMode } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<Mode>("signin");
  const [showPassword, setShowPassword] = useState(false);

  const goHome = (u: AuthUser) =>
    navigate(safeRedirect(params.get("next"), homeFor(u.role)), {
      replace: true,
    });

  async function run(action: () => Promise<AuthUser>, fallbackMessage: string) {
    setError("");
    setSubmitting(true);
    try {
      goHome(await action());
    } catch (err) {
      setError((err as Error)?.message || fallbackMessage);
    } finally {
      setSubmitting(false);
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    if (mode === "signin") {
      void run(() => login(email, password), "Failed to sign in");
    } else {
      const name = String(fd.get("name") ?? "");
      void run(() => signupStudent(name, email, password), "Failed to sign up");
    }
  }

  const isSignin = mode === "signin";
  const switchMode = (next: Mode) => {
    setError("");
    setMode(next);
  };

  return (
    <main className="container py-10 md:py-16">
      <SEO
        title={isSignin ? "Log in — ICAS Portal" : "Sign up — ICAS Portal"}
        description="Sign in or sign up (students) to access the portal."
      />
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border bg-card shadow-lift lg:grid-cols-2">
        {/* Brand panel */}
        <aside className="relative isolate hidden flex-col justify-between overflow-hidden bg-slate-950 p-10 text-white lg:flex">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_100%_0%,hsl(20_88%_45%/0.45),transparent_60%),radial-gradient(60%_60%_at_0%_100%,hsl(221_70%_46%/0.5),transparent_60%)]"
          />
          <div className="flex items-center gap-2.5 text-lg font-extrabold">
            <img src="/logo.svg" alt="" className="h-8 w-8" />
            ICAS Portal
          </div>
          <div>
            <h2 className="text-3xl font-bold leading-tight">
              Your 2+2 journey, in one place.
            </h2>
            <ul className="mt-6 grid gap-3 text-sm text-slate-300">
              {[
                "Track transfer documents, deadlines and eligibility",
                "Plan courses and project your GPA",
                "Summarise delegate meetings automatically",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-orange-300"
                    aria-hidden="true"
                  />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-slate-400">
            Built by Team AXION for the Enigma Hackathon 2025.
          </p>
        </aside>

        {/* Form panel */}
        <div className="p-6 sm:p-10">
          <h1 className="text-2xl font-bold tracking-tight">
            {isSignin ? "Welcome back" : "Create your student account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isSignin
              ? "Sign in to open your student portal."
              : "New accounts are created with the student role."}
          </p>

          <div
            role="group"
            aria-label="Choose sign in or sign up"
            className="mt-6 grid grid-cols-2 rounded-lg bg-muted p-1 text-sm font-medium"
          >
            {(
              [
                ["signin", "Sign in"],
                ["signup", "Sign up"],
              ] as const
            ).map(([m, label]) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => switchMode(m)}
                className={`h-9 rounded-md ${mode === m ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Asha Rao"
                  required
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@icas.edu"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "login-error" : undefined}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  minLength={mode === "signup" ? 6 : undefined}
                  autoComplete={isSignin ? "current-password" : "new-password"}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={
                    [
                      mode === "signup" ? "password-hint" : "",
                      error ? "login-error" : "",
                    ]
                      .filter(Boolean)
                      .join(" ") || undefined
                  }
                  className="pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-1 top-1/2 inline-grid h-8 w-9 -translate-y-1/2 place-items-center rounded text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {mode === "signup" && (
                <p id="password-hint" className="text-xs text-muted-foreground">
                  At least 6 characters.
                </p>
              )}
            </div>
            {error && (
              <p
                id="login-error"
                role="alert"
                className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                <AlertCircle
                  className="mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                {error}
              </p>
            )}
            <Button type="submit" className="h-11 w-full" disabled={submitting}>
              {submitting && (
                <Loader2 className="animate-spin" aria-hidden="true" />
              )}
              {submitting
                ? "Please wait…"
                : isSignin
                  ? "Sign in"
                  : "Create account"}
            </Button>
          </form>

          {authMode === "demo" && (
            <div className="mt-8 rounded-xl border border-dashed bg-muted/30 p-4">
              <p className="text-sm font-medium">Try a demo account</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Demo mode stores accounts in this browser only. Password for all
                demo accounts:{" "}
                <code className="font-mono">{DEMO_PASSWORD}</code>
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {DEMO_ACCOUNTS.map((a) => (
                  <Button
                    key={a.email}
                    type="button"
                    variant="outline"
                    className="h-auto justify-start whitespace-normal py-2.5 text-left"
                    disabled={submitting}
                    onClick={() =>
                      run(
                        () => login(a.email, DEMO_PASSWORD),
                        "Demo login failed",
                      )
                    }
                  >
                    <a.icon className="text-primary" aria-hidden="true" />
                    <span>
                      <span className="block">{a.label}</span>
                      <span className="block text-xs font-normal text-muted-foreground">
                        {a.email}
                      </span>
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
