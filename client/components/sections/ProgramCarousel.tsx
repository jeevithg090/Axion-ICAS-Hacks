import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import { programs } from "@/data/sample";

export default function ProgramCarousel() {
  const [viewportRef, embla] = useEmblaCarousel({ align: "start", slidesToScroll: 1, loop: false });

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);

  return (
    <section className="container py-12">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Featured Programs</h2>
        <div className="hidden gap-2 md:flex">
          <button aria-label="Previous" onClick={scrollPrev} className="rounded-md border p-2 hover:bg-muted">
            <ChevronLeft size={18} />
          </button>
          <button aria-label="Next" onClick={scrollNext} className="rounded-md border p-2 hover:bg-muted">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={viewportRef}>
        <div className="-ml-4 flex">
          {programs.map((p) => (
            <article key={p.id} className="ml-4 min-w-[85%] shrink-0 rounded-xl bg-card p-6 ring-1 ring-border shadow-sm sm:min-w-[55%] md:min-w-[33%]">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                  <GraduationCap size={18} />
                </div>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{p.level}</div>
              </div>
              <h3 className="mt-3 text-lg font-semibold">{p.name}</h3>
              <div className="text-xs text-muted-foreground">{p.duration}</div>
              <p className="mt-3 text-sm">{p.summary}</p>
              <button className="mt-4 inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:bg-muted">View details</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
