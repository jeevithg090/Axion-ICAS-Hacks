import SEO from "@/components/SEO";
import { scholarships } from "@/data/sample";

export default function FinancialAid() {
  return (
    <main>
      <SEO title="Financial Aid — ICAS" description="Scholarships, grants, and assistantships." />
      <section className="container py-12">
        <h1 className="text-3xl font-bold tracking-tight">Financial Aid</h1>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {scholarships.map((s) => (
            <article key={s.name} className="rounded-xl bg-card p-6 ring-1 ring-border">
              <h2 className="text-lg font-semibold">{s.name}</h2>
              <div className="text-sm text-muted-foreground">{s.amount}</div>
              <p className="mt-2 text-sm">{s.criteria}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
