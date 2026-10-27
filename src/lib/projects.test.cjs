const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { loadProjects, imageUrl, publishProjects } = require("./projects.cjs");

// A throwaway content/ with the layout the CMS writes.
function fixture(entries) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "projects-"));
  fs.mkdirSync(path.join(root, "projects", "images"), { recursive: true });
  for (const [slug, data, files = []] of entries) {
    fs.writeFileSync(path.join(root, "projects", `${slug}.json`), JSON.stringify(data));
    for (const file of files) fs.writeFileSync(path.join(root, "projects", file), file);
  }
  return root;
}

test("loadProjects sorts by order, then name, with unordered ones last", () => {
  const root = fixture([
    ["zeta", { name: "Zeta" }],
    ["beta", { name: "Beta", order: 2 }],
    ["alpha", { name: "Alpha", order: 1 }],
    ["gamma", { name: "Gamma", order: 2 }],
  ]);
  assert.deepEqual(loadProjects(root).map((p) => p.slug), ["alpha", "beta", "gamma", "zeta"]);
});

test("loadProjects resolves the screenshot, and keeps a project whose screenshot is missing", () => {
  const root = fixture([
    ["shown", { name: "Shown", image: "images/My Shot.WEBP", imageAlt: "A map" }, ["images/My Shot.WEBP"]],
    ["gone", { name: "Gone", image: "images/nope.webp" }],
  ]);
  const warnings = [];
  const [gone, shown] = loadProjects(root, (m) => warnings.push(m));
  assert.equal(shown.image, path.join(root, "projects", "images/My Shot.WEBP"));
  assert.equal(shown.imageAlt, "A map");
  assert.equal(gone.image, null);
  assert.match(warnings[0], /gone\.json/);
});

test("publishProjects copies each screenshot to a URL-safe name", () => {
  const root = fixture([["shown", { name: "Shown", image: "images/My Shot.WEBP" }, ["images/My Shot.WEBP"]]]);
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "public-"));
  const projects = loadProjects(root);
  publishProjects(projects, out);
  assert.equal(imageUrl(projects[0]), "/projects/shown.webp");
  assert.ok(fs.existsSync(path.join(out, "projects", "shown.webp")));
});

test("loadProjects reads placement, defaulting to featured, and keeps only filled case blocks", () => {
  const root = fixture([
    ["plain", { name: "Plain" }],
    ["home", { name: "Home", placement: "home", summary: "One line", client: true }],
    ["odd", { name: "Odd", placement: "sidebar" }],
    ["story", { name: "Story", case: { result: "Shipped", problem: " Slow ", built: "  " } }],
  ]);
  const warnings = [];
  const bySlug = Object.fromEntries(loadProjects(root, (m) => warnings.push(m)).map((p) => [p.slug, p]));
  assert.equal(bySlug.plain.placement, "featured");
  assert.equal(bySlug.plain.client, false);
  assert.deepEqual(bySlug.plain.case, []);
  assert.equal(bySlug.home.placement, "home");
  assert.equal(bySlug.home.summary, "One line");
  assert.equal(bySlug.home.client, true);
  assert.equal(bySlug.odd.placement, "featured");
  assert.match(warnings[0], /odd\.json/);
  assert.deepEqual(bySlug.story.case, [
    { key: "problem", text: "Slow" },
    { key: "result", text: "Shipped" },
  ]);
});
