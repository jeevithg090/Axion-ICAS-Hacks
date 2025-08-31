import SEO from "@/components/SEO";
import { news } from "@/data/sample";

export default function News() {
  return (
    <main>
      <SEO title="News & Featured Records — ICAS" description="Latest updates and featured clips." />
      <section className="container py-12">
        <h1 className="text-3xl font-bold tracking-tight">News & Featured Records</h1>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {news.map((n) => (
            <article key={n.title} className="overflow-hidden rounded-xl bg-card ring-1 ring-border">
              <div className="aspect-video bg-muted/40">
                <video controls preload="metadata" className="h-full w-full object-cover" src={n.clip + "#t=0.1"} />
              </div>
              <div className="p-5">
                <h2 className="text-lg font-semibold">{n.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{n.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
