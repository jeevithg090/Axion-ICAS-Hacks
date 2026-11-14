import SEO from "@/components/SEO";
import { events } from "@/data/sample";

export default function Events() {
  const groups = {
    current: events.filter((e) => e.status === "current"),
    upcoming: events.filter((e) => e.status === "upcoming"),
  };
  return (
    <main>
      <SEO title="Events — ICAS" description="Current and upcoming events." />
      <section className="container py-12">
        <h1 className="page-title">Events</h1>
        <p className="page-lead">
          Talks, colloquia and student events: what is on now, coming up and
          already done.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {Object.entries(groups).map(([key, list]) => (
            <div key={key}>
              <h2 className="text-xl font-semibold capitalize">{key}</h2>
              <ol className="mt-3 space-y-3">
                {list.map((e) => (
                  <li
                    key={e.title}
                    className="rounded-lg bg-card p-4 border shadow-sm"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-primary">
                        {new Date(e.date).toDateString()}
                      </span>
                      <span className="text-muted-foreground">
                        {e.location}
                      </span>
                    </div>
                    <div className="mt-1 font-medium">{e.title}</div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
