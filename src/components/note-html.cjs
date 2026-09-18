// A note is one Markdown file holding both translations, split by
// <!--lang:en--> / <!--lang:pt--> markers. Most notes only have one side
// written; the other marker sits there with nothing after it.

const MARKER = /<!--\s*lang:(en|pt)\s*-->/gi;

// Marker -> trimmed body, skipping the sections that were never written.
function langBlocks(text) {
  const blocks = {};
  if (!text) return blocks;

  const parts = text.split(MARKER);
  for (let i = 1; i < parts.length; i += 2) {
    const body = (parts[i + 1] || "").trim();
    if (body) blocks[parts[i].toLowerCase()] = body;
  }

  return blocks;
}

// Which translations this note actually has. Empty means it carries no
// markers at all, so we cannot tell from the body alone.
function availableLangs(text) {
  const blocks = langBlocks(text);
  return ["en", "pt"].filter((lang) => blocks[lang]);
}

// The language a note can honestly be shown in. Title and body both go
// through this, so they can never end up disagreeing.
function noteLang(langs, lang) {
  if (!langs || langs.length === 0) return lang;
  if (langs.includes(lang)) return lang;
  return langs.includes("en") ? "en" : langs[0];
}

function htmlForLang(html, lang) {
  if (!html) return "";

  const blocks = langBlocks(html);
  return blocks[lang] || blocks.en || blocks.pt || html.trim();
}

module.exports = { htmlForLang, availableLangs, noteLang };
