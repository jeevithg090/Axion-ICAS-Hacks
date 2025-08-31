import SEO from "@/components/SEO";
import { scholarships, medicalAid } from "@/data/sample";
import { Link } from "react-router-dom";

export default function AdmissionsAid() {
  return (
    <main>
      <SEO title="Admissions & Aid — ICAS (MAHE)" description="How to apply, scholarships, and medical support." />
      <section className="container py-12">
        <h1 className="text-3xl font-bold tracking-tight">Admissions & Aid</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">Get started with applications and explore scholarships and campus medical support.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="rounded-xl bg-card p-6 ring-1 ring-border">
            <h2 className="text-lg font-semibold">Scholarships & Grants</h2>
            <ul className="mt-3 space-y-3 text-sm">
              {scholarships.map((s) => (
                <li key={s.name} className="rounded-md bg-muted/30 p-3">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.amount}</div>
                  <p className="mt-1">{s.criteria}</p>
                </li>
              ))}
            </ul>
            <Link to="/financial-aid" className="mt-4 inline-block text-sm text-primary underline-offset-4 hover:underline">More on Financial Aid</Link>
          </article>
          <article className="rounded-xl bg-card p-6 ring-1 ring-border">
            <h2 className="text-lg font-semibold">Medical Aid</h2>
            <ul className="mt-3 space-y-3 text-sm">
              {medicalAid.map((m) => (
                <li key={m.service} className="rounded-md bg-muted/30 p-3">
                  <div className="font-medium">{m.service}</div>
                  <div className="text-xs text-muted-foreground">{m.hours}</div>
                  <p className="mt-1">{m.notes}</p>
                </li>
              ))}
            </ul>
            <Link to="/medical-aid" className="mt-4 inline-block text-sm text-primary underline-offset-4 hover:underline">More on Medical Aid</Link>
          </article>
        </div>
      </section>
    </main>
  );
}
