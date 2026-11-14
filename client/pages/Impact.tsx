import SEO from "@/components/SEO";
import { outreach } from "@/data/sample";

export default function Impact() {
  return (
    <main>
      <SEO
        title="Impact & Outreach — ICAS"
        description="Community projects and global partnerships."
      />
      <section className="container py-12">
        <h1 className="page-title">Impact & Outreach</h1>
        <p className="page-lead">
          Community programmes and outreach led by ICAS students and staff.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {outreach.map((o) => (
            <article
              key={o.title}
              className="rounded-xl bg-card p-6 border shadow-sm"
            >
              <h2 className="text-lg font-semibold">{o.title}</h2>
              <div className="text-sm text-muted-foreground">
                {o.region} • {o.impact}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Partners: {o.partners.join(", ")}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
