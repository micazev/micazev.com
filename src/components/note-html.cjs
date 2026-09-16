function htmlForLang(html, lang) {
  if (!html) return "";

  const parts = html.split(/<!--\s*lang:(en|pt)\s*-->/i);
  const blocks = {};

  for (let i = 1; i < parts.length; i += 2) {
    const key = parts[i].toLowerCase();
    blocks[key] = (parts[i + 1] || "").trim();
  }

  return blocks[lang] || blocks.en || blocks.pt || html.trim();
}

module.exports = { htmlForLang };
