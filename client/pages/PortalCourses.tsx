import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { portalCourses } from "@/data/sample";

export default function PortalCourses() {
  return (
    <main>
      <SEO title="Courses — Portal" description="Your enrolled courses." />
      <section className="container py-10">
        <PageHeader
          eyebrow="Student Portal"
          title="My Courses"
          description="Open a course to see its syllabus and submit assignments."
          actions={
            <Button asChild variant="outline">
              <Link to="/portal">
                <ArrowLeft aria-hidden="true" />
                Dashboard
              </Link>
            </Button>
          }
        />
        <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {portalCourses.map((c) => (
            <li key={c.code}>
              <Link
                to={`/portal/courses/${encodeURIComponent(c.code)}`}
                className="group flex h-full flex-col rounded-xl border bg-card p-5 shadow-sm hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <BookOpen className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                    {c.code}
                  </span>
                </div>
                <h2 className="mt-4 font-semibold group-hover:text-primary">
                  {c.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {c.instructor}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Progress
                    value={c.progress}
                    className="h-2"
                    aria-label={`${c.title} progress`}
                  />
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {c.progress}%
                  </span>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open course
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
