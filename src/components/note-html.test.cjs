const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  groupTranslations,
  noteLang,
  parseFileName,
} = require("./note-html.cjs");

const node = (slug, lang, frontmatter, html = `<p>${lang}</p>`, hasBody = true) => ({
  fields: { slug, lang, hasBody },
  frontmatter,
  html,
});

test("parseFileName reads slug and language from the file name", () => {
  assert.deepEqual(parseFileName("traveling-alone.en"), { slug: "traveling-alone", lang: "en" });
  assert.deepEqual(parseFileName("traveling-alone.pt"), { slug: "traveling-alone", lang: "pt" });
  assert.deepEqual(parseFileName("v1.2.pt"), { slug: "v1.2", lang: "pt" });
});

test("parseFileName treats a file with no suffix as English", () => {
  assert.deepEqual(parseFileName("hand-written"), { slug: "hand-written", lang: "en" });
});

test("groupTranslations folds both languages into one entry", () => {
  const [entry, ...rest] = groupTranslations([
    node("a", "en", { title: "Hello", date: "2024-01-01", tags: ["ai"] }),
    node("a", "pt", { title: "Olá", date: "2024-01-01", tags: ["ai"] }),
  ]);

  assert.equal(rest.length, 0);
  assert.equal(entry.slug, "a");
  assert.equal(entry.date, "2024-01-01");
  assert.deepEqual(entry.tags, ["ai"]);
  assert.deepEqual(entry.langs, ["en", "pt"]);
  assert.deepEqual(entry.titles, { en: "Hello", pt: "Olá" });
  assert.deepEqual(entry.html, { en: "<p>en</p>", pt: "<p>pt</p>" });
});

test("groupTranslations keeps query order across slugs", () => {
  const slugs = groupTranslations([
    node("new", "en", { title: "N" }),
    node("new", "pt", { title: "N" }),
    node("old", "en", { title: "O" }),
  ]).map((entry) => entry.slug);

  assert.deepEqual(slugs, ["new", "old"]);
});

test("a language file with an empty body does not count as a translation", () => {
  const [entry] = groupTranslations([
    node("a", "en", { title: "Hello" }),
    node("a", "pt", { title: "" }, "", false),
  ]);

  assert.deepEqual(entry.langs, ["en"]);
});

test("a Portuguese-only note lists only pt", () => {
  const [entry] = groupTranslations([node("a", "pt", { title: "Olá" })]);
  assert.deepEqual(entry.langs, ["pt"]);
});

test("noteLang keeps the reader's language when that body exists", () => {
  assert.equal(noteLang(["en", "pt"], "pt"), "pt");
  assert.equal(noteLang(["en", "pt"], "en"), "en");
});

test("noteLang falls back to the language the note is actually written in", () => {
  assert.equal(noteLang(["en"], "pt"), "en");
  assert.equal(noteLang(["pt"], "en"), "pt");
});

test("noteLang leaves an entry with no known languages on the reader's language", () => {
  assert.equal(noteLang([], "pt"), "pt");
  assert.equal(noteLang(undefined, "pt"), "pt");
});

test("title and body never disagree for an untranslated note", () => {
  const [entry] = groupTranslations([node("a", "en", { title: "Hello" })]);
  const shown = noteLang(entry.langs, "pt");

  assert.equal(shown, "en");
  assert.equal(entry.titles[shown], "Hello");
  assert.equal(entry.html[shown], "<p>en</p>");
});
