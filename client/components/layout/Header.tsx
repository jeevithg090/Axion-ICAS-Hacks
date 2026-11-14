import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { LayoutDashboard, LogIn, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { homeFor } from "@/lib/auth-users";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/theme/ThemeToggle";
import Logo from "./Logo";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const nav = [
  { to: "/about", label: "About" },
  { to: "/academics", label: "Academics" },
  { to: "/admissions-aid", label: "Admissions & Aid" },
  { to: "/transfer", label: "Transfer" },
  { to: "/student-life", label: "Student Life" },
  { to: "/enigma", label: "Enigma" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu after navigating.
  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On the home page the header floats over the dark hero until you scroll.
  const transparent = isHome && !scrolled;
  const dashboard = user ? homeFor(user.role) : "/login";
  const dashboardLabel = user?.role === "admin" ? "Admin" : "Portal";

  const pill = transparent
    ? "border border-white/25 bg-white/10 text-white hover:bg-white/20"
    : "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90";

  return (
    <header
      className={cn(
        "top-0 z-40 w-full transition-[background-color,border-color,box-shadow] duration-200",
        transparent
          ? "absolute inset-x-0 border-b border-transparent text-white"
          : "sticky border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo inverted={transparent} />

        <nav
          aria-label="Main"
          className="hidden items-center gap-1 text-sm font-medium lg:flex"
        >
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-2",
                  transparent
                    ? cn(
                        "text-white/85 hover:bg-white/10 hover:text-white",
                        isActive && "bg-white/15 text-white",
                      )
                    : cn(
                        "text-muted-foreground hover:bg-muted hover:text-foreground",
                        isActive && "bg-muted text-foreground",
                      ),
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle
            className={transparent ? "text-white hover:bg-white/10" : ""}
          />

          <Link
            to={dashboard}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold sm:px-4",
              pill,
            )}
          >
            {user ? (
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            ) : (
              <LogIn className="h-4 w-4" aria-hidden="true" />
            )}
            {user ? dashboardLabel : "Log in"}
          </Link>

          {user && (
            <button
              type="button"
              onClick={() => void logout()}
              className={cn(
                "hidden h-10 items-center gap-2 rounded-md px-3 text-sm font-medium sm:inline-flex",
                transparent
                  ? "text-white/90 hover:bg-white/10"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </button>
          )}

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className={cn(
                  "inline-grid h-10 w-10 place-items-center rounded-md lg:hidden",
                  transparent
                    ? "text-white hover:bg-white/10"
                    : "hover:bg-muted",
                )}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-80 flex-col">
              <SheetHeader className="text-left">
                <SheetTitle>
                  <span className="inline-flex items-center gap-2.5">
                    <img src="/logo.svg" alt="" className="h-7 w-7" />
                    ICAS
                  </span>
                </SheetTitle>
                <SheetDescription>
                  {user
                    ? `Signed in as ${user.name || user.email}`
                    : "International Center for Applied Science"}
                </SheetDescription>
              </SheetHeader>
              <nav
                aria-label="Mobile"
                className="mt-4 grid gap-1 text-base font-medium"
              >
                {nav.map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    className={({ isActive }) =>
                      cn(
                        "rounded-md px-3 py-3 hover:bg-muted",
                        isActive ? "bg-muted text-primary" : "text-foreground",
                      )
                    }
                  >
                    {n.label}
                  </NavLink>
                ))}
              </nav>
              <div className="mt-auto grid gap-2 border-t pt-4">
                <Link
                  to={dashboard}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  {user ? (
                    <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <LogIn className="h-4 w-4" aria-hidden="true" />
                  )}
                  {user ? `Open ${dashboardLabel}` : "Log in to the portal"}
                </Link>
                {user && (
                  <button
                    type="button"
                    onClick={() => void logout()}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Log out
                  </button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
