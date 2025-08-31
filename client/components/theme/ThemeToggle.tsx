import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="group relative h-9 w-16 overflow-hidden rounded-full border bg-gradient-to-b from-white to-muted dark:from-slate-900 dark:to-slate-800 ring-1 ring-border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* Decorative gradient 'photo-like' backgrounds */}
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(20%_30%_at_15%_30%,#fde68a_0%,transparent_60%),radial-gradient(25%_35%_at_85%_70%,#93c5fd_0%,transparent_60%)] opacity-70 transition dark:opacity-0" />
      <span aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition dark:opacity-80 bg-[radial-gradient(25%_35%_at_20%_30%,#60a5fa_0%,transparent_60%),radial-gradient(20%_30%_at_80%_70%,#fbbf24_0%,transparent_60%),radial-gradient(10%_10%_at_60%_20%,#ffffff_0%,transparent_60%)]" />

      {/* Track icons */}
      <span className="absolute left-1 top-1/2 -translate-y-1/2 text-slate-700 transition dark:text-slate-300">
        <Sun size={16} />
      </span>
      <span className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-500 transition dark:text-yellow-300">
        <Moon size={16} />
      </span>

      {/* Knob */}
      <span
        aria-hidden
        className={`absolute top-1/2 h-7 w-7 -translate-y-1/2 transform rounded-full bg-white shadow-soft ring-1 ring-border transition-transform duration-300 will-change-transform dark:bg-slate-900 ${
          isDark ? "translate-x-8" : "translate-x-1"
        }`}
      />
    </button>
  );
}
