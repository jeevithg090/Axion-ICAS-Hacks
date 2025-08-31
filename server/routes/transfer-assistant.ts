import type { RequestHandler } from "express";

export const handleTransferAssistant: RequestHandler = async (req, res) => {
  try {
    const key = process.env.OPENROUTER_API_KEY;
    if (!key)
      return res.status(500).json({ error: "Assistant not configured" });

    const { question, context } = req.body || {};
    const sys = `You are the ICAS Smart Transfer Assistant. Answer succinctly. Use the provided JSON context when relevant. If data is missing, respond with general guidance.`;

    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        "HTTP-Referer": "https://builder.io",
        "X-Title": "ICAS Smart Transfer Portal",
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [
          { role: "system", content: sys },
          {
            role: "user",
            content: `Question: ${question}\nContext: ${JSON.stringify(context)}`,
          },
        ],
        max_tokens: 300,
        temperature: 0.2,
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      return res.status(500).json({ error: "OpenRouter error", detail: t });
    }
    const data = await resp.json();
    const answer = data.choices?.[0]?.message?.content ?? "";
    res.json({ answer });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "unknown" });
  }
};
