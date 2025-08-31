import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const nav = [
  { to: "/about", label: "About" },
  { to: "/academics", label: "Academics" },
  { to: "/admissions-aid", label: "Admissions/Aid" },
  { to: "/enigma", label: "Enigma" },
  { to: "/student-life", label: "Student Life" },
  { to: "/contact", label: "Contact" },
  { to: "/transfer", label: "Transfer" },
  { to: "/portal", label: "Portal" },
];

export default function Header() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isHome && !scrolled;

  return (
    <header
      className={
        transparent
          ? "absolute inset-x-0 top-0 z-40 w-full border-transparent bg-transparent text-white"
          : "sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      }
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">Skip to content</a>

      {/* Topbar */}
      <div className={`${transparent ? "text-white/90" : "text-muted-foreground"} hidden border-b/0 text-xs md:block`}>
        <div className="container flex h-9 items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="mailto:hello@icas.edu" className="hover:underline">hello@icas.edu</a>
            <a href="tel:+918012345678" className="hover:underline">+91 80 1234 5678</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Facebook" className="hover:opacity-80">Fb</a>
            <a href="#" aria-label="LinkedIn" className="hover:opacity-80">In</a>
            <a href="#" aria-label="YouTube" className="hover:opacity-80">Yt</a>
          </div>
        </div>
      </div>

      <div className="container flex h-16 items-center justify-between gap-6">
        <Link to="/" className={`flex items-center gap-2 font-extrabold tracking-tight ${transparent ? "text-white" : "text-primary"}`}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F766318eacea44b40bcc70d9d860cc3ef%2Ff91793dcf37543a2b5a1a15981fd005e?format=webp&width=80"
            alt="ICAS logo"
            className="h-7 w-7 rounded-sm object-contain"
            loading="eager"
            width="28"
            height="28"
          />
          ICAS
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium md:flex">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `rounded-md px-2 py-1 transition-colors ${
                  transparent
                    ? `text-white/90 hover:text-white ${isActive ? "underline underline-offset-4" : ""}`
                    : `hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"}`
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {!user ? (
            <Link
              to="/login"
              className={
                transparent
                  ? "rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white shadow-soft transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  : "rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              }
            >
              Login
            </Link>
          ) : (
            <>
              <Link
                to={user.role === "admin" ? "/admin" : "/portal"}
                className={
                  transparent
                    ? "rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white shadow-soft transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    : "rounded-md bg-secondary px-3 py-1.5 text-sm font-semibold text-secondary-foreground shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                }
              >
                {user.role === "admin" ? "Admin" : "Portal"}
              </Link>
              <button
                onClick={() => logout()}
                className={
                  transparent
                    ? "rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white/90 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    : "rounded-md border px-3 py-1.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                }
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
