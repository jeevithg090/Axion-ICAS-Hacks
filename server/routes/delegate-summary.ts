import type { RequestHandler } from "express";
import type { DelegateSummaryResponse, MeetingSummary } from "@shared/api";
import { inferFilename, sanitizeFilename } from "../lib/audio";
import { HttpError, toErrorResponse } from "../lib/errors";
import {
  chatCompletion,
  getOpenRouterKey,
  parseModelJson,
} from "../lib/openrouter";

const ELEVENLABS_STT_URL = "https://api.elevenlabs.io/v1/speech-to-text";

/** Models tried in order until one succeeds. Override with OPENROUTER_SUMMARY_MODELS. */
const DEFAULT_SUMMARY_MODELS = [
  "meta-llama/llama-3.1-70b-instruct:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "google/gemini-2.0-flash-001",
  "openai/gpt-4o-mini",
  "mistralai/mistral-small",
  "deepseek/deepseek-chat",
];

function summaryModels(): string[] {
  const fromEnv = process.env.OPENROUTER_SUMMARY_MODELS?.split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  return fromEnv?.length ? fromEnv : DEFAULT_SUMMARY_MODELS;
}

const SYSTEM_PROMPT =
  "You are a helpful meeting summarizer. Produce accurate, structured summaries with actionability for students and staff.";

export function buildSummaryPrompt(transcript: string): string {
  return `Generate a structured JSON summary of this meeting transcript.

Requirements:
- Output STRICT JSON only (no markdown, no code fences).
- Use this schema with keys: {
  title?: string,
  summary: string,
  attendees?: string[],
  agenda?: string[],
  decisions?: string[],
  action_items?: { owner: string, task: string, due_date?: string }[],
  risks?: string[],
  next_steps?: string[],
  timeline?: { timestamp?: string, note: string }[]
}.
- Be concise but cover: goals, key discussion points, decisions, action items (owners, deadlines), risks, and next steps.
- Include a short timeline capturing notable moments if possible.

Transcript:
${transcript}`;
}

async function transcribe(
  audio: Buffer,
  contentType: string,
  filename: string,
) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key)
    throw new HttpError(503, "Transcription is not configured on this server");

  const form = new FormData();
  form.append("model_id", "scribe_v1");
  form.append("language_code", "en");
  form.append("tag_audio_events", "true");
  form.append("diarize", "true");
  form.append(
    "file",
    new Blob([new Uint8Array(audio)], { type: contentType }),
    filename,
  );

  const resp = await fetch(ELEVENLABS_STT_URL, {
    method: "POST",
    headers: { "xi-api-key": key },
    body: form,
    signal: AbortSignal.timeout(120_000),
  });
  if (!resp.ok) {
    const detail = await resp.text().catch(() => "");
    throw new Error(
      `ElevenLabs STT failed: HTTP ${resp.status} ${detail.slice(0, 500)}`,
    );
  }
  const data = (await resp.json()) as { text?: string };
  return data?.text ?? "";
}

async function summarize(transcript: string) {
  let lastErr: unknown = null;
  for (const model of summaryModels()) {
    try {
      const content = await chatCompletion({
        model,
        title: "ICAS Delegate Sessions Summary",
        maxTokens: 1200,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildSummaryPrompt(transcript) },
        ],
      });
      return {
        model,
        content,
        parsed: parseModelJson<MeetingSummary>(content),
      };
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr ?? new Error("All summary models failed");
}

export const handleDelegateSummary: RequestHandler = async (req, res) => {
  try {
    if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
      throw new HttpError(400, "Audio file required (binary request body).");
    }
    const contentType = req.get("content-type") || "application/octet-stream";
    if (!/^(audio|video)\/|^application\/octet-stream/i.test(contentType)) {
      throw new HttpError(415, "Unsupported media type; upload an audio file.");
    }
    // Fail fast before spending a transcription call.
    getOpenRouterKey();

    const filename =
      sanitizeFilename(req.get("x-filename")) ??
      inferFilename(contentType, "meeting");
    const transcript = await transcribe(req.body, contentType, filename);
    if (!transcript.trim()) {
      throw new HttpError(422, "No speech could be detected in the recording.");
    }

    const { model, content, parsed } = await summarize(transcript);
    const body: DelegateSummaryResponse = {
      transcript,
      summary: parsed ?? content,
      modelUsed: model,
    };
    res.json(body);
  } catch (err) {
    if (!(err instanceof HttpError)) console.error("[delegate-summary]", err);
    const { status, body } = toErrorResponse(err);
    res.status(status).json(body);
  }
};
