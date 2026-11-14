import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, FileQuestion } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import FieldError from "@/components/FieldError";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { portalCourses, portalCourseDetails } from "@/data/sample";
import { saveSubmission, getSubmission, type Submission } from "@/lib/localdb";

const dateFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

function isHttpUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

type Assignment = {
  id: string;
  title: string;
  due: number;
  maxMarks: number;
};

function AssignmentCard({ a }: { a: Assignment }) {
  const [last, setLast] = useState<Submission | undefined>(() =>
    getSubmission(a.id),
  );
  const [error, setError] = useState<string>();
  const urlId = `url-${a.id}`;
  const notesId = `notes-${a.id}`;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-base">{a.title}</CardTitle>
          {last && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-600/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Submitted
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Due {dateFormat.format(new Date(a.due))} · Max {a.maxMarks} marks
        </p>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const fd = new FormData(form);
            const url = String(fd.get("url") || "").trim();
            const notes = String(fd.get("notes") || "");
            if (!url) {
              setError("Add a link to your work.");
              form.querySelector<HTMLInputElement>("input")?.focus();
              return;
            }
            if (!isHttpUrl(url)) {
              setError(
                "Use a full link starting with https://, e.g. a GitHub or Drive URL.",
              );
              form.querySelector<HTMLInputElement>("input")?.focus();
              return;
            }
            setError(undefined);
            const submission = {
              assignmentId: a.id,
              url,
              notes,
              submittedAt: new Date().toISOString(),
            };
            saveSubmission(submission);
            setLast(submission);
            toast.success(`Submitted “${a.title}”`);
            form.reset();
          }}
          className="grid gap-3"
        >
          <div>
            <Label htmlFor={urlId}>Link to your work</Label>
            <Input
              id={urlId}
              name="url"
              type="url"
              inputMode="url"
              placeholder="https://github.com/you/project"
              className="mt-1.5"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${urlId}-error` : undefined}
              onChange={() => error && setError(undefined)}
            />
            <FieldError id={`${urlId}-error`} message={error} />
          </div>
          <div>
            <Label htmlFor={notesId}>
              Notes <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea id={notesId} name="notes" className="mt-1.5" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground" aria-live="polite">
              {last
                ? `Last submitted ${dateFormat.format(new Date(last.submittedAt))}`
                : "Not submitted yet"}
            </p>
            <Button type="submit">{last ? "Resubmit" : "Submit"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function PortalCourse() {
  const { code: rawCode = "" } = useParams();
  const code = decodeURIComponent(rawCode);
  const course = portalCourses.find((c) => c.code === code);
  const details = portalCourseDetails[code];
  const title = course?.title ?? code;

  const back = (
    <Button asChild variant="outline">
      <Link to="/portal/courses">
        <ArrowLeft aria-hidden="true" />
        All courses
      </Link>
    </Button>
  );

  if (!course && !details) {
    return (
      <main className="container py-10">
        <SEO title="Course not found — Portal" description="Unknown course." />
        <EmptyState
          icon={FileQuestion}
          title="We couldn’t find that course"
          description={`There is no course with the code “${code}”.`}
          action={back}
          className="mx-auto mt-6 max-w-lg"
        />
      </main>
    );
  }

  const assignments = details?.assignments ?? [];

  return (
    <main>
      <SEO title={`${code} — Portal`} description={title} />
      <section className="container py-10">
        <PageHeader
          eyebrow={code}
          title={title}
          description={course?.instructor}
          actions={back}
        />

        <Tabs defaultValue="assignments" className="mt-8">
          <TabsList>
            <TabsTrigger value="assignments">
              Assignments ({assignments.length})
            </TabsTrigger>
            <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          </TabsList>

          <TabsContent value="assignments" className="mt-4">
            {assignments.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="No assignments yet"
                description="New assignments for this course will show up here."
              />
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {assignments.map((a) => (
                  <AssignmentCard key={a.id} a={a} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="syllabus" className="mt-4">
            <Card>
              <CardContent className="prose max-w-none p-6 text-sm dark:prose-invert">
                {details?.syllabus || "Syllabus will be available soon."}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
