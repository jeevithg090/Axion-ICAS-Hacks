export default function Testimonials() {
  const items = [
    {
      quote:
        "ICAS gave me a platform to turn research into real clinical impact.",
      name: "Aarav K.",
      role: "Alumni, Biomedical Engineering",
      avatar: "https://i.pravatar.cc/80?img=12",
    },
    {
      quote:
        "Mentorship and open collaboration make this community truly unique.",
      name: "Priya S.",
      role: "Ph.D. Candidate, AI for Health",
      avatar: "https://i.pravatar.cc/80?img=32",
    },
    {
      quote: "My lab’s partnership with ICAS accelerated deployment to hospitals.",
      name: "Dr. James R.",
      role: "Clinical Partner",
      avatar: "https://i.pravatar.cc/80?img=5",
    },
  ];
  return (
    <section className="container py-14">
      <h2 className="text-2xl font-bold tracking-tight">What our community says</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {items.map((t) => (
          <figure key={t.name} className="rounded-xl bg-card p-6 ring-1 ring-border">
            <blockquote className="text-sm leading-relaxed">“{t.quote}”</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <img src={t.avatar} alt="" className="h-10 w-10 rounded-full" loading="lazy" />
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
