import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { subscribeCourses, ensureInit, userIdFromEmail, Course, updateCourseMeta, saveSyllabus, uploadNote, subscribeUploads, Upload, saveNotes } from "@/lib/study-centre";

function useStudyCourses(userEmail: string | undefined) {
  const [courses, setCourses] = useState<Course[]>([]);
  useEffect(() => {
    if (!userEmail) return;
    const userId = userIdFromEmail(userEmail);
    ensureInit(userId).then(() => {
      const unsubList = subscribeCourses(userId, setCourses);
      return () => unsubList();
    });
  }, [userEmail]);
  return courses;
}

function FilePreview({ item }: { item: Upload }) {
  const t = (item.type || "").toLowerCase();
  if (t.startsWith("image/")) {
    return <img src={item.url} alt={item.name} className="h-40 w-full rounded-md object-cover" />;
  }
  if (t.includes("pdf")) {
    return (
      <object data={item.url} type="application/pdf" className="h-40 w-full rounded-md">
        <a href={item.url} className="text-sm text-primary underline" target="_blank" rel="noreferrer">Open PDF</a>
      </object>
    );
  }
  if (item.name.toLowerCase().endsWith(".ppt") || item.name.toLowerCase().endsWith(".pptx")) {
    const src = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(item.url)}`;
    return <iframe src={src} className="h-40 w-full rounded-md" />;
  }
  return (
    <div className="flex h-40 w-full items-center justify-center rounded-md border text-sm">
      <a href={item.url} className="text-primary underline" target="_blank" rel="noreferrer">Open {item.name}</a>
    </div>
  );
}

function NotesEditor({ initial, onSave }: { initial: string; onSave: (html: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = initial || "";
  }, [initial]);
  function applyHighlight() {
    document.execCommand("backColor", false, "#fff59d");
  }
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button type="button" size="sm" onClick={applyHighlight}>Highlight</Button>
        <Button type="button" size="sm" variant="secondary" onClick={() => onSave(ref.current?.innerHTML || "")}>Save Notes</Button>
      </div>
      <div
        ref={ref}
        contentEditable
        className="min-h-32 w-full rounded-md border bg-background p-3 text-sm focus:outline-none"
        style={{ outline: "none" }}
      />
    </div>
  );
}

function CourseCard({ course, userId }: { course: Course; userId: string }) {
  const [openEdit, setOpenEdit] = useState(false);
  const [name, setName] = useState(course.name);
  const [code, setCode] = useState(course.code);

  const [openSyllabus, setOpenSyllabus] = useState<"view" | "add" | null>(null);
  const [s1, setS1] = useState(course.syllabus?.s1 || "");
  const [s2, setS2] = useState(course.syllabus?.s2 || "");
  const [s3, setS3] = useState(course.syllabus?.s3 || "");

  const [uploads, setUploads] = useState<Upload[]>([]);
  useEffect(() => {
    const unsub = subscribeUploads(userId, course.id, setUploads);
    return () => unsub();
  }, [userId, course.id]);

  useEffect(() => {
    setName(course.name);
    setCode(course.code);
    setS1(course.syllabus?.s1 || "");
    setS2(course.syllabus?.s2 || "");
    setS3(course.syllabus?.s3 || "");
  }, [course]);

  async function saveMeta() {
    await updateCourseMeta(userId, course.id, { name, code });
    setOpenEdit(false);
  }

  async function saveSyl() {
    await saveSyllabus(userId, course.id, { s1, s2, s3 });
    setOpenSyllabus(null);
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadNote(userId, course.id, file);
    e.currentTarget.value = "";
  }

  const [notesOpen, setNotesOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">{course.name}</CardTitle>
        <div className="text-xs text-muted-foreground">{course.code}</div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => setOpenSyllabus("view")}>View Syllabus</Button>
          <Button size="sm" variant="secondary" onClick={() => setOpenSyllabus("add")}>Add Syllabus</Button>
          <Button size="sm" variant="outline" onClick={() => setOpenEdit(true)}>Edit</Button>
          <Button size="sm" variant="outline" onClick={() => setNotesOpen(true)}>Notes</Button>
        </div>
        <div className="rounded-md border p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-medium">Uploads</div>
            <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-primary">
              <input type="file" className="hidden" onChange={onUpload} />
              <span className="rounded-md border px-2 py-1">Add File</span>
            </label>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {uploads.length === 0 && <div className="text-sm text-muted-foreground">No files yet.</div>}
            {uploads.map((u) => (
              <div key={u.id} className="overflow-hidden rounded-md border">
                <FilePreview item={u} />
                <div className="p-2 text-xs">{u.name}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
      </CardFooter>

      {/* Edit meta */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1">
              <Label htmlFor={`name-${course.id}`}>Name</Label>
              <Input id={`name-${course.id}`} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-1">
              <Label htmlFor={`code-${course.id}`}>Code</Label>
              <Input id={`code-${course.id}`} value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveMeta}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Syllabus dialogs */}
      <Dialog open={openSyllabus === "view"} onOpenChange={(o) => setOpenSyllabus(o ? "view" : null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Syllabus — {course.name}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="s1">
            <TabsList>
              <TabsTrigger value="s1">Sessional 1</TabsTrigger>
              <TabsTrigger value="s2">Sessional 2</TabsTrigger>
              <TabsTrigger value="s3">Sessional 3</TabsTrigger>
            </TabsList>
            <TabsContent value="s1"><div className="whitespace-pre-wrap text-sm">{course.syllabus?.s1 || "Not added."}</div></TabsContent>
            <TabsContent value="s2"><div className="whitespace-pre-wrap text-sm">{course.syllabus?.s2 || "Not added."}</div></TabsContent>
            <TabsContent value="s3"><div className="whitespace-pre-wrap text-sm">{course.syllabus?.s3 || "Not added."}</div></TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={openSyllabus === "add"} onOpenChange={(o) => setOpenSyllabus(o ? "add" : null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Syllabus — {course.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1">
              <Label>Sessional 1</Label>
              <Textarea value={s1} onChange={(e) => setS1(e.target.value)} rows={5} />
            </div>
            <div className="grid gap-1">
              <Label>Sessional 2</Label>
              <Textarea value={s2} onChange={(e) => setS2(e.target.value)} rows={5} />
            </div>
            <div className="grid gap-1">
              <Label>Sessional 3</Label>
              <Textarea value={s3} onChange={(e) => setS3(e.target.value)} rows={5} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveSyl}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notes dialog */}
      <Dialog open={notesOpen} onOpenChange={setNotesOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>My Notes — {course.name}</DialogTitle>
          </DialogHeader>
          <NotesEditor initial={course.notesHtml || ""} onSave={(html) => saveNotes(userId, course.id, html)} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default function StudyCentre() {
  const { user } = useAuth();
  const email = user?.email;
  const userId = useMemo(() => (email ? userIdFromEmail(email) : undefined), [email]);
  const courses = useStudyCourses(email);

  return (
    <main>
      <SEO title="Study Centre — Portal" description="Upload notes, manage syllabus and study smarter." />
      <section className="container py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Study Centre</h1>
            <p className="text-sm text-muted-foreground">Keep notes, syllabus and resources organized per course.</p>
          </div>
          <Button asChild variant="outline"><Link to="/portal">Back to Dashboard</Link></Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userId && courses.map((c) => (
            <CourseCard key={c.id} course={c} userId={userId} />
          ))}
        </div>
      </section>
    </main>
  );
}
