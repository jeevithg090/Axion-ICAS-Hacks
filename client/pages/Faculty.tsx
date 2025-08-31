import SEO from "@/components/SEO";
import { faculty } from "@/data/sample";

export default function Faculty() {
  return (
    <main>
      <SEO title="Faculty Directory — ICAS" description="Meet our faculty and their qualifications." />
      <section className="container py-12">
        <h1 className="text-3xl font-bold tracking-tight">Faculty Directory</h1>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {faculty.map((f) => (
            <article key={f.name} className="rounded-xl bg-card p-6 ring-1 ring-border">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{f.name}</h2>
                  <div className="text-sm text-muted-foreground">{f.title} • {f.department}</div>
                </div>
              </div>
              <ul className="mt-3 list-disc pl-5 text-sm">
                {f.qualifications.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
              <a href={`mailto:${f.email}`} className="mt-3 inline-block text-sm text-primary underline-offset-4 hover:underline">{f.email}</a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
