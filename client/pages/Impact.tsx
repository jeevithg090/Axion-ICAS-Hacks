import SEO from "@/components/SEO";
import { outreach } from "@/data/sample";

export default function Impact() {
  return (
    <main>
      <SEO title="Impact & Outreach — ICAS" description="Community projects and global partnerships." />
      <section className="container py-12">
        <h1 className="text-3xl font-bold tracking-tight">Impact & Outreach</h1>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {outreach.map((o) => (
            <article key={o.title} className="rounded-xl bg-card p-6 ring-1 ring-border">
              <h2 className="text-lg font-semibold">{o.title}</h2>
              <div className="text-sm text-muted-foreground">{o.region} • {o.impact}</div>
              <div className="mt-2 text-xs text-muted-foreground">Partners: {o.partners.join(", ")}</div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
