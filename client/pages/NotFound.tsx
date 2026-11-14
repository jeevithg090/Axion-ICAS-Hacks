import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Compass, Home } from "lucide-react";
import SEO from "@/components/SEO";

const suggestions = [
  { to: "/academics", label: "Academics" },
  { to: "/transfer", label: "2+2 Transfer" },
  { to: "/admissions-aid", label: "Admissions & Aid" },
  { to: "/portal", label: "Student Portal" },
];

export default function NotFound() {
  const { pathname } = useLocation();

  return (
    <main className="container grid min-h-[65vh] place-items-center py-16">
      <SEO
        title="Page not found — ICAS"
        description="The page you were looking for does not exist."
      />
      <div className="max-w-lg animate-fade-up text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Compass className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="mt-6 text-sm font-semibold text-primary">Error 404</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          We couldn’t find that page
        </h1>
        <p className="mt-3 text-muted-foreground">
          Nothing lives at{" "}
          <code className="break-all rounded bg-muted px-1.5 py-0.5 text-sm text-foreground">
            {pathname}
          </code>
          . It may have moved, or the link may be mistyped.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Go to the home page
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex h-11 items-center gap-2 rounded-md border px-5 text-sm font-semibold hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Go back
          </button>
        </div>
        <nav aria-label="Popular pages" className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Popular pages
          </p>
          <ul className="mt-3 flex flex-wrap justify-center gap-2">
            {suggestions.map((s) => (
              <li key={s.to}>
                <Link
                  to={s.to}
                  className="inline-flex rounded-full border px-3 py-1.5 text-sm hover:border-primary/50 hover:bg-accent hover:text-accent-foreground"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
