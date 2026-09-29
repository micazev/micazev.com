const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { loadEbooks, loadYogaCopy, manifest, publishEbooks } = require("./ebooks.cjs");

// A throwaway content/ with the layout the CMS writes.
function fixture(entries, yoga) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ebooks-"));
  fs.mkdirSync(path.join(root, "ebooks", "files"), { recursive: true });
  for (const [slug, data, files = []] of entries) {
    fs.writeFileSync(path.join(root, "ebooks", `${slug}.json`), JSON.stringify(data));
    for (const file of files) fs.writeFileSync(path.join(root, "ebooks", file), file);
  }
  if (yoga) {
    fs.mkdirSync(path.join(root, "site"));
    fs.writeFileSync(path.join(root, "site", "yoga.json"), JSON.stringify(yoga));
  }
  return root;
}

test("loadEbooks reads each entry and resolves its files", () => {
  const root = fixture([
    ["gurus", { title: "Gurus", file: "files/g.pdf", cover: "files/g.webp", language: "pt" }, ["files/g.pdf", "files/g.webp"]],
  ]);
  const [ebook] = loadEbooks(root);
  assert.equal(ebook.slug, "gurus");
  assert.equal(ebook.title, "Gurus");
  assert.equal(ebook.language, "pt");
  assert.equal(ebook.file, path.join(root, "ebooks", "files/g.pdf"));
  assert.equal(ebook.cover, path.join(root, "ebooks", "files/g.webp"));
});

test("loadEbooks skips an entry whose PDF is missing, and says so", () => {
  const root = fixture([["gone", { title: "Gone", file: "files/nope.pdf" }]]);
  const warnings = [];
  assert.deepEqual(loadEbooks(root, (m) => warnings.push(m)), []);
  assert.match(warnings[0], /gone\.json/);
});

test("loadEbooks and loadYogaCopy cope with content/ not having them yet", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ebooks-"));
  assert.deepEqual(loadEbooks(root), []);
  assert.equal(loadYogaCopy(root), null);
});

test("manifest lists every ebook and only names an active one that exists", () => {
  const root = fixture([["a", { title: "A", file: "files/a.pdf" }, ["files/a.pdf"]]]);
  const ebooks = loadEbooks(root);
  assert.deepEqual(manifest(ebooks, "a"), {
    active: "a",
    ebooks: [{ slug: "a", title: "A", language: "en", url: "/ebooks/a.pdf", coverUrl: null }],
  });
  assert.equal(manifest(ebooks, "missing").active, null);
});

test("publishEbooks copies files under /ebooks and writes the manifest", () => {
  const root = fixture(
    [["a", { title: "A", file: "files/a.pdf", cover: "files/a.PNG" }, ["files/a.pdf", "files/a.PNG"]]],
    { ebook: "a" },
  );
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "public-"));
  publishEbooks(loadEbooks(root), loadYogaCopy(root).ebook, out);
  assert.equal(fs.readFileSync(path.join(out, "ebooks", "a.pdf"), "utf8"), "files/a.pdf");
  assert.ok(fs.existsSync(path.join(out, "ebooks", "a.png")));
  const written = JSON.parse(fs.readFileSync(path.join(out, "ebooks", "index.json"), "utf8"));
  assert.equal(written.active, "a");
});
