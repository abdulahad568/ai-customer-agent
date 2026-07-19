import { Router } from "express";
import Groq from "groq-sdk";
import db from "../db.js";
import { customers } from "../data/customers.js";

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not set. Create a backend/.env file with your key from https://console.groq.com");
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const router = Router();

router.post("/tickets", async (req, res) => {
  const { name, email, ticket } = req.body ?? {};

  if (!name || !email || !ticket) {
    res.status(400).json({ error: "name, email, and ticket are all required." });
    return;
  }

  const customer = customers.find(
    (c) => c.email.toLowerCase() === email.toLowerCase()
  ) ?? {
    name,
    email,
    plan: "Unknown",
    accountStatus: "Unknown",
    lastPayment: "N/A",
    subscription: "Unknown",
  };

  const prompt = `
You are an AI customer support analyst. Analyze the following support ticket and customer data.

Customer Information:
- Name: ${customer.name}
- Email: ${customer.email}
- Plan: ${customer.plan}
- Account Status: ${customer.accountStatus}
- Last Payment: ${customer.lastPayment}
- Subscription: ${customer.subscription}

Support Ticket:
"${ticket}"

Return ONLY valid JSON with no markdown, no code blocks, no extra text. The JSON must have exactly these fields:
{
  "sentiment": "Positive" | "Neutral" | "Negative",
  "intent": "Payment Issue" | "Refund" | "Password Reset" | "Login Issue" | "Subscription" | "Technical Problem" | "Account Update" | "Other",
  "priority": "High" | "Medium" | "Low",
  "resolution": "<a professional, personalized support reply addressing the customer by name and referencing their specific plan and issue>"
}

Priority rules: Negative sentiment = High, Neutral = Medium, Positive = Low.
`;

  let rawText: string;
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
    });
    rawText = completion.choices[0]?.message?.content ?? "";
  } catch (err: any) {
    console.error("[Groq error]", err.message);
    if (err?.status === 429) {
      res.status(429).json({ error: "Groq rate limit reached. Try again in a moment." });
      return;
    }
    if (err?.status === 401) {
      res.status(401).json({ error: "Invalid GROQ_API_KEY. Check your backend/.env file." });
      return;
    }
    res.status(502).json({ error: `Groq error: ${err.message}` });
    return;
  }

  const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  let analysis: { sentiment: string; intent: string; priority: string; resolution: string };
  try {
    analysis = JSON.parse(cleaned);
  } catch {
    res.status(502).json({ error: "AI returned invalid JSON. Please try again." });
    return;
  }

  db.prepare(
    `INSERT INTO tickets (name, email, ticket, sentiment, intent, priority, resolution)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(name, email, ticket, analysis.sentiment, analysis.intent, analysis.priority, analysis.resolution);

  res.json({ customer, ...analysis });
});

router.get("/tickets", (_req, res) => {
  const tickets = db.prepare("SELECT * FROM tickets ORDER BY created_at DESC").all();
  res.json(tickets);
});

router.get("/tickets/:id", (req, res) => {
  const ticket = db.prepare("SELECT * FROM tickets WHERE id = ?").get(Number(req.params.id));
  if (!ticket) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }
  res.json(ticket);
});

export default router;
