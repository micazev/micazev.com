// Ebooks are one JSON file each in content/ebooks/<slug>.json, written by the
// "Ebooks" collection in the CMS. The PDF and cover they point at sit in
// content/ebooks/files/. content/site/yoga.json names the one /yoga hands out.
//
// Nothing under content/ is served as is, so the build copies each ebook to
// /ebooks/<slug>.pdf (and its cover to /ebooks/<slug>.<ext>) and writes
// /ebooks/index.json, which /api/subscribe reads to know what to send.

const fs = require("fs");
const path = require("path");

const SLUG = /^[a-z0-9][a-z0-9-]*$/;

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw new Error(`${file}: ${error.message}`);
  }
}

// -> [{ slug, title, description, language, file, cover }], with file and
// cover as absolute paths on disk. An entry whose PDF is missing is dropped
// with a warning rather than failing the build.
function loadEbooks(contentDir, warn = () => {}) {
  const dir = path.join(contentDir, "ebooks");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .flatMap((name) => {
      const slug = name.slice(0, -".json".length);
      const data = readJson(path.join(dir, name)) || {};
      if (!SLUG.test(slug)) {
        warn(`content/ebooks/${name}: file name must be lowercase letters, numbers and dashes`);
        return [];
      }
      const file = data.file && path.join(dir, data.file);
      if (!file || !fs.existsSync(file)) {
        warn(`content/ebooks/${name}: no PDF at "${data.file || ""}", skipping`);
        return [];
      }
      const cover = data.cover && path.join(dir, data.cover);
      return [
        {
          slug,
          title: data.title || slug,
          description: data.description || "",
          language: data.language || "en",
          file,
          cover: cover && fs.existsSync(cover) ? cover : null,
        },
      ];
    });
}

// Where the build publishes an ebook's files.
function publicPaths(ebook) {
  return {
    url: `/ebooks/${ebook.slug}.pdf`,
    coverUrl: ebook.cover
      ? `/ebooks/${ebook.slug}${path.extname(ebook.cover).toLowerCase()}`
      : null,
  };
}

// content/site/yoga.json, or null if it has not been written yet.
function loadYogaCopy(contentDir) {
  return readJson(path.join(contentDir, "site", "yoga.json"));
}

// The manifest /api/subscribe fetches: every ebook, and which one is active.
function manifest(ebooks, activeSlug) {
  const active = ebooks.some((e) => e.slug === activeSlug) ? activeSlug : null;
  return {
    active,
    ebooks: ebooks.map((ebook) => ({
      slug: ebook.slug,
      title: ebook.title,
      language: ebook.language,
      ...publicPaths(ebook),
    })),
  };
}

// Copy every ebook and cover into <outDir>/ebooks/ and write the manifest.
function publishEbooks(ebooks, activeSlug, outDir) {
  const dir = path.join(outDir, "ebooks");
  fs.mkdirSync(dir, { recursive: true });
  for (const ebook of ebooks) {
    const { url, coverUrl } = publicPaths(ebook);
    fs.copyFileSync(ebook.file, path.join(outDir, url));
    if (coverUrl) fs.copyFileSync(ebook.cover, path.join(outDir, coverUrl));
  }
  fs.writeFileSync(
    path.join(dir, "index.json"),
    JSON.stringify(manifest(ebooks, activeSlug), null, 2),
  );
}

module.exports = { loadEbooks, loadYogaCopy, publicPaths, manifest, publishEbooks };
