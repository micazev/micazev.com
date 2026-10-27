// Projects are one JSON file each in content/projects/<slug>.json, written
// by the "Projects" collection in the CMS. Their screenshots sit in
// content/projects/images/. Each one's placement decides where it shows:
// the home page, or one of the sections of /projects.
//
// Nothing under content/ is served as is, so the build copies each
// screenshot to /projects/<slug>.<ext>, a name that is safe in a URL
// whatever the uploaded file was called.

const fs = require("fs");
const path = require("path");

const SLUG = /^[a-z0-9][a-z0-9-]*$/;

const PLACEMENTS = ["home", "featured", "exploration", "building", "hidden"];

// The mini case study on a featured project, in reading order. Blocks left
// empty in the CMS are dropped.
const CASE_BLOCKS = ["problem", "built", "decisions", "result"];

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    throw new Error(`${file}: ${error.message}`);
  }
}

// -> [{ slug, name, href, summary, placement, client, case, image, imageAlt,
// socials }] in the order set in the CMS (then by name), with image as an
// absolute path on disk or null and case as [{ key, text }]. A screenshot
// that is missing drops the image, not the project; an unknown placement
// falls back to featured.
function loadProjects(contentDir, warn = () => {}) {
  const dir = path.join(contentDir, "projects");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .flatMap((name) => {
      const slug = name.slice(0, -".json".length);
      if (!SLUG.test(slug)) {
        warn(`content/projects/${name}: file name must be lowercase letters, numbers and dashes`);
        return [];
      }
      const data = readJson(path.join(dir, name));
      let image = data.image ? path.join(dir, data.image) : null;
      if (image && !fs.existsSync(image)) {
        warn(`content/projects/${name}: no screenshot at "${data.image}", showing it without one`);
        image = null;
      }
      let placement = data.placement || "featured";
      if (!PLACEMENTS.includes(placement)) {
        warn(`content/projects/${name}: unknown placement "${placement}", showing it as featured`);
        placement = "featured";
      }
      const story = data.case || {};
      return [
        {
          slug,
          order: Number.isFinite(data.order) ? data.order : Infinity,
          name: data.name || slug,
          href: data.href || "",
          summary: data.summary || "",
          placement,
          client: Boolean(data.client),
          case: CASE_BLOCKS.filter((key) => story[key] && story[key].trim()).map((key) => ({
            key,
            text: story[key].trim(),
          })),
          image,
          imageAlt: data.imageAlt || "",
          socials: data.socials || [],
        },
      ];
    })
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
    .map(({ order, ...project }) => project);
}

// Where the build publishes a project's screenshot.
function imageUrl(project) {
  return project.image
    ? `/projects/${project.slug}${path.extname(project.image).toLowerCase()}`
    : null;
}

// Copy every screenshot into <outDir>/projects/.
function publishProjects(projects, outDir) {
  fs.mkdirSync(path.join(outDir, "projects"), { recursive: true });
  for (const project of projects) {
    const url = imageUrl(project);
    if (url) fs.copyFileSync(project.image, path.join(outDir, url));
  }
}

module.exports = { loadProjects, imageUrl, publishProjects };
