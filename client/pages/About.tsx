import SEO from "@/components/SEO";

const timeline = [
  { year: 1967, text: "ICAS founded to accelerate applied science for society." },
  { year: 1984, text: "First interdisciplinary center launched: Biomedical Devices." },
  { year: 2003, text: "Global partnerships program established across 12 countries." },
  { year: 2015, text: "Translational medicine initiative—bench to bedside." },
  { year: 2024, text: "AI for Health lab opens; 10 active clinical collaborations." },
];

export default function About() {
  return (
    <main className="min-h-screen">
      <SEO title="About ICAS — Timeline & Research Stats" description="Explore the ICAS story and our measurable research impact." />
      <section className="container py-14">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">About ICAS</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          A community where discovery meets impact. Our timeline highlights milestones
          in research, education, and global outreach.
        </p>

        <ol className="mt-8 space-y-4 border-l pl-6">
          {timeline.map((t) => (
            <li key={t.year} className="relative">
              <span className="absolute -left-2 top-1.5 h-3 w-3 rounded-full bg-primary" aria-hidden />
              <div className="text-sm text-muted-foreground">{t.year}</div>
              <div className="text-base font-medium">{t.text}</div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y bg-muted/20">
        <div className="container grid gap-6 py-14 md:grid-cols-3">
          {[{ label: "Research citations", value: "48k+" }, { label: "H-index (aggregate)", value: "210" }, { label: "External funding (5yr)", value: "$240M" }].map((s) => (
            <div key={s.label} className="rounded-xl bg-card p-6 text-center shadow-sm ring-1 ring-border">
              <div className="text-3xl font-extrabold text-primary">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
