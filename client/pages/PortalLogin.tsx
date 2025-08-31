import SEO from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

export default function PortalLogin() {
  const { login } = useAuth();
  const [params] = useSearchParams();
  const next = params.get("next") ?? "/portal";
  const [error, setError] = useState("");

  return (
    <main>
      <SEO title="Login — ICAS Portal" description="Sign in to access the student/faculty portal." />
      <section className="container py-10">
        <h1 className="text-2xl font-bold tracking-tight">Portal Login</h1>
        <form
          className="mt-6 max-w-sm space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget as HTMLFormElement);
            const ok = await login(String(fd.get("email")), String(fd.get("password")));
            if (ok) window.location.assign(next);
            else setError("Invalid credentials");
          }}
        >
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Password" required />
          {error && <div className="text-sm text-destructive">{error}</div>}
          <Button type="submit" className="w-full">Sign in</Button>
          <p className="text-xs text-muted-foreground">Demo accounts: student@icas.edu (student), prof@icas.edu (professor), admin@icas.edu (admin). Password: icas123</p>
        </form>
      </section>
    </main>
  );
}
