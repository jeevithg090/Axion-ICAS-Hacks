import SEO from "@/components/SEO";
import { medicalAid } from "@/data/sample";

export default function MedicalAid() {
  return (
    <main>
      <SEO
        title="Medical Aid — ICAS"
        description="On‑campus health services and insurance."
      />
      <section className="container py-12">
        <h1 className="page-title">Medical Aid</h1>
        <p className="page-lead">
          Health services and medical support available on campus.
        </p>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {medicalAid.map((m) => (
            <li
              key={m.service}
              className="rounded-xl bg-card p-6 border shadow-sm"
            >
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
