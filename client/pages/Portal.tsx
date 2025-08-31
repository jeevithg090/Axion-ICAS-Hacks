import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { portalCourses, portalAssignments, portalAnnouncements, portalGrades, portalQuickLinks } from "@/data/sample";
import { Link } from "react-router-dom";

export default function Portal() {
  return (
    <main>
      <SEO title="Student Portal — ICAS" description="Assignments, grades, announcements and resources." />
      <section className="container py-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Portal</h1>
            <p className="text-sm text-muted-foreground">Dashboard overview for your courses.</p>
          </div>
          <div className="flex gap-2">
            {portalQuickLinks.map((l) => (
              <Button key={l.label} asChild variant={l.variant as any}>
                <a href={l.href} target={l.external ? "_blank" : undefined} rel={l.external ? "noreferrer" : undefined}>{l.label}</a>
              </Button>
            ))}
            <Button asChild>
              <Link to="/portal/study-centre">Study Centre</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/portal/transfer">Transfer Hub</Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {portalAssignments.map((a) => (
                  <div key={a.id} className="flex items-start justify-between gap-4 rounded-md border p-4">
                    <div>
                      <div className="text-sm font-medium">{a.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{a.course} · Due {new Date(a.due).toLocaleString()}</div>
                    </div>
                    <Badge variant={a.status === "open" ? "secondary" : a.status === "submitted" ? "outline" : "destructive"}>{a.status.toUpperCase()}</Badge>
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
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{c.title}</div>
                      <Badge variant="outline">{c.code}</Badge>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">{c.instructor}</div>
                    <div className="mt-3">
                      <Progress value={c.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar mode="single" className="rounded-md border" />
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
                    <div className="text-xs text-muted-foreground">{new Date(n.date).toDateString()} · {n.course}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Grades Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                <div className="flex items-center justify-between"><span>GPA</span><span className="font-semibold">{portalGrades.gpa.toFixed(2)}</span></div>
                <div className="grid gap-2">
                  {portalGrades.courses.map((g) => (
                    <div key={g.code} className="flex items-center justify-between rounded-md border p-2">
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
