import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { portalCourses, portalCourseDetails } from "@/data/sample";
import { saveSubmission, getSubmission } from "@/lib/localdb";
import { toast } from "sonner";

function useCourse(): { code: string; title: string } {
  const code = decodeURIComponent(location.pathname.split("/").pop() || "");
  const course = portalCourses.find((c) => c.code === code);
  return { code, title: course?.title ?? code };
}

export default function PortalCourse() {
  const { code, title } = useCourse();
  const details = portalCourseDetails[code] ?? { syllabus: "", assignments: [] };

  return (
    <main>
      <SEO title={`${code} — Portal`} description={title} />
      <section className="container py-10">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <div className="text-sm text-muted-foreground">{code}</div>
          </div>
          <Button asChild variant="outline"><a href="/portal/courses">All courses</a></Button>
        </div>

        <Tabs defaultValue="assignments" className="mt-6">
          <TabsList>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          </TabsList>

          <TabsContent value="assignments" className="mt-4 grid gap-4">
            {details.assignments.map((a) => {
              const s = getSubmission(a.id);
              return (
                <Card key={a.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{a.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3 pt-0">
                    <div className="text-xs text-muted-foreground">Due {new Date(a.due).toLocaleString()} · Max {a.maxMarks} marks</div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget as HTMLFormElement);
                        const url = String(fd.get("url") || "");
                        const notes = String(fd.get("notes") || "");
                        saveSubmission({ assignmentId: a.id, url, notes, submittedAt: new Date().toISOString() });
                        toast.success("Submitted");
                        (e.currentTarget as HTMLFormElement).reset();
                      }}
                      className="grid gap-2"
                    >
                      <Input name="url" placeholder="Submission URL (GitHub/Drive/etc.)" required />
                      <Textarea name="notes" placeholder="Notes (optional)" />
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          {s ? `Last submitted ${new Date(s.submittedAt).toLocaleString()}` : "Not submitted"}
                        </div>
                        <Button type="submit" size="sm">Submit</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="syllabus" className="mt-4">
            <Card>
              <CardContent className="prose dark:prose-invert max-w-none p-4 text-sm">
                {details.syllabus || "Syllabus will be available soon."}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
