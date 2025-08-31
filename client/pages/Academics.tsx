import SEO from "@/components/SEO";
import { programs, courses, twoPlusTwoPartners } from "@/data/sample";

export default function Academics() {
  return (
    <main>
      <SEO title="Academics — ICAS (MAHE)" description="Engineering at ICAS, a MAHE constituent, with a 2+2 international pathway (2 years in Manipal + 2 years abroad)." />

      <section className="container py-12">
        <h1 className="text-3xl font-bold tracking-tight">Academics</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          ICAS is a MAHE constituent offering Computer Science, Aeronautical Engineering, and Mechatronics in a 2+2 format: 2 years in Manipal, 2 years abroad.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {programs.map((p) => (
            <article key={p.id} className="rounded-xl bg-card p-6 ring-1 ring-border shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{p.level}</div>
              <h2 className="mt-1 text-lg font-semibold">{p.name}</h2>
              <div className="mt-1 text-xs text-muted-foreground">{p.duration}</div>
              <p className="mt-3 text-sm">{p.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/20">
        <div className="container grid gap-8 py-12 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-semibold">The 2+2 Pathway</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
              <li>Years 1–2: Foundational engineering at MAHE, Manipal (ICAS).</li>
              <li>Years 3–4: Transfer to an international partner to complete the degree.</li>
              <li>Credits mapped and academic support throughout.</li>
            </ol>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Sample Partners</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {twoPlusTwoPartners.map((p) => (
                <li key={p.name} className="rounded-md bg-card p-3 text-sm ring-1 ring-border">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.country}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <h3 className="text-xl font-semibold">Featured Courses</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {courses.map((c) => (
            <li key={c.code} className="rounded-lg bg-card p-4 ring-1 ring-border">
              <div className="text-sm font-medium">{c.title}</div>
              <div className="text-xs text-muted-foreground">{c.code} • {c.credits} credits</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
