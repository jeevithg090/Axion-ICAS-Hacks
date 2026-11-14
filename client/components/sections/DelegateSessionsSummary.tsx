import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileAudio, Loader2, Sparkles, UploadCloud } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { DelegateSummaryResponse, MeetingSummary } from "@shared/api";

function Section({ title, children }: { title: string; children: any }) {
  return (
    <div className="grid gap-2">
      <div className="text-sm font-medium">{title}</div>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

function SummaryView({ data }: { data: DelegateSummaryResponse }) {
  const s = data.summary as MeetingSummary | string;
  if (typeof s === "string") {
    return (
      <div className="rounded-md border p-3 text-sm whitespace-pre-wrap">
        {s}
      </div>
    );
  }
  return (
    <div className="grid gap-4">
      {s.title && (
        <div className="text-base font-semibold tracking-tight">{s.title}</div>
      )}
      <Section title="Overview">{s.summary}</Section>
      {s.attendees && s.attendees.length > 0 && (
        <Section title="Attendees">
          <div className="flex flex-wrap gap-2">
            {s.attendees.map((a, i) => (
              <Badge key={i} variant="outline">
                {a}
              </Badge>
            ))}
          </div>
        </Section>
      )}
      {s.agenda && s.agenda.length > 0 && (
        <Section title="Agenda">
          <ul className="list-disc pl-5">
            {s.agenda.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </Section>
      )}
      {s.decisions && s.decisions.length > 0 && (
        <Section title="Key Decisions">
          <ul className="list-disc pl-5">
            {s.decisions.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </Section>
      )}
      {s.action_items && s.action_items.length > 0 && (
        <Section title="Action Items">
          <ul className="list-disc pl-5">
            {s.action_items.map((x, i) => (
              <li key={i}>
                <span className="font-medium">{x.owner}:</span> {x.task}
                {x.due_date ? ` — Due ${x.due_date}` : ""}
              </li>
            ))}
          </ul>
        </Section>
      )}
      {s.risks && s.risks.length > 0 && (
        <Section title="Risks">
          <ul className="list-disc pl-5">
            {s.risks.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </Section>
      )}
      {s.next_steps && s.next_steps.length > 0 && (
        <Section title="Next Steps">
          <ul className="list-disc pl-5">
            {s.next_steps.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </Section>
      )}
      {s.timeline && s.timeline.length > 0 && (
        <Section title="Highlights Timeline">
          <ul className="list-disc pl-5">
            {s.timeline.map((x, i) => (
              <li key={i}>
                {x.timestamp ? (
                  <span className="font-medium">[{x.timestamp}]</span>
                ) : null}{" "}
                {x.note}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

function formatBytes(n: number) {
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DelegateSessionsSummary() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DelegateSummaryResponse | null>(null);

  async function onSubmit() {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      if (!file) {
        setError("Please select an audio file");
        setLoading(false);
        return;
      }
      const buf = await file.arrayBuffer();
      const resp = await fetch("/api/delegate/summary", {
        method: "POST",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
          "x-filename": file.name || "meeting.audio",
        },
        body: buf,
      });
      const raw = await resp.text();
      let parsed: any = null;
      try {
        parsed = raw ? JSON.parse(raw) : null;
      } catch {
        // Non-JSON error body; fall back to the raw text below.
      }
      if (!resp.ok) {
        const msg = parsed?.error || raw || `Request failed: ${resp.status}`;
        throw new Error(msg);
      }
      setResult(parsed as DelegateSummaryResponse);
    } catch (e: any) {
      setError(e?.message || "Failed to summarize session");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Delegate Sessions Summary</CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload a meeting recording to get a transcript plus decisions, action
          items and next steps.
        </p>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3">
          <label
            htmlFor="delegate-audio"
            className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center hover:border-primary/50 hover:bg-muted/40 has-[:focus-visible]:border-ring has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
          >
            {file ? (
              <FileAudio className="h-8 w-8 text-primary" aria-hidden="true" />
            ) : (
              <UploadCloud
                className="h-8 w-8 text-muted-foreground group-hover:text-primary"
                aria-hidden="true"
              />
            )}
            <span className="text-sm font-medium">
              {file ? file.name : "Choose an audio file"}
            </span>
            <span className="text-xs text-muted-foreground">
              {file
                ? `${formatBytes(file.size)} · click to choose a different file`
                : "MP3, WAV, M4A and other audio formats"}
            </span>
            <input
              id="delegate-audio"
              type="file"
              accept="audio/*"
              className="sr-only"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setError(null);
                setResult(null);
              }}
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={onSubmit} disabled={!file || loading}>
              {loading ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : (
                <Sparkles aria-hidden="true" />
              )}
              {loading ? "Transcribing and summarising…" : "Generate summary"}
            </Button>
            {result?.modelUsed && (
              <Badge variant="outline">Model: {result.modelUsed}</Badge>
            )}
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            {loading
              ? "Processing your recording. This can take a minute."
              : result
                ? "Summary ready."
                : ""}
          </p>
          {loading && (
            <p className="text-xs text-muted-foreground">
              Long recordings can take a minute or two.
            </p>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription className="break-words">{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="grid gap-4">
            <div className="rounded-md border p-3">
              <div className="text-sm font-medium">Transcript</div>
              <div className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap max-h-60 overflow-auto">
                {result.transcript}
              </div>
            </div>
            <div className="rounded-md border p-3">
              <div className="text-sm font-medium">Summary</div>
              <div className="mt-2">
                <SummaryView data={result} />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
