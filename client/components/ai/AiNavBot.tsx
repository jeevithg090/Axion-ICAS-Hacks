import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Send, X } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  choices?: { label: string; to: string }[];
}

const ROUTES: { to: string; labels: string[] }[] = [
  { to: "/", labels: ["home", "homepage", "start"] },
  { to: "/about", labels: ["about", "timeline", "history", "research stats"] },
  { to: "/academics", labels: ["academics", "courses", "programs", "degree"] },
  {
    to: "/research",
    labels: ["research", "medicine", "labs", "case studies", "metrics"],
  },
  { to: "/student-life", labels: ["student", "life", "community", "feed"] },
  {
    to: "/admissions-aid",
    labels: ["admissions", "aid", "scholarships", "apply"],
  },
  { to: "/transfer", labels: ["transfer", "2+2", "pathway", "abroad"] },
  { to: "/news", labels: ["news", "featured", "records", "clips"] },
  { to: "/events", labels: ["events", "calendar", "upcoming", "current"] },
  { to: "/faculty", labels: ["faculty", "directory", "staff", "professors"] },
  {
    to: "/financial-aid",
    labels: ["financial", "aid", "scholarships", "tuition"],
  },
  { to: "/medical-aid", labels: ["medical", "health", "insurance", "care"] },
  { to: "/impact", labels: ["impact", "outreach", "community", "global"] },
  { to: "/contact", labels: ["contact", "email", "address", "phone"] },
  { to: "/portal", labels: ["portal", "dashboard", "assignments", "grades"] },
  {
    to: "/portal/transfer",
    labels: ["documents", "visa", "deadlines", "eligibility"],
  },
  {
    to: "/portal/study-centre",
    labels: ["study", "notes", "syllabus", "uploads"],
  },
  { to: "/portal/planner", labels: ["planner", "gpa", "credits", "schedule"] },
  { to: "/portal/buddies", labels: ["buddy", "mentor", "mentee", "peer"] },
  {
    to: "/portal/research-hub",
    labels: ["projects", "research hub", "team", "collaborate"],
  },
];

const LABELS: Record<string, string> = {
  "/": "Home",
  "/about": "About",
  "/academics": "Academics",
  "/research": "Research & Medicine",
  "/student-life": "Student Life",
  "/admissions-aid": "Admissions & Aid",
  "/transfer": "Transfer (2+2)",
  "/news": "News",
  "/events": "Events",
  "/faculty": "Faculty",
  "/financial-aid": "Financial Aid",
  "/medical-aid": "Medical Aid",
  "/impact": "Impact",
  "/contact": "Contact",
  "/portal": "Student Portal",
  "/portal/transfer": "Transfer Portal",
  "/portal/study-centre": "Study Centre",
  "/portal/planner": "Academic Planner",
  "/portal/buddies": "Buddy System",
  "/portal/research-hub": "Research Hub",
};

const labelFor = (to: string) => LABELS[to] ?? to;

function matchRoutes(q: string) {
  const query = q.toLowerCase();
  const matches = ROUTES.filter((r) =>
    r.labels.some((l) => query.includes(l)),
  ).slice(0, 5);
  return matches.map((m) => ({ label: labelFor(m.to), to: m.to }));
}

export default function AiNavBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I’m the ICAS navigator. Ask me to find pages, events, or resources—try ‘show upcoming events’ or ‘financial aid’.",
      choices: ["/transfer", "/admissions-aid", "/events"].map((to) => ({
        label: labelFor(to),
        to,
      })),
    },
  ]);
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Focus the input when opening; Escape closes and returns focus.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", content: q }]);

    const choices = matchRoutes(q);
    const response: Message = choices.length
      ? {
          role: "assistant",
          content: "Here’s what I found. Choose a destination:",
          choices,
        }
      : {
          role: "assistant",
          content:
            "I didn’t catch that. Try keywords like ‘research’, ‘events’, or ‘contact’.",
        };
    setMessages((m) => [...m, response]);
    setInput("");
  };

  const quick = useMemo(
    () => [
      { label: "About", to: "/about" },
      { label: "Academics", to: "/academics" },
      { label: "Events", to: "/events" },
    ],
    [],
  );

  const go = (to: string) => {
    navigate(to);
    setOpen(false);
  };

  const chip =
    "rounded-full border bg-background px-3 py-1.5 text-xs font-medium hover:border-primary/50 hover:bg-accent hover:text-accent-foreground";

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {open && (
        <section
          id="icas-navigator"
          aria-label="ICAS Navigator"
          className="mb-3 w-[min(calc(100vw-2rem),380px)] animate-fade-up overflow-hidden rounded-2xl border bg-card shadow-lift"
        >
          <div className="flex items-center justify-between gap-2 border-b bg-muted/40 px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold">ICAS Navigator</h2>
              <p className="text-xs text-muted-foreground">
                Type a topic and jump to the right page
              </p>
            </div>
            <button
              type="button"
              className="inline-grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setOpen(false)}
              aria-label="Close navigator"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div
            ref={listRef}
            aria-live="polite"
            className="max-h-72 space-y-3 overflow-auto p-4"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "assistant" ? "" : "text-right"}
              >
                <div
                  className={`inline-block max-w-[85%] rounded-2xl px-3 py-2 text-left text-sm ${m.role === "assistant" ? "rounded-tl-sm bg-muted text-foreground" : "rounded-tr-sm bg-primary text-primary-foreground"}`}
                >
                  {m.content}
                </div>
                {m.choices && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.choices.map((c) => (
                      <button
                        key={c.to}
                        type="button"
                        className={chip}
                        onClick={() => go(c.to)}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 border-t p-3">
            <label htmlFor="icas-navigator-input" className="sr-only">
              What are you looking for?
            </label>
            <input
              id="icas-navigator-input"
              ref={inputRef}
              className="field flex-1"
              placeholder="e.g. scholarships, visa, GPA"
              autoComplete="off"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              aria-label="Search"
              disabled={!input.trim()}
              className="inline-grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
          <div className="flex flex-wrap gap-2 border-t px-3 py-3">
            <span className="sr-only">Quick links:</span>
            {quick.map((q) => (
              <button
                key={q.to}
                type="button"
                className={chip}
                onClick={() => go(q.to)}
              >
                {q.label}
              </button>
            ))}
          </div>
        </section>
      )}

      <button
        ref={toggleRef}
        type="button"
        className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lift hover:-translate-y-0.5 hover:bg-primary/90"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="icas-navigator"
        aria-label={
          open ? "Close ICAS Navigator" : "Ask ICAS: open the navigator"
        }
      >
        {open ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        )}
        <span className="hidden sm:inline">Ask ICAS</span>
      </button>
    </div>
  );
}
