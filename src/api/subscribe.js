// POST /api/subscribe  { email, lang, website }
//
// The /yoga signup form. Saves the email, emails the active ebook (when
// Resend is set up), and answers with the download link so the page can
// start the download straight away.

const {
  normalizeEmail,
  underRateLimit,
  addSubscriber,
  sendEbookEmail,
} = require("../lib/subscribers.cjs");

// Production links always point at the real domain; previews and
// gatsby develop use whatever host the request came in on.
const origin = (req) => {
  if (process.env.VERCEL_ENV === "production") return "https://micazev.com";
  const proto = req.headers["x-forwarded-proto"] || "http";
  return `${proto.split(",")[0]}://${req.headers["x-forwarded-host"] || req.headers.host}`;
};

// The build writes /ebooks/index.json (src/lib/ebooks.cjs); the function
// reads it back from the site it is deployed with.
async function activeEbook(base) {
  const response = await fetch(`${base}/ebooks/index.json`);
  if (!response.ok) return null;
  const { active, ebooks } = await response.json();
  return ebooks.find((ebook) => ebook.slug === active) || null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const body = req.body || {};
  const lang = body.lang === "pt" ? "pt" : "en";

  // Honeypot: a field people never see. Bots fill it; pretend it worked.
  if (body.website) return res.status(200).json({ ok: true });

  const email = normalizeEmail(body.email);
  if (!email) return res.status(400).json({ error: "invalid_email" });

  try {
    const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
    if (!(await underRateLimit(ip))) {
      return res.status(429).json({ error: "rate_limited" });
    }

    const base = origin(req);
    const ebook = await activeEbook(base);
    if (!ebook) return res.status(503).json({ error: "no_ebook" });

    await addSubscriber({ email, ebook: ebook.slug, lang });

    const url = `${base}${ebook.url}`;
    let emailed = false;
    try {
      emailed = await sendEbookEmail({ to: email, title: ebook.title, url, lang });
    } catch (error) {
      // The signup is saved and the link is on screen; a failed email
      // should not turn that into an error for the reader.
      console.error("subscribe: email failed", error);
    }

    return res.status(200).json({ ok: true, url: ebook.url, title: ebook.title, emailed });
  } catch (error) {
    console.error("subscribe:", error);
    return res.status(500).json({ error: "server_error" });
  }
}
