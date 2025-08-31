import SEO from "@/components/SEO";
import Timetable from "@/components/sections/Timetable";
import AlumniPortal from "@/components/sections/AlumniPortal";

const feed = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  author: `Student @${120 + i}`,
  time: `${1 + (i % 5)}h ago`,
  text: [
    "Prototype demo at the Innovation Hub!",
    "Volleyball finals this weekend — join in!",
    "Open mic night at the quad was amazing!",
    "Study group forming for BIO422.",
  ][i % 4],
}));

export default function StudentLife() {
  return (
    <main>
      <SEO title="Student Life — ICAS" description="Community feed and campus highlights." />
      <section className="container py-12">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Student Life</h1>
          <span className="rounded-md border px-2 py-1 text-xs">Private feed (sample)</span>
        </div>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {feed.map((p) => (
            <li key={p.id} className="rounded-lg bg-card p-4 ring-1 ring-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30" />
                <div>
                  <div className="text-sm font-medium">{p.author}</div>
                  <div className="text-xs text-muted-foreground">{p.time}</div>
                </div>
              </div>
              <p className="mt-3 text-sm">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>
      <Timetable />
      <AlumniPortal />
    </main>
  );
}
