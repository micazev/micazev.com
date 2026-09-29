// /api/subscribers — the list behind /admin/subscribers/.
//
//   GET                 -> { subscribers: [...] }
//   GET ?format=csv     -> subscribers.csv
//   DELETE ?email=...   -> removes one subscriber
//
// Authorization: Bearer <GitHub token that can push to the content repo>,
// the same token the CMS signs in with.

const {
  normalizeEmail,
  toCsv,
  listSubscribers,
  removeSubscriber,
  canEditContent,
} = require("../lib/subscribers.cjs");

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!(await canEditContent(token))) {
    return res.status(401).json({ error: "unauthorized" });
  }

  try {
    if (req.method === "GET") {
      const subscribers = await listSubscribers();
      if (req.query.format === "csv") {
        const date = new Date().toISOString().slice(0, 10);
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="subscribers-${date}.csv"`);
        return res.status(200).send(toCsv(subscribers));
      }
      return res.status(200).json({ subscribers });
    }

    if (req.method === "DELETE") {
      const email = normalizeEmail(req.query.email);
      if (!email) return res.status(400).json({ error: "invalid_email" });
      return res.status(200).json({ removed: await removeSubscriber(email) });
    }

    res.setHeader("Allow", "GET, DELETE");
    return res.status(405).json({ error: "method_not_allowed" });
  } catch (error) {
    console.error("subscribers:", error);
    return res.status(500).json({ error: "server_error" });
  }
}
