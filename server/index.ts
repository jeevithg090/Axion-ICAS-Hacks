import "dotenv/config";
import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import { rateLimit } from "express-rate-limit";
import type { PingResponse } from "@shared/api";
import { handleDelegateSummary } from "./routes/delegate-summary";
import { handleTransferAssistant } from "./routes/transfer-assistant";

const MAX_AUDIO_UPLOAD = process.env.MAX_AUDIO_UPLOAD || "25mb";

function corsOrigins(): cors.CorsOptions["origin"] {
  const raw = process.env.CORS_ORIGINS?.trim();
  if (!raw) return false; // same-origin only (the SPA is served by this server)
  if (raw === "*") return true;
  return raw.split(",").map((o) => o.trim());
}

/** Rate limiter for endpoints that spend paid third-party API credits. */
function aiLimiter() {
  return rateLimit({
    windowMs: 60_000,
    limit: Number(process.env.AI_RATE_LIMIT_PER_MINUTE) || 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: "Too many requests, please try again in a minute." },
  });
}

export function createServer() {
  const app = express();

  app.disable("x-powered-by");
  // Behind Netlify / most PaaS load balancers there is exactly one proxy hop.
  app.set("trust proxy", Number(process.env.TRUST_PROXY ?? 1));

  app.use(cors({ origin: corsOrigins() }));

  app.get("/api/ping", (_req, res) => {
    const body: PingResponse = { message: process.env.PING_MESSAGE ?? "ping" };
    res.json(body);
  });

  app.post(
    "/api/transfer/assistant",
    aiLimiter(),
    express.json({ limit: "100kb" }),
    handleTransferAssistant,
  );

  app.post(
    "/api/delegate/summary",
    aiLimiter(),
    express.raw({ type: () => true, limit: MAX_AUDIO_UPLOAD }),
    handleDelegateSummary,
  );

  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
  });

  const onError: ErrorRequestHandler = (err, _req, res, _next) => {
    const status = Number(err?.status || err?.statusCode) || 500;
    if (status >= 500) console.error("[api]", err);
    res.status(status).json({
      error:
        status >= 500 ? "Internal server error" : err.message || "Bad request",
    });
  };
  app.use(onError);

  return app;
}
