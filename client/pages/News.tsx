import { Newspaper } from "lucide-react";
import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import { news } from "@/data/sample";

export default function News() {
  return (
    <main>
      <SEO
        title="News & Featured Records — ICAS"
        description="Latest updates and featured records from ICAS."
      />
      <section className="container py-12">
        <PageHeader
          eyebrow="Newsroom"
          title="News & Featured Records"
          description="Highlights from ICAS students, clubs and partners."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {news.map((n) => (
            <article
              key={n.title}
              className="overflow-hidden rounded-xl border bg-card shadow-sm"
            >
              <div className="relative grid aspect-[16/7] place-items-center bg-gradient-to-br from-primary/15 via-background to-secondary/15">
                <div
                  aria-hidden
                  className="bg-grid absolute inset-0 opacity-60"
                />
                <Newspaper
                  className="relative h-10 w-10 text-primary/70"
                  aria-hidden="true"
                />
              </div>
              <div className="p-5">
                <h2 className="text-lg font-semibold">{n.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {n.summary}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
