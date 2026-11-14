import type { RequestHandler } from "express";
import { z } from "zod";
import type { TransferAssistantResponse } from "@shared/api";
import { HttpError, toErrorResponse } from "../lib/errors";
import { chatCompletion } from "../lib/openrouter";

const MAX_CONTEXT_CHARS = 20_000;

export const transferAssistantSchema = z.object({
  question: z.string().trim().min(1, "question is required").max(2000),
  context: z.unknown().optional(),
});

const SYSTEM_PROMPT =
  "You are the ICAS Smart Transfer Assistant. Answer succinctly. Use the provided JSON context when relevant. If data is missing, respond with general guidance.";

export const handleTransferAssistant: RequestHandler = async (req, res) => {
  try {
    const parsed = transferAssistantSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      throw new HttpError(
        400,
        parsed.error.issues[0]?.message ?? "Invalid request",
      );
    }
    const { question, context } = parsed.data;
    const contextJson = JSON.stringify(context ?? null);
    if (contextJson.length > MAX_CONTEXT_CHARS) {
      throw new HttpError(413, "context is too large");
    }

    const answer = await chatCompletion({
      model: process.env.OPENROUTER_ASSISTANT_MODEL || "openrouter/auto",
      title: "ICAS Smart Transfer Portal",
      maxTokens: 300,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Question: ${question}\nContext: ${contextJson}`,
        },
      ],
    });

    const body: TransferAssistantResponse = { answer };
    res.json(body);
  } catch (err) {
    if (!(err instanceof HttpError)) console.error("[transfer-assistant]", err);
    const { status, body } = toErrorResponse(err);
    res.status(status).json(body);
  }
};
