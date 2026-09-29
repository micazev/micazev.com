// Everything /api/subscribe and /api/subscribers share: the subscriber list in
// Upstash Redis, the ebook email through Resend, and the check that lets only
// someone who can edit the content repo read the list.
//
// Both services are called over plain HTTPS, so there is no SDK to bundle.
// Env (set on the Vercel project by the Marketplace integrations):
//   KV_REST_API_URL, KV_REST_API_TOKEN   Upstash Redis REST endpoint
//   RESEND_API_KEY                       Resend; without it no email is sent
//   EBOOK_EMAIL_FROM                     optional, defaults to FROM below

// Gatsby compiles functions with every literal process.env.NAME replaced by
// its build-time value and any other use of process.env replaced by {}, so
// each variable is spelled out here. On Vercel they must be set before the
// build that ships the function.
const ENV = {
  KV_REST_API_URL: process.env.KV_REST_API_URL,
  KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EBOOK_EMAIL_FROM: process.env.EBOOK_EMAIL_FROM,
};

const CONTENT_REPO = "micazev/micazev-content";
const FROM = "Michelle Azevedo <ola@micazev.com>";

// One hash, email -> JSON record, so a second signup cannot duplicate a row.
const KEY = "subscribers";
const RATE_LIMIT = 10; // signups per IP per hour

/* ---- validation ---------------------------------------------------- */

// Deliberately loose: one @, something on each side, a dot in the domain.
// Anything stricter rejects real addresses; Resend bounces the rest.
function normalizeEmail(value) {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (email.length > 254) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

/* ---- CSV ------------------------------------------------------------ */

const CSV_COLUMNS = ["email", "createdAt", "ebook", "lang"];

// A leading = + - @ makes spreadsheets evaluate the cell; prefix a quote.
function csvCell(value) {
  let text = value == null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(rows) {
  const lines = [CSV_COLUMNS.join(",")];
  for (const row of rows) lines.push(CSV_COLUMNS.map((c) => csvCell(row[c])).join(","));
  return `${lines.join("\r\n")}\r\n`;
}

/* ---- Redis ---------------------------------------------------------- */

function redisConfig(env = ENV) {
  const url = env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL;
  const token = env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

async function redis(command, env = ENV) {
  const config = redisConfig(env);
  if (!config) throw new Error("Redis is not configured (KV_REST_API_URL / KV_REST_API_TOKEN)");
  const response = await fetch(config.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.token}` },
    body: JSON.stringify(command),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.error) {
    throw new Error(`Redis ${command[0]} failed: ${body.error || response.status}`);
  }
  return body.result;
}

// true when this IP is still under the hourly limit.
async function underRateLimit(ip, env = ENV) {
  const key = `ratelimit:subscribe:${ip || "unknown"}`;
  const count = await redis(["INCR", key], env);
  if (count === 1) await redis(["EXPIRE", key, "3600"], env);
  return count <= RATE_LIMIT;
}

// Keeps the first signup's record; returns true if the email is new.
async function addSubscriber({ email, ebook, lang }, env = ENV) {
  const record = { email, ebook, lang, createdAt: new Date().toISOString() };
  return (await redis(["HSETNX", KEY, email, JSON.stringify(record)], env)) === 1;
}

// Newest first.
async function listSubscribers(env = ENV) {
  const flat = (await redis(["HGETALL", KEY], env)) || [];
  const rows = [];
  for (let i = 1; i < flat.length; i += 2) {
    try {
      rows.push(JSON.parse(flat[i]));
    } catch {
      rows.push({ email: flat[i - 1] });
    }
  }
  return rows.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

async function removeSubscriber(email, env = ENV) {
  return (await redis(["HDEL", KEY, email], env)) === 1;
}

/* ---- email ---------------------------------------------------------- */

const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const EMAIL_COPY = {
  en: {
    subject: (title) => `Your ebook: ${title}`,
    intro: "Thanks for signing up. Here is the ebook you asked for:",
    button: "Download the PDF",
    outro: "Happy reading,",
  },
  pt: {
    subject: (title) => `Seu ebook: ${title}`,
    intro: "Obrigada por se inscrever. Aqui está o ebook que você pediu:",
    button: "Baixar o PDF",
    outro: "Boa leitura,",
  },
};

function ebookEmail({ title, url, lang }) {
  const t = EMAIL_COPY[lang] || EMAIL_COPY.en;
  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#131316;max-width:480px">
<p>${escapeHtml(t.intro)}</p>
<p style="font-weight:600">${escapeHtml(title)}</p>
<p><a href="${escapeHtml(url)}" style="display:inline-block;background:#131316;color:#ffffff;text-decoration:none;padding:11px 20px;border-radius:999px;font-size:13px;font-weight:500">${escapeHtml(t.button)}</a></p>
<p>${escapeHtml(t.outro)}<br>Michelle</p>
<p style="color:#a1a1aa;font-size:12px">micazev.com</p>
</div>`;
  const text = `${t.intro}\n\n${title}\n${url}\n\n${t.outro}\nMichelle`;
  return { subject: t.subject(title), html, text };
}

// Resolves to false (not an error) when email is not set up, so a signup
// still gets its download link on the page.
async function sendEbookEmail({ to, title, url, lang }, env = ENV) {
  if (!env.RESEND_API_KEY) return false;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: env.EBOOK_EMAIL_FROM || FROM, to: [to], ...ebookEmail({ title, url, lang }) }),
  });
  if (!response.ok) {
    throw new Error(`Resend ${response.status}: ${await response.text().catch(() => "")}`);
  }
  return true;
}

/* ---- admin check ---------------------------------------------------- */

// The subscriber list is for whoever can edit the site. The CMS already signs
// in with a GitHub token on the content repo, so that token is the key:
// GitHub says whether it can push there.
async function canEditContent(token) {
  if (!token) return false;
  const response = await fetch(`https://api.github.com/repos/${CONTENT_REPO}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "micazev.com",
    },
  });
  if (!response.ok) return false;
  const repo = await response.json();
  return Boolean(repo.permissions && repo.permissions.push);
}

module.exports = {
  normalizeEmail,
  toCsv,
  redisConfig,
  underRateLimit,
  addSubscriber,
  listSubscribers,
  removeSubscriber,
  ebookEmail,
  sendEbookEmail,
  canEditContent,
};
