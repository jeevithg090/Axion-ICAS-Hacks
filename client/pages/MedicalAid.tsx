import SEO from "@/components/SEO";
import { medicalAid } from "@/data/sample";

export default function MedicalAid() {
  return (
    <main>
      <SEO title="Medical Aid — ICAS" description="On‑campus health services and insurance." />
      <section className="container py-12">
        <h1 className="text-3xl font-bold tracking-tight">Medical Aid</h1>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {medicalAid.map((m) => (
            <li key={m.service} className="rounded-xl bg-card p-6 ring-1 ring-border">
              <div className="font-semibold">{m.service}</div>
              <div className="text-sm text-muted-foreground">{m.hours}</div>
              <p className="mt-2 text-sm">{m.notes}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
