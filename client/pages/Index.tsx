import { useEffect } from "react";
import { Link } from "react-router-dom";
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
    clip: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
  },
  {
    title: "Alumni story: From ICAS to leading vaccine delivery tech",
    clip: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
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

      {/* Hero with campus background */}
      <section className="relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/7972558/pexels-photo-7972558.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="University campus with students"
          className="absolute inset-0 h-full w-full object-cover"
          decoding="async"
          fetchPriority="high"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/25"
        />
        <div className="relative">
          <div className="container py-20 md:py-28">
            <div className="max-w-3xl text-white">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/25">
                International Center for Applied Science
              </span>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-6xl">
                Advancing knowledge. Improving lives.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
                ICAS, a MAHE constituent, offers a 2+2 engineering pathway — 2
                years in Manipal and 2 years abroad — across Computer Science,
                Aeronautical, and Mechatronics.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/academics"
                  className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  Explore Academics
                </Link>
                <Link
                  to="/research"
                  className="inline-flex items-center rounded-md bg-secondary px-4 py-2 text-secondary-foreground transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  Research & Medicine
                </Link>
              </div>
            </div>
          </div>
          {/* Wave separator */}
          <svg
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 w-full text-background"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              d="M0,64L48,58.7C96,53,192,43,288,53.3C384,64,480,96,576,122.7C672,149,768,171,864,154.7C960,139,1056,85,1152,74.7C1248,64,1344,96,1392,112L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            />
          </svg>
        </div>
      </section>

      {/* Categories */}
      <section className="container -mt-6 grid gap-4 pb-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Computer Science & Engineering",
            img: "https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=800",
          },
          {
            title: "Aeronautical Engineering",
            img: "https://images.pexels.com/photos/256219/pexels-photo-256219.jpeg?auto=compress&cs=tinysrgb&w=800",
          },
          {
            title: "Mechatronics",
            img: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=800",
          },
        ].map((c) => (
          <Link
            key={c.title}
            to="/academics"
            className="group relative overflow-hidden rounded-xl ring-1 ring-border"
          >
            <img
              src={c.img}
              alt={c.title}
              className="h-40 w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <div className="inline-flex rounded-md bg-white/90 px-2 py-1 text-xs font-semibold text-slate-900 backdrop-blur">
                {c.title}
              </div>
            </div>
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
            <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg bg-card p-4 text-center shadow-sm ring-1 ring-border"
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
          <div className="rounded-xl bg-gradient-to-br from-brand-600/10 to-secondary/10 p-6 ring-1 ring-border">
            <h3 className="text-lg font-semibold">
              Research & Medicine metrics
            </h3>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
              <div className="rounded-lg bg-card p-4 ring-1 ring-border">
                <dt className="text-muted-foreground">Clinical trials</dt>
                <dd className="mt-1 text-xl font-bold">36 active</dd>
              </div>
              <div className="rounded-lg bg-card p-4 ring-1 ring-border">
                <dt className="text-muted-foreground">Translational grants</dt>
                <dd className="mt-1 text-xl font-bold">$58M</dd>
              </div>
              <div className="rounded-lg bg-card p-4 ring-1 ring-border">
                <dt className="text-muted-foreground">Open datasets</dt>
                <dd className="mt-1 text-xl font-bold">48</dd>
              </div>
              <div className="rounded-lg bg-card p-4 ring-1 ring-border">
                <dt className="text-muted-foreground">Patents filed</dt>
                <dd className="mt-1 text-xl font-bold">92</dd>
              </div>
              <div className="rounded-lg bg-card p-4 ring-1 ring-border">
                <dt className="text-muted-foreground">Case studies</dt>
                <dd className="mt-1 text-xl font-bold">120+</dd>
              </div>
              <div className="rounded-lg bg-card p-4 ring-1 ring-border">
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
            <li
              key={d.name}
              className="rounded-lg bg-card p-4 ring-1 ring-border"
            >
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
            <li
              key={i}
              className="rounded-lg bg-card p-4 shadow-sm ring-1 ring-border"
            >
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

      {/* News & Featured Records with clips */}
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
                className="group overflow-hidden rounded-xl bg-card ring-1 ring-border"
              >
                <div className="aspect-video bg-muted/50">
                  <video
                    controls
                    preload="metadata"
                    className="h-full w-full object-cover"
                    src={n.clip + "#t=0.1"}
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold group-hover:underline">
                    {n.title}
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
            <li
              key={e.title}
              className="rounded-lg bg-card p-4 ring-1 ring-border"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">
                  {e.date}
                </span>
                <span
                  className={`text-xs ${e.status === "current" ? "text-green-600" : "text-muted-foreground"}`}
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
          <div className="flex flex-col items-start gap-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 p-8 ring-1 ring-border md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-bold tracking-tight">Join ICAS</h3>
              <p className="mt-1 text-muted-foreground">
                Learn how to apply, connect with faculty, and access financial &
                medical aid.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Contact Admissions
              </Link>
              <Link
                to="/financial-aid"
                className="inline-flex items-center rounded-md bg-secondary px-4 py-2 text-secondary-foreground transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
