const initials = (name: string) =>
  name
    .replace(/^Dr\.\s*/, "")
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function Testimonials() {
  const items = [
    {
      quote:
        "ICAS gave me a platform to turn research into real clinical impact.",
      name: "Aarav K.",
      role: "Alumni, Biomedical Engineering",
    },
    {
      quote:
        "Mentorship and open collaboration make this community truly unique.",
      name: "Priya S.",
      role: "Ph.D. Candidate, AI for Health",
    },
    {
      quote:
        "My lab’s partnership with ICAS accelerated deployment to hospitals.",
      name: "Dr. James R.",
      role: "Clinical Partner",
    },
  ];
  return (
    <section className="container py-14">
      <h2 className="text-2xl font-bold tracking-tight">
        What our community says
      </h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {items.map((t) => (
          <figure
            key={t.name}
            className="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm"
          >
            <blockquote className="text-base leading-relaxed">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-sm font-semibold text-foreground"
              >
                {initials(t.name)}
              </span>
              <div>
                <div className="text-sm font-medium">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
