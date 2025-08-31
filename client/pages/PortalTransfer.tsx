import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  loadTransferProfile,
  saveTransferProfile,
  computeProgress,
  UNIVERSITIES,
  checkEligibility,
  updateDocument,
  nextStep,
  validateFileNaming,
  addTimeline,
  type DocumentItem,
} from "@/lib/transfer";
import { useEffect, useMemo, useState } from "react";

function formatDaysLeft(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  const days = Math.ceil(diff / 86400000);
  return days <= 0 ? "due today" : `${days} days left`;
}

export default function PortalTransfer() {
  const { toast } = useToast();
  const [profile, setProfile] = useState(loadTransferProfile());
  const progress = computeProgress(profile);

  useEffect(() => {
    saveTransferProfile(profile);
  }, [profile]);

  useEffect(() => {
    const urgent = profile.deadlines.find(
      (d) => new Date(d.due).getTime() - Date.now() < 3 * 86400000,
    );
    if (urgent) {
      toast({
        title: "Upcoming deadline",
        description: `${urgent.label} is ${formatDaysLeft(urgent.due)}.`,
      });
    }
  }, []);

  const target = useMemo(
    () =>
      UNIVERSITIES.find((u) => u.id === profile.targetUniversityId) ||
      UNIVERSITIES[0],
    [profile.targetUniversityId],
  );

  return (
    <main>
      <SEO
        title="Smart Transfer Portal — ICAS"
        description="Manage your 2+2 transfer journey end-to-end."
      />
      <section className="container py-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Smart Transfer Portal
            </h1>
            <p className="text-sm text-muted-foreground">
              ICAS 2+2 Program Hub
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => window.print()} variant="outline">
              Download Certificate (PDF)
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Overall completion
                  </div>
                  <div className="text-sm font-medium">{progress}%</div>
                </div>
                <div className="mt-3">
                  <Progress value={progress} className="h-2" />
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  Stage: {profile.stage.replaceAll("_", " ")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Status</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-3">
                <div className="rounded-md border p-3 text-sm">
                  <div className="text-muted-foreground">Target University</div>
                  <div className="mt-1 font-medium">{target.name}</div>
                </div>
                <div className="rounded-md border p-3 text-sm">
                  <div className="text-muted-foreground">
                    Application Status
                  </div>
                  <div className="mt-1 font-medium">
                    {profile.stage.replaceAll("_", " ")}
                  </div>
                </div>
                <div className="rounded-md border p-3 text-sm">
                  <div className="text-muted-foreground">Next Step</div>
                  <div className="mt-1 font-medium">{nextStep(profile)}</div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="docs">
              <TabsList>
                <TabsTrigger value="docs">Documents</TabsTrigger>
                <TabsTrigger value="universities">Universities</TabsTrigger>
                <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="assistant">Assistant</TabsTrigger>
              </TabsList>

              <TabsContent value="docs">
                <DocumentsTab profileKey={profile} onChange={setProfile} />
              </TabsContent>
              <TabsContent value="universities">
                <UniversitiesTab profileKey={profile} onChange={setProfile} />
              </TabsContent>
              <TabsContent value="deadlines">
                <DeadlinesTab profileKey={profile} onChange={setProfile} />
              </TabsContent>
              <TabsContent value="timeline">
                <TimelineTab profileKey={profile} />
              </TabsContent>
              <TabsContent value="assistant">
                <AssistantTab profileKey={profile} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {profile.deadlines.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between rounded-md border p-3 text-sm"
                  >
                    <div>
                      <div className="font-medium">{d.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(d.due).toLocaleDateString()} ·{" "}
                        {formatDaysLeft(d.due)}
                      </div>
                    </div>
                    <Badge variant="outline">{d.type}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar mode="single" className="rounded-md border" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Printable certificate area */}
        {progress === 100 && (
          <div className="mt-10 rounded-xl border p-6 print:block">
            <h2 className="text-2xl font-bold text-center">
              Transfer Readiness Certificate
            </h2>
            <p className="mt-4 text-center">
              This certifies that you have completed ICAS transfer requirements
              and are approved for transfer to {target.name}.
            </p>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Generated on {new Date().toLocaleString()}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function DocumentsTab({
  profileKey,
  onChange,
}: {
  profileKey: ReturnType<typeof loadTransferProfile>;
  onChange: (p: ReturnType<typeof loadTransferProfile>) => void;
}) {
  const [profile, setProfile] = useState(profileKey);
  useEffect(() => setProfile(profileKey), [profileKey]);

  const groups = useMemo(() => {
    return {
      academic: profile.documents.filter((d) => d.category === "academic"),
      personal: profile.documents.filter((d) => d.category === "personal"),
      financial: profile.documents.filter((d) => d.category === "financial"),
    };
  }, [profile.documents]);

  const handleUpload = (item: DocumentItem, file: File) => {
    const error = validateFileNaming(file.name, item);
    if (error) {
      alert(error);
      return;
    }
    const patch: Partial<DocumentItem> = {
      status: "uploaded",
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
    };
    const next = updateDocument(profile, item.id, patch);
    const verified = item.required
      ? patch.fileName?.toLowerCase().endsWith(".pdf")
      : true;
    const withVerify = updateDocument(next, item.id, {
      status: verified ? "verified" : "uploaded",
    });
    const withEvent = addTimeline(withVerify, `${item.label} uploaded`);
    onChange(withEvent);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {(["academic", "personal", "financial"] as const).map((cat) => (
        <Card key={cat}>
          <CardHeader>
            <CardTitle className="text-lg capitalize">{cat}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {groups[cat].map((item) => (
              <div key={item.id} className="rounded-md border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{item.label}</div>
                  <Badge
                    variant={
                      item.status === "verified"
                        ? "secondary"
                        : item.status === "uploaded"
                          ? "outline"
                          : "destructive"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {item.required ? "Required" : "Optional"}
                  {item.fileName ? ` · ${item.fileName}` : ""}
                </div>
                <div className="mt-3">
                  <input
                    aria-label={`Upload ${item.label}`}
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleUpload(item, f);
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function UniversitiesTab({
  profileKey,
  onChange,
}: {
  profileKey: ReturnType<typeof loadTransferProfile>;
  onChange: (p: ReturnType<typeof loadTransferProfile>) => void;
}) {
  const [profile, setProfile] = useState(profileKey);
  useEffect(() => setProfile(profileKey), [profileKey]);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <div className="rounded-md border px-3 py-2">
          Your GPA:{" "}
          <span className="font-semibold">{profile.gpa.toFixed(2)}</span>
        </div>
        <div className="rounded-md border px-3 py-2">
          Credits:{" "}
          <span className="font-semibold">{profile.creditsEarned}</span>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {UNIVERSITIES.map((u) => {
          const res = checkEligibility(profile.gpa, profile.creditsEarned, u);
          return (
            <div key={u.id} className="rounded-md border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {u.country} · Language: {u.language}
                  </div>
                </div>
                <Badge variant={res.eligible ? "secondary" : "outline"}>
                  {res.eligible ? "Eligible" : "Review"}
                </Badge>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Tuition ~ ${u.tuitionUSD.toLocaleString()} /year · GPA cutoff{" "}
                {u.gpaCutoff.toFixed(1)}
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant={
                    profile.targetUniversityId === u.id
                      ? "secondary"
                      : "outline"
                  }
                  onClick={() => {
                    const next = addTimeline(
                      { ...profile, targetUniversityId: u.id },
                      `Target university set to ${u.name}`,
                    );
                    onChange(next);
                  }}
                >
                  {profile.targetUniversityId === u.id ? "Selected" : "Select"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    alert(
                      res.eligible
                        ? `Strong fit for ${u.name}.`
                        : `You may need to improve GPA or credits.`,
                    )
                  }
                >
                  Check Eligibility
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DeadlinesTab({
  profileKey,
  onChange,
}: {
  profileKey: ReturnType<typeof loadTransferProfile>;
  onChange: (p: ReturnType<typeof loadTransferProfile>) => void;
}) {
  const [profile, setProfile] = useState(profileKey);
  useEffect(() => setProfile(profileKey), [profileKey]);

  return (
    <div className="grid gap-3">
      {profile.deadlines.map((d) => (
        <div
          key={d.id}
          className="flex items-center justify-between rounded-md border p-3 text-sm"
        >
          <div>
            <div className="font-medium">{d.label}</div>
            <div className="text-xs text-muted-foreground">
              {new Date(d.due).toLocaleString()} · {formatDaysLeft(d.due)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{d.type}</Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => alert(`Reminder set for ${d.label}.`)}
            >
              Remind me
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function TimelineTab({
  profileKey,
}: {
  profileKey: ReturnType<typeof loadTransferProfile>;
}) {
  const items = [...profileKey.timeline].sort((a, b) =>
    a.when.localeCompare(b.when),
  );
  return (
    <div className="grid gap-3">
      {items.map((e) => (
        <div key={e.id} className="rounded-md border p-3 text-sm">
          <div className="font-medium">{e.description}</div>
          <div className="text-xs text-muted-foreground">
            {new Date(e.when).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

function AssistantTab({
  profileKey,
}: {
  profileKey: ReturnType<typeof loadTransferProfile>;
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content:
        "Hi! Ask anything about your transfer — missing docs, deadlines, or eligibility.",
    },
  ]);

  async function ask() {
    const q = input.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    try {
      const res = await fetch("/api/transfer/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, context: { profile: profileKey } }),
      });
      const data = await res.json();
      const text = data.answer || "I couldn't generate a response.";
      setMessages((m) => [...m, { role: "assistant", content: text }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Error contacting assistant." },
      ]);
    }
  }

  return (
    <div className="grid gap-3">
      <div className="max-h-64 overflow-auto rounded-md border p-3">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "assistant" ? "" : "text-right"}>
            <div
              className={`mb-2 inline-block rounded-lg px-3 py-2 text-sm ${m.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground"}`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Ask the assistant…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={ask}>Ask</Button>
      </div>
    </div>
  );
}
