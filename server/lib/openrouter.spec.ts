import { afterEach, describe, expect, it, vi } from "vitest";
import { HttpError } from "./errors";
import { chatCompletion, parseModelJson } from "./openrouter";

describe("parseModelJson", () => {
  it("parses plain JSON objects", () => {
    expect(parseModelJson('{"summary":"ok"}')).toEqual({ summary: "ok" });
  });

  it("strips markdown code fences", () => {
    expect(parseModelJson('```json\n{"summary":"ok"}\n```')).toEqual({
      summary: "ok",
    });
    expect(parseModelJson('  ```\n{"a":1}\n```  ')).toEqual({ a: 1 });
  });

  it("returns null for non-objects and invalid JSON", () => {
    expect(parseModelJson("not json")).toBeNull();
    expect(parseModelJson("[1,2]")).toBeNull();
    expect(parseModelJson("42")).toBeNull();
  });
});

describe("chatCompletion", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("requires OPENROUTER_API_KEY", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "");
    await expect(
      chatCompletion({ model: "m", messages: [], maxTokens: 10, title: "t" }),
    ).rejects.toMatchObject({ status: 503 });
  });

  it("sends the request and returns the first message", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "test-key");
    vi.stubEnv("APP_URL", "https://app.example");
    const fetchImpl = vi.fn(async () =>
      Response.json({ choices: [{ message: { content: "hello" } }] }),
    );

    const out = await chatCompletion({
      model: "test/model",
      messages: [{ role: "user", content: "hi" }],
      maxTokens: 50,
      title: "Test",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    expect(out).toBe("hello");
    const [, init] = fetchImpl.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer test-key");
    expect(headers["HTTP-Referer"]).toBe("https://app.example");
    expect(JSON.parse(init.body as string)).toMatchObject({
      model: "test/model",
      max_tokens: 50,
    });
  });

  it("throws a non-public error on upstream failure", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "test-key");
    const fetchImpl = vi.fn(async () => new Response("boom", { status: 502 }));
    const err = await chatCompletion({
      model: "m",
      messages: [],
      maxTokens: 10,
      title: "t",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    }).catch((e) => e);
    expect(err).toBeInstanceOf(Error);
    expect(err).not.toBeInstanceOf(HttpError);
    expect(err.message).toMatch(/HTTP 502/);
  });
});
