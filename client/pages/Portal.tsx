import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import {
  BookOpen,
  CalendarRange,
  FlaskConical,
  NotebookPen,
  Plane,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";
import {
  portalCourses,
  portalAssignments,
  portalAnnouncements,
  portalGrades,
} from "@/data/sample";
import { Link } from "react-router-dom";
import DelegateSessionsSummary from "@/components/sections/DelegateSessionsSummary";

const tools: { to: string; label: string; hint: string; icon: LucideIcon }[] = [
  {
    to: "/portal/courses",
    label: "Courses",
    hint: "Materials & submissions",
    icon: BookOpen,
  },
  {
    to: "/portal/transfer",
    label: "Transfer Hub",
    hint: "Documents & eligibility",
    icon: Plane,
  },
  {
    to: "/portal/study-centre",
    label: "Study Centre",
    hint: "Syllabus & notes",
    icon: NotebookPen,
  },
  {
    to: "/portal/planner",
    label: "Academic Planner",
    hint: "GPA & course plan",
    icon: CalendarRange,
  },
  {
    to: "/portal/buddies",
    label: "Buddy System",
    hint: "Mentors & peers",
    icon: Users,
  },
  {
    to: "/portal/research-hub",
    label: "Research Hub",
    hint: "Projects & teams",
    icon: FlaskConical,
  },
];

const statusStyle: Record<string, string> = {
  open: "border-blue-600/30 bg-blue-500/10 text-blue-800 dark:text-blue-300",
  submitted:
    "border-emerald-600/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
  late: "border-destructive/30 bg-destructive/10 text-destructive",
};

const dueFormat = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

export default function Portal() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "";

  return (
    <main>
      <SEO
        title="Student Portal — ICAS"
        description="Assignments, grades, announcements and resources."
      />
      <section className="container py-10">
        <PageHeader
          eyebrow="Student Portal"
          title={`Welcome back${firstName ? `, ${firstName}` : ""}`}
          description="Your deadlines, courses and transfer tools in one place."
          actions={
            <Button variant="outline" asChild>
              <a
                href="https://meet.google.com/"
                target="_blank"
                rel="noreferrer"
              >
                <Video aria-hidden="true" />
                Meet link
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </Button>
          }
        />

        <nav aria-label="Portal tools" className="mt-8">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {tools.map((t) => (
              <li key={t.to}>
                <Link
                  to={t.to}
                  className="group flex h-full flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <t.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold group-hover:text-primary">
                      {t.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {t.hint}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="grid min-w-0 grid-cols-1 gap-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {portalAssignments.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-start justify-between gap-4 rounded-md border p-4"
                  >
                    <div>
                      <div className="text-sm font-medium">{a.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {a.course} · Due {dueFormat.format(new Date(a.due))}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`shrink-0 capitalize ${statusStyle[a.status] ?? ""}`}
                    >
                      {a.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">My Courses</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {portalCourses.map((c) => (
                  <div key={c.code} className="rounded-md border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-sm font-medium">{c.title}</div>
                      <Badge
                        variant="outline"
                        className="shrink-0 whitespace-nowrap"
                      >
                        {c.code}
                      </Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {c.instructor}
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <Progress
                        value={c.progress}
                        className="h-2"
                        aria-label={`${c.title} progress`}
                      />
                      <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
                        {c.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <DelegateSessionsSummary />
          </div>

          <div className="grid content-start gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar mode="single" className="mx-auto rounded-md border" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Announcements</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {portalAnnouncements.map((n) => (
                  <div key={n.id} className="rounded-md border p-3 text-sm">
                    <div className="font-medium">{n.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(n.date).toDateString()} · {n.course}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Grades Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>GPA</span>
                  <span className="font-semibold">
                    {portalGrades.gpa.toFixed(2)}
                  </span>
                </div>
                <div className="grid gap-2">
                  {portalGrades.courses.map((g) => (
                    <div
                      key={g.code}
                      className="flex items-center justify-between rounded-md border p-2"
                    >
                      <span>{g.code}</span>
                      <span className="font-medium">{g.grade}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
