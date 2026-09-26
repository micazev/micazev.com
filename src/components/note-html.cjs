// A note (or page) is one Markdown file per language, <slug>.en.md and
// <slug>.pt.md, the layout Sveltia CMS writes. gatsby-node tags each node
// with fields.slug / fields.lang / fields.hasBody from its file name; this
// folds those nodes back into one entry per slug.

const LANGS = ["en", "pt"];

// Nodes -> [{ slug, date, tags, langs, titles: {en, pt}, html: {en, pt} }],
// in the order the nodes came in (queries sort by date first). A language
// counts only if its body was actually written.
function groupTranslations(nodes) {
  const bySlug = new Map();

  for (const node of nodes || []) {
    const { slug, lang, hasBody } = node.fields;
    if (!bySlug.has(slug)) {
      bySlug.set(slug, { slug, date: null, tags: [], titles: {}, html: {}, present: new Set() });
    }
    const entry = bySlug.get(slug);
    const fm = node.frontmatter || {};

    entry.titles[lang] = fm.title;
    entry.html[lang] = node.html;
    if (hasBody) entry.present.add(lang);

    // Shared fields are duplicated across languages; the first one that has
    // a value wins, preferring English since nodes arrive en before pt.
    if (!entry.date && fm.date) entry.date = fm.date;
    if (entry.tags.length === 0 && fm.tags && fm.tags.length) entry.tags = fm.tags;
  }

  return [...bySlug.values()].map(({ present, ...entry }) => {
    const langs = LANGS.filter((lang) => present.has(lang));
    return { ...entry, langs: langs.length ? langs : LANGS.filter((l) => l in entry.titles) };
  });
}

// The language an entry can honestly be shown in. Title and body both go
// through this, so they can never end up disagreeing.
function noteLang(langs, lang) {
  if (!langs || langs.length === 0) return lang;
  if (langs.includes(lang)) return lang;
  return langs.includes("en") ? "en" : langs[0];
}

// <slug>.en.md -> { slug, lang: "en" }. A file with no language suffix is
// English, so a hand-written note.md still builds.
function parseFileName(name) {
  const match = /^(.+)\.(en|pt)$/.exec(name);
  return match ? { slug: match[1], lang: match[2] } : { slug: name, lang: "en" };
}

module.exports = { groupTranslations, noteLang, parseFileName, LANGS };
