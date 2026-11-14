import SEO from "@/components/SEO";
import { scholarships } from "@/data/sample";

export default function FinancialAid() {
  return (
    <main>
      <SEO
        title="Financial Aid — ICAS"
        description="Scholarships, grants, and assistantships."
      />
      <section className="container py-12">
        <h1 className="page-title">Financial Aid</h1>
        <p className="page-lead">
          Scholarships and fee support available to ICAS students.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {scholarships.map((s) => (
            <article
              key={s.name}
              className="rounded-xl bg-card p-6 border shadow-sm"
            >
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
