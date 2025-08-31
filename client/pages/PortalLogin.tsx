import SEO from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

export default function PortalLogin() {
  const { login, signupStudent } = useAuth();
  const [params] = useSearchParams();
  const next = params.get("next");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <main>
      <SEO title="Login — ICAS Portal" description="Sign in or sign up (students) to access the portal." />
      <section className="container py-10">
        <div className="flex items-end justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{mode === "signin" ? "Portal Login" : "Student Sign Up"}</h1>
          <button
            className="text-sm text-primary underline-offset-4 hover:underline"
            onClick={() => { setError(""); setMode(mode === "signin" ? "signup" : "signin"); }}
          >
            {mode === "signin" ? "New student? Create an account" : "Already have an account? Sign in"}
          </button>
        </div>

        {mode === "signin" ? (
          <form
            className="mt-6 max-w-sm space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              const fd = new FormData(e.currentTarget as HTMLFormElement);
              try {
                const u = await login(String(fd.get("email")), String(fd.get("password")));
                const dest = next ?? (u.role === "admin" ? "/admin" : "/portal");
                window.location.assign(dest);
              } catch (err: any) {
                setError(err?.message || "Failed to sign in");
              }
            }}
          >
            <Input name="email" type="email" placeholder="Email" required />
            <Input name="password" type="password" placeholder="Password" required />
            {error && <div className="text-sm text-destructive">{error}</div>}
            <Button type="submit" className="w-full">Sign in</Button>
          </form>
        ) : (
          <form
            className="mt-6 max-w-sm space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              const fd = new FormData(e.currentTarget as HTMLFormElement);
              try {
                const u = await signupStudent(String(fd.get("name")), String(fd.get("email")), String(fd.get("password")));
                const dest = next ?? (u.role === "admin" ? "/admin" : "/portal");
                window.location.assign(dest);
              } catch (err: any) {
                setError(err?.message || "Failed to sign up");
              }
            }}
          >
            <Input name="name" type="text" placeholder="Full name" required />
            <Input name="email" type="email" placeholder="Student email" required />
            <Input name="password" type="password" placeholder="Password" required />
            {error && <div className="text-sm text-destructive">{error}</div>}
            <Button type="submit" className="w-full">Create account</Button>
          </form>
        )}

        <div className="mt-8 max-w-sm space-y-3">
          <div className="text-xs text-muted-foreground">Or skip authentication:</div>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={async () => {
              try {
                const u = await login("student@icas.edu", "icas123");
                const dest = next ?? (u.role === "admin" ? "/admin" : "/portal");
                window.location.assign(dest);
              } catch (err: any) {
                setError(err?.message || "Failed to skip as student");
              }
            }}>Skip as Student</Button>
            <Button variant="outline" className="flex-1" onClick={async () => {
              try {
                const u = await login("admin@icas.edu", "icas123");
                const dest = next ?? (u.role === "admin" ? "/admin" : "/portal");
                window.location.assign(dest);
              } catch (err: any) {
                setError(err?.message || "Failed to skip as admin");
              }
            }}>Skip as Administrator</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
