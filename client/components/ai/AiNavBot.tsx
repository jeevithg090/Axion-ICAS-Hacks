import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/theme/ThemeToggle";

interface Message {
  role: "user" | "assistant";
  content: string;
  choices?: { label: string; to: string }[];
}

const ROUTES: { to: string; labels: string[] }[] = [
  { to: "/", labels: ["home", "homepage", "start"] },
  { to: "/about", labels: ["about", "timeline", "history", "research stats"] },
  { to: "/academics", labels: ["academics", "courses", "programs", "degree"] },
  { to: "/research", labels: ["research", "medicine", "labs", "case studies", "metrics"] },
  { to: "/student-life", labels: ["student", "life", "community", "feed"] },
  { to: "/admissions-aid", labels: ["admissions", "aid", "scholarships", "apply"] },
  { to: "/transfer", labels: ["transfer", "2+2", "pathway", "abroad"] },
  { to: "/news", labels: ["news", "featured", "records", "clips"] },
  { to: "/events", labels: ["events", "calendar", "upcoming", "current"] },
  { to: "/faculty", labels: ["faculty", "directory", "staff", "professors"] },
  { to: "/financial-aid", labels: ["financial", "aid", "scholarships", "tuition"] },
  { to: "/medical-aid", labels: ["medical", "health", "insurance", "care"] },
  { to: "/impact", labels: ["impact", "outreach", "community", "global"] },
  { to: "/contact", labels: ["contact", "email", "address", "phone"] },
];

function matchRoutes(q: string) {
  const query = q.toLowerCase();
  const matches = ROUTES.filter((r) =>
    r.labels.some((l) => query.includes(l)),
  ).slice(0, 5);
  return matches.map((m) => ({ label: m.to.split("/").slice(-1)[0] || "home", to: m.to }));
}

export default function AiNavBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content:
      "Hi! I’m the ICAS navigator. Ask me to find pages, events, or resources—try ‘show upcoming events’ or ‘financial aid’.",
    choices: ROUTES.slice(1, 4).map((r) => ({ label: r.to.replace("/", "") || "home", to: r.to })),
  }]);
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
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

  return (
    <div aria-live="polite" className="fixed bottom-4 right-4 z-50">
      {/* Panel */}
      {open && (
        <div className="mb-3 w-[min(92vw,380px)] overflow-hidden rounded-xl bg-card shadow-soft ring-1 ring-border">
          <div className="flex items-center justify-between border-b p-3">
            <div className="text-sm font-semibold">ICAS Navigator</div>
            <button
              className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
              onClick={() => setOpen(false)}
              aria-label="Close navigator"
            >
              Close
            </button>
          </div>
          <div ref={listRef} className="max-h-72 space-y-3 overflow-auto p-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "assistant" ? "" : "text-right"}>
                <div className={`inline-block rounded-lg px-3 py-2 text-sm ${m.role === "assistant" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"}`}>
                  {m.content}
                </div>
                {m.choices && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.choices.map((c) => (
                      <button
                        key={c.to}
                        className="rounded-md border px-2 py-1 text-xs hover:bg-muted"
                        onClick={() => {
                          navigate(c.to);
                          setOpen(false);
                        }}
                      >
                        {c.label || "open"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 border-t p-3">
            <input
              aria-label="Ask ICAS"
              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Ask to navigate…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:brightness-110"
            >
              Go
            </button>
          </form>
          <div className="border-t p-3">
            <div className="flex flex-wrap gap-2">
              {quick.map((q) => (
                <button
                  key={q.to}
                  className="rounded-md border px-2 py-1 text-xs hover:bg-muted"
                  onClick={() => {
                    navigate(q.to);
                    setOpen(false);
                  }}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toggles row */}
      <div className="flex items-center justify-end gap-2">
        <ThemeToggle />
        <button
          className="flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="icas-navigator"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          Ask ICAS
        </button>
      </div>
    </div>
  );
}
