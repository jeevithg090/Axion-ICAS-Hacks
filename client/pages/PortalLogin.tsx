import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, type AuthUser } from "@/context/AuthContext";
import { homeFor, safeRedirect } from "@/lib/auth-users";

type Mode = "signin" | "signup";

const DEMO_ACCOUNTS = [
  { label: "Continue as demo student", email: "student@icas.edu" },
  { label: "Continue as demo admin", email: "admin@icas.edu" },
] as const;
const DEMO_PASSWORD = "icas123";

export default function PortalLogin() {
  const { login, signupStudent, mode: authMode } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<Mode>("signin");

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

  return (
    <main>
      <SEO
        title="Login — ICAS Portal"
        description="Sign in or sign up (students) to access the portal."
      />
      <section className="container py-10">
        <div className="mx-auto max-w-sm">
          <h1 className="text-2xl font-bold tracking-tight">
            {mode === "signin" ? "Portal Login" : "Student Sign Up"}
          </h1>
          <button
            type="button"
            className="mt-1 text-sm text-primary underline-offset-4 hover:underline"
            onClick={() => {
              setError("");
              setMode(mode === "signin" ? "signup" : "signin");
            }}
          >
            {mode === "signin"
              ? "New student? Create an account"
              : "Already have an account? Sign in"}
          </button>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
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
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                minLength={mode === "signup" ? 6 : undefined}
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
                required
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting
                ? "Please wait…"
                : mode === "signin"
                  ? "Sign in"
                  : "Create account"}
            </Button>
          </form>

          {authMode === "demo" && (
            <div className="mt-8 space-y-3 rounded-lg border border-dashed p-4">
              <p className="text-xs text-muted-foreground">
                Demo mode: accounts are stored in this browser only. Use a demo
                account (password <code>{DEMO_PASSWORD}</code>) or create your
                own.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                {DEMO_ACCOUNTS.map((a) => (
                  <Button
                    key={a.email}
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    disabled={submitting}
                    onClick={() =>
                      run(
                        () => login(a.email, DEMO_PASSWORD),
                        "Demo login failed",
                      )
                    }
                  >
                    {a.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
