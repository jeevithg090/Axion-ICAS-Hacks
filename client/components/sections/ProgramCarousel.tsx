import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { programs } from "@/data/sample";

export default function ProgramCarousel() {
  const [viewportRef, embla] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    loop: false,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const scrollPrev = useCallback(() => embla?.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla?.scrollNext(), [embla]);

  useEffect(() => {
    if (!embla) return;
    const update = () => {
      setCanPrev(embla.canScrollPrev());
      setCanNext(embla.canScrollNext());
    };
    update();
    embla.on("select", update).on("reInit", update);
    return () => {
      embla.off("select", update).off("reInit", update);
    };
  }, [embla]);

  const navButton =
    "inline-grid h-10 w-10 place-items-center rounded-md border bg-background hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <section aria-labelledby="programs-heading" className="container py-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="page-eyebrow">Undergraduate</p>
          <h2
            id="programs-heading"
            className="mt-1 text-2xl font-bold tracking-tight md:text-3xl"
          >
            Featured Programs
          </h2>
        </div>
        {(canPrev || canNext) && (
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous programme"
              onClick={scrollPrev}
              disabled={!canPrev}
              className={navButton}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next programme"
              onClick={scrollNext}
              disabled={!canNext}
              className={navButton}
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <div className="-mx-1 overflow-hidden px-1 py-1" ref={viewportRef}>
        <div className="-ml-4 flex">
          {programs.map((p) => (
            <div
              key={p.id}
              className="min-w-0 shrink-0 grow-0 basis-[88%] pl-4 sm:basis-1/2 lg:basis-1/3"
            >
              <article className="flex h-full flex-col rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                    <GraduationCap className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {p.level}
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{p.name}</h3>
                <div className="mt-1 text-xs text-muted-foreground">
                  {p.duration}
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/85">
                  {p.summary}
                </p>
                <Link
                  to="/academics"
                  className="link mt-5 inline-flex items-center gap-1 text-sm"
                  aria-label={`View details for ${p.name}`}
                >
                  View details
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
