import SEO from "@/components/SEO";
import { enigma, events } from "@/data/sample";

export default function Enigma() {
  const upcoming = events.filter((e) => e.title.toLowerCase().includes("enigma"));
  return (
    <main>
      <SEO title="Enigma — ICAS Student Club" description="Enigma club: Development, Robotics, and Research domains at ICAS." />
      <section className="container py-12">
        <h1 className="text-3xl font-bold tracking-tight">{enigma.name} Club</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{enigma.description}</p>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {enigma.domains.map((d) => (
            <article key={d.name} className="overflow-hidden rounded-xl bg-card ring-1 ring-border">
              {"image" in d && (
                <img src={(d as any).image} alt={`${d.name} domain`} className="h-40 w-full object-cover" loading="lazy" />
              )}
              <div className="p-6">
                <h2 className="text-lg font-semibold">{d.name}</h2>
                <p className="mt-2 text-sm">{d.blurb}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/20">
        <div className="container py-12">
          <h3 className="text-xl font-semibold">Upcoming Enigma Events</h3>
          <ol className="mt-4 space-y-3">
            {upcoming.map((e) => (
              <li key={e.title} className="rounded-lg bg-card p-4 ring-1 ring-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-primary">{new Date(e.date).toDateString()}</span>
                  <span className="text-muted-foreground">{e.location}</span>
                </div>
                <div className="mt-1 font-medium">{e.title}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
