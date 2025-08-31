import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { alumni, alumniOpportunities, alumniStories, programs, contacts } from "@/data/sample";

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function programNameById(id: string) {
  const p = programs.find((x) => x.id === id);
  return p ? p.name : id;
}

export default function AlumniPortal() {
  return (
    <section className="container py-12">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Alumni Portal</h2>
          <p className="text-sm text-muted-foreground">Directory, stories, and opportunities for our alumni community.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <a href={`mailto:${contacts.email}?subject=Alumni%20Mentorship`}>Become a mentor</a>
          </Button>
          <Button asChild>
            <a href="/Contact">Share your story</a>
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {alumni.map((a) => (
          <Card key={`${a.name}-${a.gradYear}`}>
            <CardHeader className="flex-row items-center gap-4">
              <Avatar>
                <AvatarFallback>{initials(a.name)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{a.name}</CardTitle>
                <div className="mt-1 text-xs text-muted-foreground">
                  {a.role} · {a.company}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {programNameById(a.programId)} · Class of {a.gradYear}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between pt-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className={cn(a.programId === "cse" && "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100", a.programId === "aero" && "bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-100", a.programId === "mechatronics" && "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-100")}>{a.programId.toUpperCase()}</Badge>
                {a.location && <Badge variant="outline">{a.location}</Badge>}
              </div>
              {a.linkedin && (
                <Button asChild size="sm" variant="ghost">
                  <a href={a.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alumni Stories</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {alumniStories.map((s, idx) => (
              <figure key={idx} className="rounded-md border p-4">
                <blockquote className="text-sm leading-relaxed">“{s.quote}”</blockquote>
                <figcaption className="mt-2 text-xs text-muted-foreground">— {s.name}, {s.role} at {s.company}</figcaption>
              </figure>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Opportunities</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {alumniOpportunities.map((o, idx) => (
              <div key={idx} className="flex items-start justify-between gap-4 rounded-md border p-4">
                <div>
                  <div className="text-sm font-medium">{o.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{o.org} · {o.location}</div>
                </div>
                {o.link && (
                  <Button asChild size="sm" variant="outline">
                    <a href={o.link} target="_blank" rel="noreferrer">View</a>
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
