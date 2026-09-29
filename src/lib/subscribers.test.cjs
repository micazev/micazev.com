const { test } = require("node:test");
const assert = require("node:assert/strict");
const { normalizeEmail, toCsv, ebookEmail, redisConfig } = require("./subscribers.cjs");

test("normalizeEmail trims and lowercases a plausible address", () => {
  assert.equal(normalizeEmail("  Ola@Micazev.com "), "ola@micazev.com");
});

test("normalizeEmail rejects what cannot be an address", () => {
  for (const value of ["", "no-at-sign", "a@b", "a b@c.com", null, 42, `${"a".repeat(250)}@x.com`]) {
    assert.equal(normalizeEmail(value), null, String(value));
  }
});

test("toCsv quotes commas and quotes and defuses spreadsheet formulas", () => {
  const csv = toCsv([
    { email: "a@b.com", createdAt: "2026-09-29T00:00:00.000Z", ebook: "gurus", lang: "pt" },
    { email: "=cmd@x.com", createdAt: "", ebook: 'say "hi", ok', lang: "en" },
  ]);
  assert.equal(
    csv,
    'email,createdAt,ebook,lang\r\n' +
      "a@b.com,2026-09-29T00:00:00.000Z,gurus,pt\r\n" +
      `'=cmd@x.com,,"say ""hi"", ok",en\r\n`,
  );
});

test("ebookEmail is written in the reader's language and escapes the title", () => {
  const pt = ebookEmail({ title: "Gurus <1>", url: "https://micazev.com/ebooks/g.pdf", lang: "pt" });
  assert.equal(pt.subject, "Seu ebook: Gurus <1>");
  assert.match(pt.html, /Gurus &#60;1&#62;/);
  assert.match(pt.html, /Baixar o PDF/);
  assert.match(pt.text, /https:\/\/micazev\.com\/ebooks\/g\.pdf/);
  assert.match(ebookEmail({ title: "X", url: "u", lang: "xx" }).subject, /^Your ebook/);
});

test("redisConfig takes the Vercel KV names or the Upstash ones", () => {
  assert.deepEqual(redisConfig({ KV_REST_API_URL: "u", KV_REST_API_TOKEN: "t" }), { url: "u", token: "t" });
  assert.deepEqual(redisConfig({ UPSTASH_REDIS_REST_URL: "u", UPSTASH_REDIS_REST_TOKEN: "t" }), { url: "u", token: "t" });
  assert.equal(redisConfig({}), null);
});
