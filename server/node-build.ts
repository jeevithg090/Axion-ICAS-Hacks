import path from "node:path";
import express from "express";
import { createServer } from "./index";

const app = createServer();
const port = Number(process.env.PORT) || 3000;

// In production the built SPA lives next to the server bundle.
const distPath = path.join(import.meta.dirname, "../spa");

app.use(express.static(distPath, { index: false, maxAge: "1h" }));

// Client-side routing: every non-API GET falls back to index.html.
app.get("/{*splat}", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const server = app.listen(port, () => {
  console.log(
    `ICAS Student Life Assistant listening on http://localhost:${port}`,
  );
});

function shutdown(signal: string) {
  console.log(`Received ${signal}, shutting down`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
