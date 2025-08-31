import SEO from "@/components/SEO";
import { caseStudies, labs } from "@/data/sample";

export default function Research() {
  return (
    <main>
      <SEO title="Research & Medicine — ICAS" description="Labs, metrics, and translational case studies at ICAS." />
      <section className="container py-12">
        <h1 className="text-3xl font-bold tracking-tight">Research & Medicine</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">From lab to clinic: measurable outcomes and open collaboration.</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {caseStudies.map((cs) => (
            <article key={cs.title} className="rounded-xl bg-card p-6 ring-1 ring-border shadow-sm">
              <div className="text-xs uppercase text-muted-foreground">{cs.area}</div>
              <h2 className="mt-1 text-lg font-semibold">{cs.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{cs.summary}</p>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                {cs.metrics.map((m) => (
                  <div key={m.label} className="rounded-md bg-muted/40 p-3">
                    <dt className="text-muted-foreground">{m.label}</dt>
                    <dd className="font-semibold">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/20">
        <div className="container py-12">
          <h3 className="text-xl font-semibold">Active Labs</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {labs.map((l) => (
              <li key={l.name} className="rounded-lg bg-card p-4 ring-1 ring-border">
                <div className="font-medium">{l.name}</div>
                <div className="text-xs text-muted-foreground">{l.pi}</div>
                <p className="mt-2 text-sm">{l.focus}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
