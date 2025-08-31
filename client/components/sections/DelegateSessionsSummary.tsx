import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      <Section title="Overview">
        {s.summary}
      </Section>
      {s.attendees && s.attendees.length > 0 && (
        <Section title="Attendees">
          <div className="flex flex-wrap gap-2">
            {s.attendees.map((a, i) => (
              <Badge key={i} variant="outline">{a}</Badge>
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
                ) : null} {x.note}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
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
        } as any,
        body: buf,
      });
      if (!resp.ok) {
        const t = await resp.text();
        throw new Error(t || `Request failed: ${resp.status}`);
      }
      const data = (await resp.json()) as DelegateSummaryResponse;
      setResult(data);
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
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <div className="text-xs text-muted-foreground">
            Upload a meeting recording (mp3, wav, m4a...). We'll transcribe and summarize it for you.
          </div>
          <div className="flex gap-2">
            <Button onClick={onSubmit} disabled={!file || loading}>
              {loading ? "Processing..." : "Generate Summary"}
            </Button>
            {result?.modelUsed && (
              <Badge variant="outline">Model: {result.modelUsed}</Badge>
            )}
          </div>
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
