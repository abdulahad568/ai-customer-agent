import { Router } from "express";
import db from "../db.js";

const router = Router();

function count(query: string, ...params: unknown[]): number {
  const row = db.prepare(query).get(...(params as [])) as { count: number };
  return row.count;
}

router.get("/dashboard/stats", (_req, res) => {
  const total    = count("SELECT COUNT(*) as count FROM tickets");
  const high     = count("SELECT COUNT(*) as count FROM tickets WHERE priority = 'High'");
  const medium   = count("SELECT COUNT(*) as count FROM tickets WHERE priority = 'Medium'");
  const low      = count("SELECT COUNT(*) as count FROM tickets WHERE priority = 'Low'");
  const positive = count("SELECT COUNT(*) as count FROM tickets WHERE sentiment = 'Positive'");
  const neutral  = count("SELECT COUNT(*) as count FROM tickets WHERE sentiment = 'Neutral'");
  const negative = count("SELECT COUNT(*) as count FROM tickets WHERE sentiment = 'Negative'");

  res.json({
    total,
    resolved: total,
    pending: 0,
    urgent: high,
    byPriority:  [{ name: "High", value: high }, { name: "Medium", value: medium }, { name: "Low", value: low }],
    bySentiment: [{ name: "Positive", value: positive }, { name: "Neutral", value: neutral }, { name: "Negative", value: negative }],
  });
});

router.get("/dashboard/recent", (_req, res) => {
  const tickets = db.prepare("SELECT * FROM tickets ORDER BY created_at DESC LIMIT 5").all();
  res.json(tickets);
});

export default router;
