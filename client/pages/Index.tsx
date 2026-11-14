import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Cpu,
  Newspaper,
  Plane,
  type LucideIcon,
} from "lucide-react";
import SEO from "@/components/SEO";
import ProgramCarousel from "@/components/sections/ProgramCarousel";
import Partners from "@/components/sections/Partners";
import Testimonials from "@/components/sections/Testimonials";
import Newsletter from "@/components/sections/Newsletter";

const stats = [
  { label: "Years of Impact", value: "58" },
  { label: "Active Research Labs", value: "24" },
  { label: "Peer‑Reviewed Publications", value: "1,200+" },
  { label: "Countries Represented", value: "72" },
];

const events = [
  { date: "Nov 18", title: "Global Health Symposium", status: "current" },
  { date: "Dec 02", title: "Materials Science Colloquium", status: "upcoming" },
  { date: "Dec 12", title: "AI in Medicine Roundtable", status: "upcoming" },
];

const news = [
  {
    title: "ICAS researchers publish breakthrough on wearable diagnostics",
    tag: "Research",
  },
  {
    title: "Alumni story: From ICAS to leading vaccine delivery tech",
    tag: "Alumni",
  },
];

const categories: {
  title: string;
  blurb: string;
  icon: LucideIcon;
  tone: string;
}[] = [
  {
    title: "Computer Science & Engineering",
    blurb: "AI/ML, systems and product engineering.",
    icon: Cpu,
    tone: "bg-primary/10 text-primary",
  },
  {
    title: "Aeronautical Engineering",
    blurb: "Aerodynamics, propulsion and avionics.",
    icon: Plane,
    tone: "bg-secondary/10 text-secondary dark:text-blue-300",
  },
  {
    title: "Mechatronics",
    blurb: "Robotics, embedded systems and control.",
    icon: Bot,
    tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
];

export default function Index() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen">
      <SEO
        title="ICAS — International Center for Applied Science"
        description="A modern, accessible, and inspiring institute advancing research, medicine, and education worldwide."
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_85%_0%,hsl(20_88%_45%/0.45),transparent_60%),radial-gradient(55%_65%_at_0%_100%,hsl(221_70%_46%/0.5),transparent_60%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60 [background-image:radial-gradient(rgb(255_255_255/0.09)_1px,transparent_1px)] [background-size:22px_22px]"
        />
        <div className="container pb-28 pt-32 md:pb-36 md:pt-40">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-orange-400"
              />
              International Center for Applied Science
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] sm:text-5xl md:text-6xl">
              Advancing knowledge.{" "}
              <span className="bg-gradient-to-r from-orange-300 to-amber-200 bg-clip-text text-transparent">
                Improving lives.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
              ICAS, a MAHE constituent, offers a 2+2 engineering pathway — 2
              years in Manipal and 2 years abroad — across Computer Science,
              Aeronautical, and Mechatronics.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/academics"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 font-semibold text-primary-foreground shadow-lg shadow-orange-900/30 hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Explore Academics
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/transfer"
                className="inline-flex h-11 items-center rounded-md border border-white/25 bg-white/10 px-5 font-semibold text-white hover:bg-white/20"
              >
                How the 2+2 transfer works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Programme categories */}
      <section
        aria-label="Engineering programmes"
        className="container relative z-10 -mt-16 grid gap-4 pb-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {categories.map((c) => (
          <Link
            key={c.title}
            to="/academics"
            className="group surface flex items-start gap-4 p-5 shadow-lift hover:-translate-y-1 hover:border-primary/40"
          >
            <span
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${c.tone}`}
            >
              <c.icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold group-hover:text-primary">
                {c.title}
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                {c.blurb}
              </span>
            </span>
          </Link>
        ))}
      </section>

      {/* Featured Programs */}
      <ProgramCarousel />

      {/* Highlights */}
      <section className="border-y bg-background/50">
        <div className="container grid gap-10 py-12 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              A legacy of breakthroughs
            </h2>
            <p className="mt-3 text-muted-foreground">
              Since 1967, ICAS has pioneered applied research from the lab to
              the clinic. Explore our timeline, faculty, and global
              partnerships.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg bg-card p-4 text-center shadow-sm border"
                >
                  <div className="text-2xl font-bold text-primary">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link
                to="/about"
                className="text-primary underline-offset-4 hover:underline"
              >
                About ICAS: timeline & research stats
              </Link>
            </div>
          </div>

          {/* Research metrics */}
          <div className="rounded-xl bg-gradient-to-br from-brand-600/10 to-secondary/10 p-6 border">
            <h3 className="text-lg font-semibold">
              Research & Medicine metrics
            </h3>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm xl:grid-cols-3">
              <div className="rounded-lg bg-card p-4 border">
                <dt className="text-muted-foreground">Clinical trials</dt>
                <dd className="mt-1 text-xl font-bold">36 active</dd>
              </div>
              <div className="rounded-lg bg-card p-4 border">
                <dt className="text-muted-foreground">Translational grants</dt>
                <dd className="mt-1 text-xl font-bold">$58M</dd>
              </div>
              <div className="rounded-lg bg-card p-4 border">
                <dt className="text-muted-foreground">Open datasets</dt>
                <dd className="mt-1 text-xl font-bold">48</dd>
              </div>
              <div className="rounded-lg bg-card p-4 border">
                <dt className="text-muted-foreground">Patents filed</dt>
                <dd className="mt-1 text-xl font-bold">92</dd>
              </div>
              <div className="rounded-lg bg-card p-4 border">
                <dt className="text-muted-foreground">Case studies</dt>
                <dd className="mt-1 text-xl font-bold">120+</dd>
              </div>
              <div className="rounded-lg bg-card p-4 border">
                <dt className="text-muted-foreground">Global partners</dt>
                <dd className="mt-1 text-xl font-bold">150</dd>
              </div>
            </dl>
            <div className="mt-4">
              <Link
                to="/research"
                className="text-primary underline-offset-4 hover:underline"
              >
                See case studies and clinical impact
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <Partners />

      {/* Enigma student club */}
      <section className="container py-14">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight">
            Enigma — Student Club
          </h2>
          <Link
            to="/enigma"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            Explore Enigma
          </Link>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {[
            { name: "Development", blurb: "Web, mobile, cloud & hackathons." },
            { name: "Robotics", blurb: "Mechanisms, electronics, control." },
            { name: "Research", blurb: "Papers, reviews, reproducibility." },
          ].map((d) => (
            <li key={d.name} className="rounded-lg bg-card p-4 border">
              <div className="text-lg font-semibold">{d.name}</div>
              <p className="mt-1 text-sm text-muted-foreground">{d.blurb}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Student Life feed preview */}
      <section className="container py-14">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Student Life</h2>
          <Link
            to="/student-life"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            View private feed
          </Link>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <li key={i} className="rounded-lg bg-card p-4 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                <div>
                  <p className="text-sm font-medium">
                    Student @{""}
                    {100 + i}
                  </p>
                  <p className="text-xs text-muted-foreground">2h ago</p>
                </div>
              </div>
              <p className="mt-3 text-sm">
                Lab showcase and community highlights from the ICAS innovation
                hub.
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* News & Featured Records */}
      <section className="border-y bg-muted/20">
        <div className="container py-14">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              News & Featured Records
            </h2>
            <Link
              to="/news"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              All news
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {news.map((n) => (
              <article
                key={n.title}
                className="group relative overflow-hidden rounded-xl border bg-card shadow-sm hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="relative grid aspect-[16/7] place-items-center overflow-hidden bg-gradient-to-br from-primary/15 via-background to-secondary/15">
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
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {n.tag}
                  </span>
                  <h3 className="mt-1 text-lg font-semibold">
                    <Link
                      to="/news"
                      className="after:absolute after:inset-0 group-hover:text-primary"
                    >
                      {n.title}
                    </Link>
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="container py-14">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Events</h2>
          <Link
            to="/events"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            View calendar
          </Link>
        </div>
        <ol className="grid gap-4 md:grid-cols-3">
          {events.map((e) => (
            <li key={e.title} className="rounded-lg bg-card p-4 border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">
                  {e.date}
                </span>
                <span
                  className={`text-xs ${e.status === "current" ? "font-medium text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"}`}
                >
                  {e.status === "current" ? "Happening now" : "Upcoming"}
                </span>
              </div>
              <p className="mt-2 font-medium">{e.title}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Call to action */}
      <section className="relative isolate overflow-hidden py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-10 -top-10 h-40 bg-[radial-gradient(50%_50%_at_50%_0%,hsl(var(--primary)/0.12),transparent)]"
        />
        <div className="container">
          <div className="flex flex-col items-start gap-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 p-8 border md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Join ICAS</h2>
              <p className="mt-1 text-muted-foreground">
                Learn how to apply, connect with faculty, and access financial &
                medical aid.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex h-11 items-center rounded-md bg-primary px-5 font-semibold text-primary-foreground shadow-sm hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Contact Admissions
              </Link>
              <Link
                to="/financial-aid"
                className="inline-flex h-11 items-center rounded-md border bg-background px-5 font-semibold hover:-translate-y-0.5 hover:bg-muted"
              >
                Financial & Medical Aid
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />
      <Newsletter />
    </main>
  );
}
