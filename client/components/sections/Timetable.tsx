import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { timetableMeta, timetableSlots } from "@/data/sample";

function minutesSince(dayStart: string, time: string) {
  const [sh, sm] = dayStart.split(":").map(Number);
  const [h, m] = time.split(":").map(Number);
  return (h - sh) * 60 + (m - sm);
}

const HOUR_HEIGHT = 64; // px per hour
const DAY_START = "08:00";
const HOURS = Array.from({ length: 10 }).map((_, i) => {
  const h = 8 + i;
  const label = `${((h + 11) % 12) + 1}:00 ${h < 12 ? "AM" : "PM"}`;
  const value = `${h.toString().padStart(2, "0")}:00`;
  return { label, value };
});

const COLORS: Record<string, string> = {
  violet: "bg-violet-500/90 text-white",
  pink: "bg-pink-500/90 text-white",
  emerald: "bg-emerald-500/90 text-white",
  cyan: "bg-cyan-500/90 text-white",
  orange: "bg-orange-500/90 text-white",
  blue: "bg-blue-500/90 text-white",
  indigo: "bg-indigo-500/90 text-white",
};

export default function Timetable() {
  const days = timetableMeta.days;
  const height = HOURS.length * HOUR_HEIGHT;
  return (
    <section className="container py-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Class Timetable</h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="rounded-md border px-2 py-1">{timetableMeta.semester}</span>
          <span className="rounded-md border px-2 py-1">{timetableMeta.program}</span>
        </div>
      </div>

      <Card className="mt-6 overflow-hidden">
        <div
          className="grid"
          style={{ gridTemplateColumns: `80px repeat(${days.length}, minmax(0,1fr))` }}
        >
          <div className="bg-muted/40">
            <div className="sticky top-0 z-10 border-b bg-muted/50 p-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Time
            </div>
            <div style={{ height }} className="relative">
              {HOURS.map((h, i) => (
                <div key={h.value} className="relative" style={{ height: HOUR_HEIGHT }}>
                  <div className="absolute inset-y-0 right-2 flex items-start pt-1 text-xs text-muted-foreground">
                    {h.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {days.map((day) => (
            <div key={day} className="relative">
              <div className="sticky top-0 z-10 border-b bg-background/70 p-3 text-sm font-semibold">
                {day}
              </div>
              <div style={{ height }} className="relative">
                {/* hour grid lines */}
                {HOURS.map((h, i) => (
                  <div
                    key={h.value}
                    className={cn("absolute left-0 right-0 border-t", i === 0 && "border-t-0")}
                    style={{ top: i * HOUR_HEIGHT }}
                  />
                ))}
                {/* slots */}
                {timetableSlots
                  .filter((s) => s.day === day)
                  .map((s, idx) => {
                    const top = (minutesSince(DAY_START, s.start) / 60) * HOUR_HEIGHT;
                    const heightPx = (minutesSince(s.start, s.end) / 60) * HOUR_HEIGHT;
                    return (
                      <div
                        key={idx}
                        className={cn(
                          "absolute left-2 right-2 rounded-md p-2 text-xs shadow-sm ring-1 ring-black/10",
                          COLORS[s.color] ?? COLORS.violet,
                        )}
                        style={{ top, height: Math.max(heightPx, 36) }}
                        title={`${s.course} • ${s.start}–${s.end}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{s.course}</span>
                          {s.room && <span className="ml-2 rounded bg-white/20 px-1.5 py-0.5 text-[10px]">{s.room}</span>}
                        </div>
                        <div className="mt-0.5 opacity-90">{s.code}</div>
                        <div className="opacity-90">{s.start} – {s.end}</div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
