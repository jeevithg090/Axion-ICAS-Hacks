import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Search, SearchX } from "lucide-react";
import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { transferUniversities } from "@/data/sample";
import UniversityMap from "@/components/UniversityMap";

const steps = [
  {
    title: "Years 1–2 at MAHE, Manipal",
    body: "Complete the foundation curriculum and keep your GPA above your target university's cutoff.",
  },
  {
    title: "Shortlist and prepare",
    body: "Pick partner universities, gather transcripts, test scores and recommendation letters.",
  },
  {
    title: "Apply and transfer credits",
    body: "Submit applications; credits are mapped with advising support.",
  },
  {
    title: "Years 3–4 abroad",
    body: "Finish your degree at the partner university.",
  },
];

const groups = Object.entries(transferUniversities);
const total = groups.reduce((n, [, list]) => n + list.length, 0);

export default function Transfer() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map(
        ([country, list]) =>
          [
            country,
            country.toLowerCase().includes(q)
              ? list
              : list.filter((u) => u.name.toLowerCase().includes(q)),
          ] as const,
      )
      .filter(([, list]) => list.length > 0);
  }, [query]);
  const shown = filtered.reduce((n, [, list]) => n + list.length, 0);

  return (
    <main>
      <SEO
        title="Transfer — 2+2 Pathway"
        description="Transfer from ICAS (MAHE) to international partner universities for years 3–4."
      />
      <section className="container py-12">
        <PageHeader
          eyebrow="2+2 Pathway"
          title="Transfer abroad for years 3 and 4"
          description="Study 2 years at MAHE (Manipal) and 2 years abroad at a partner university. Credits are mapped with advising support."
          actions={
            <Link
              to="/portal/transfer"
              className="inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Track my transfer
            </Link>
          }
        />

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="surface p-5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {i + 1}
              </span>
              <h2 className="mt-3 font-semibold">{s.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">
            Partner universities worldwide
          </h2>
          <UniversityMap />
        </div>

        <div className="mt-12">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                All partner universities
              </h2>
              <p className="text-sm text-muted-foreground" aria-live="polite">
                {query
                  ? `${shown} of ${total} match “${query.trim()}”`
                  : `${total} universities in ${groups.length} countries`}
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <label htmlFor="uni-search" className="sr-only">
                Search universities or countries
              </label>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="uni-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search universities or countries"
                className="field h-11 pl-9"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No universities match your search"
              description="Try a shorter name, a city, or a country such as “Canada”."
              action={
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="inline-flex h-10 items-center rounded-md border px-4 text-sm font-medium hover:bg-muted"
                >
                  Clear search
                </button>
              }
            />
          ) : (
            <div className="grid gap-x-8 gap-y-10 md:grid-cols-2">
              {filtered.map(([country, list]) => (
                <section key={country} aria-labelledby={`c-${country}`}>
                  <h3
                    id={`c-${country}`}
                    className="mb-3 flex items-baseline justify-between gap-2 text-lg font-semibold"
                  >
                    <span>{country}</span>
                    <span className="text-xs font-medium text-muted-foreground">
                      {list.length}
                    </span>
                  </h3>
                  <ul className="divide-y overflow-hidden rounded-lg border bg-card text-sm">
                    {list.map((u) => (
                      <li key={u.name}>
                        <a
                          href={u.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between gap-3 px-4 py-3 font-medium hover:bg-muted/60 hover:text-primary"
                        >
                          <span>{u.name}</span>
                          <ExternalLink
                            className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                            aria-hidden="true"
                          />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
