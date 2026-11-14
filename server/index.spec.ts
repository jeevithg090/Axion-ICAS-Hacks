import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createServer } from "./index";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("OPENROUTER_API_KEY", "");
  vi.stubEnv("ELEVENLABS_API_KEY", "");
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

function openRouterReply(content: string) {
  return Response.json({ choices: [{ message: { content } }] });
}

describe("GET /api/ping", () => {
  it("responds with the configured message", async () => {
    vi.stubEnv("PING_MESSAGE", "pong");
    const res = await request(createServer()).get("/api/ping");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "pong" });
    expect(res.headers["x-powered-by"]).toBeUndefined();
  });
});

describe("unknown API routes", () => {
  it("return a JSON 404", async () => {
    const res = await request(createServer()).get("/api/nope");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "API endpoint not found" });
  });
});

describe("POST /api/transfer/assistant", () => {
  it("validates the question", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "k");
    const res = await request(createServer())
      .post("/api/transfer/assistant")
      .send({ question: "   " });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/question/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON", async () => {
    const res = await request(createServer())
      .post("/api/transfer/assistant")
      .set("Content-Type", "application/json")
      .send("{oops");
    expect(res.status).toBe(400);
  });

  it("returns 503 when no API key is configured", async () => {
    const res = await request(createServer())
      .post("/api/transfer/assistant")
      .send({ question: "What documents am I missing?" });
    expect(res.status).toBe(503);
    expect(res.body.error).toMatch(/not configured/);
  });

  it("returns the model answer", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "k");
    fetchMock.mockResolvedValueOnce(openRouterReply("Upload your passport."));
    const res = await request(createServer())
      .post("/api/transfer/assistant")
      .send({ question: "What next?", context: { stage: "docs_uploaded" } });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ answer: "Upload your passport." });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.messages[1].content).toContain('"stage":"docs_uploaded"');
  });

  it("hides upstream error details from clients", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "k");
    fetchMock.mockResolvedValueOnce(
      new Response("secret upstream detail", { status: 500 }),
    );
    const res = await request(createServer())
      .post("/api/transfer/assistant")
      .send({ question: "Hi" });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
  });

  it("rate limits repeated calls", async () => {
    vi.stubEnv("AI_RATE_LIMIT_PER_MINUTE", "2");
    const app = createServer();
    const statuses: number[] = [];
    for (let i = 0; i < 3; i++) {
      const res = await request(app)
        .post("/api/transfer/assistant")
        .send({ question: "Hi" });
      statuses.push(res.status);
    }
    expect(statuses).toEqual([503, 503, 429]);
  });
});

describe("POST /api/delegate/summary", () => {
  it("requires an audio body", async () => {
    const res = await request(createServer())
      .post("/api/delegate/summary")
      .set("Content-Type", "audio/wav");
    expect(res.status).toBe(400);
  });

  it("rejects non-audio uploads", async () => {
    const res = await request(createServer())
      .post("/api/delegate/summary")
      .set("Content-Type", "text/html")
      .send("<html></html>");
    expect(res.status).toBe(415);
  });

  it("returns 503 before calling any provider when keys are missing", async () => {
    const res = await request(createServer())
      .post("/api/delegate/summary")
      .set("Content-Type", "audio/wav")
      .send(Buffer.from("RIFF...."));
    expect(res.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("transcribes then summarizes, falling back across models", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "k");
    vi.stubEnv("ELEVENLABS_API_KEY", "e");
    vi.stubEnv("OPENROUTER_SUMMARY_MODELS", "first/model, second/model");
    fetchMock
      .mockResolvedValueOnce(
        Response.json({ text: "We agreed to ship Friday." }),
      )
      .mockResolvedValueOnce(new Response("unavailable", { status: 503 }))
      .mockResolvedValueOnce(
        openRouterReply(
          '```json\n{"summary":"Ship Friday","decisions":["Ship"]}\n```',
        ),
      );

    const res = await request(createServer())
      .post("/api/delegate/summary")
      .set("Content-Type", "audio/mpeg")
      .set("x-filename", "../standup.mp3")
      .send(Buffer.from("ID3...."));

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      transcript: "We agreed to ship Friday.",
      summary: { summary: "Ship Friday", decisions: ["Ship"] },
      modelUsed: "second/model",
    });
    const sttForm = fetchMock.mock.calls[0][1].body as FormData;
    expect((sttForm.get("file") as File).name).toBe("standup.mp3");
    expect(fetchMock.mock.calls[0][1].headers).toEqual({ "xi-api-key": "e" });
  });

  it("returns 422 when no speech is detected", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "k");
    vi.stubEnv("ELEVENLABS_API_KEY", "e");
    fetchMock.mockResolvedValueOnce(Response.json({ text: "  " }));
    const res = await request(createServer())
      .post("/api/delegate/summary")
      .set("Content-Type", "audio/wav")
      .send(Buffer.from("RIFF...."));
    expect(res.status).toBe(422);
  });
});
