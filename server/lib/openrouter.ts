import { HttpError } from "./errors";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  model: string;
  messages: ChatMessage[];
  maxTokens: number;
  temperature?: number;
  title: string;
  fetchImpl?: typeof fetch;
}

export function getOpenRouterKey(): string {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    throw new HttpError(503, "AI assistant is not configured on this server");
  }
  return key;
}

/** Calls OpenRouter's chat completion API and returns the first message's text. */
export async function chatCompletion(opts: ChatOptions): Promise<string> {
  const key = getOpenRouterKey();
  const fetchImpl = opts.fetchImpl ?? fetch;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${key}`,
    "X-Title": opts.title,
  };
  if (process.env.APP_URL) headers["HTTP-Referer"] = process.env.APP_URL;

  const resp = await fetchImpl(OPENROUTER_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: opts.model,
      messages: opts.messages,
      max_tokens: opts.maxTokens,
      temperature: opts.temperature ?? 0.2,
    }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!resp.ok) {
    const detail = await resp.text().catch(() => "");
    throw new Error(
      `OpenRouter ${opts.model} failed: HTTP ${resp.status} ${detail.slice(0, 500)}`,
    );
  }

  const data = (await resp.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data?.choices?.[0]?.message?.content ?? "";
  if (!content.trim())
    throw new Error(`OpenRouter ${opts.model}: empty response`);
  return content;
}

/**
 * Parses JSON returned by an LLM, tolerating surrounding markdown code fences.
 * Returns null when the content is not a JSON object.
 */
export function parseModelJson<T = unknown>(content: string): T | null {
  const text = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as T)
      : null;
  } catch {
    return null;
  }
}
