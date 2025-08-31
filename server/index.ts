import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleTransferAssistant } from "./routes/transfer-assistant";
import { handleDelegateSummary } from "./routes/delegate-summary";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  app.post("/api/transfer/assistant", handleTransferAssistant);

  // Raw body for audio upload
  app.post(
    "/api/delegate/summary",
    express.raw({ type: "*/*", limit: "50mb" }),
    handleDelegateSummary
  );

  return app;
}
