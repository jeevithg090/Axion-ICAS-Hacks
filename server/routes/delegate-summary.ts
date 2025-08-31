import type { RequestHandler } from "express";
import type { DelegateSummaryResponse, MeetingSummary } from "@shared/api";

function inferFilename(contentType?: string, fallback = "audio") {
  const ext = contentType?.includes("wav")
    ? "wav"
    : contentType?.includes("mp3")
      ? "mp3"
      : contentType?.includes("mpeg")
        ? "mp3"
        : contentType?.includes("m4a")
          ? "m4a"
          : contentType?.includes("ogg")
            ? "ogg"
            : contentType?.includes("webm")
              ? "webm"
              : "bin";
  return `${fallback}.${ext}`;
}

async function transcribeWithElevenLabs(
  audio: Buffer,
  contentType: string,
  filename: string,
): Promise<{ text: string } & Record<string, any>> {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error("ELEVENLABS_API_KEY is not set");

  const fd = new FormData();
  const blob = new Blob([audio], {
    type: contentType || "application/octet-stream",
  });
  fd.append("model_id", "scribe_v1");
  fd.append("language_code", "en");
  fd.append("tag_audio_events", "true");
  fd.append("diarize", "true");
  fd.append("file", blob, filename);

  const resp = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: { "xi-api-key": key },
    body: fd,
  });

  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`ElevenLabs STT failed: ${resp.status} ${t}`);
  }
  const data = await resp.json();
  const text: string = data?.text ?? "";
  return { text, ...data };
}

async function summarizeWithOpenRouter(transcript: string) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY is not set");

  const models = [
    "meta-llama/llama-3.1-70b-instruct:free",
    "meta-llama/llama-3.1-8b-instruct:free",
    "google/gemini-2.0-flash-001",
    "openai/gpt-4o-mini",
    "mistralai/mistral-small",
    "deepseek/deepseek-chat",
  ];

  const system =
    "You are a helpful meeting summarizer. Produce accurate, structured summaries with actionability for students and staff.";
  const user = `Generate a structured JSON summary of this meeting transcript.\n\nRequirements:\n- Output STRICT JSON only (no markdown, no code fences).\n- Use this schema with keys: {\n  title?: string,\n  summary: string,\n  attendees?: string[],\n  agenda?: string[],\n  decisions?: string[],\n  action_items?: { owner: string, task: string, due_date?: string }[],\n  risks?: string[],\n  next_steps?: string[],\n  timeline?: { timestamp?: string, note: string }[]\n}.\n- Be concise but cover: goals, key discussion points, decisions, action items (owners, deadlines), risks, and next steps.\n- Include a short timeline capturing notable moments if possible.\n\nTranscript:\n${transcript}`;

  let lastErr: any = null;
  for (const model of models) {
    try {
      const resp = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
            "HTTP-Referer": "https://builder.io",
            "X-Title": "ICAS Delegate Sessions Summary",
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: system },
              { role: "user", content: user },
            ],
            temperature: 0.2,
            max_tokens: 1200,
          }),
        },
      );
      if (!resp.ok) {
        lastErr = new Error(`OpenRouter ${model} HTTP ${resp.status}`);
        continue;
      }
      const data = await resp.json();
      const content: string = data?.choices?.[0]?.message?.content ?? "";
      if (!content) throw new Error("Empty LLM response");

      // Attempt to parse strict JSON; also strip accidental code fences
      const jsonText = content
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();
      let parsed: MeetingSummary | null = null;
      try {
        parsed = JSON.parse(jsonText);
      } catch {
        parsed = null;
      }
      return { model, content, parsed };
    } catch (e) {
      lastErr = e;
      continue;
    }
  }
  throw lastErr || new Error("All OpenRouter models failed");
}

export const handleDelegateSummary: RequestHandler = async (req, res) => {
  try {
    const contentType =
      (req.headers["content-type"] as string) || "application/octet-stream";
    const filename =
      (req.headers["x-filename"] as string) ||
      inferFilename(contentType, "meeting");

    if (!Buffer.isBuffer(req.body) || !req.body.length) {
      return res
        .status(400)
        .json({ error: "Audio file required (binary body)." });
    }

    const stt = await transcribeWithElevenLabs(
      req.body as Buffer,
      contentType,
      filename,
    );

    const { model, content, parsed } = await summarizeWithOpenRouter(
      stt.text || "",
    );

    const payload: DelegateSummaryResponse = {
      transcript: stt.text || "",
      summary: parsed ?? content,
      modelUsed: model,
    };

    res.json(payload);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "unknown" });
  }
};
