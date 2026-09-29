const path = require("path");
const { parseFileName } = require("./src/components/note-html.cjs");
const {
  loadEbooks,
  loadYogaCopy,
  publicPaths,
  publishEbooks,
} = require("./src/lib/ebooks.cjs");

const CONTENT = path.join(__dirname, "content");

// Top-level routes a CMS page must not take over.
const RESERVED = new Set([
  "notes",
  "notas",
  "tech",
  "yoga",
  "ebooks",
  "api",
  "admin",
  "404",
  "dev-404-page",
]);

// Pin the frontmatter and fields so queries still build while a collection
// is empty (no pages yet) or no entry happens to set an optional field.
exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type MarkdownRemark implements Node {
      frontmatter: MarkdownRemarkFrontmatter
      fields: MarkdownRemarkFields
    }
    type MarkdownRemarkFrontmatter {
      title: String
      date: Date @dateformat
      tags: [String!]
    }
    type MarkdownRemarkFields {
      slug: String!
      lang: String!
      collection: String!
      hasBody: Boolean!
    }
  `);
};

// Slug and language come from the file name (<slug>.en.md), the collection
// from which content/ folder the file was sourced from.
exports.onCreateNode = ({ node, getNode, actions }) => {
  if (node.internal.type !== "MarkdownRemark") return;

  const file = getNode(node.parent);
  const { slug, lang } = parseFileName(file.name);
  const { createNodeField } = actions;

  createNodeField({ node, name: "slug", value: slug });
  createNodeField({ node, name: "lang", value: lang });
  createNodeField({ node, name: "collection", value: file.sourceInstanceName });
  createNodeField({
    node,
    name: "hasBody",
    value: Boolean(node.rawMarkdownBody && node.rawMarkdownBody.trim()),
  });
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage, createRedirect } = actions;

  createRedirect({
    fromPath: "/notas",
    toPath: "/notes",
    isPermanent: true,
  });
  createRedirect({
    fromPath: "/notas/",
    toPath: "/notes/",
    isPermanent: true,
  });

  const result = await graphql(`
    query {
      allMarkdownRemark {
        nodes {
          fields {
            slug
            collection
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild("Error loading notes", result.errors);
    return;
  }

  const slugs = { notes: new Set(), pages: new Set() };
  for (const { fields } of result.data.allMarkdownRemark.nodes) {
    slugs[fields.collection]?.add(fields.slug);
  }

  const noteTemplate = path.resolve("src/templates/note.js");
  for (const slug of slugs.notes) {
    createPage({
      path: `/notes/${slug}/`,
      component: noteTemplate,
      context: { slug },
    });

    createRedirect({
      fromPath: `/notas/${slug}`,
      toPath: `/notes/${slug}/`,
      isPermanent: true,
    });
    createRedirect({
      fromPath: `/notas/${slug}/`,
      toPath: `/notes/${slug}/`,
      isPermanent: true,
    });
  }

  const pageTemplate = path.resolve("src/templates/page.js");
  for (const slug of slugs.pages) {
    if (RESERVED.has(slug)) {
      reporter.panicOnBuild(
        `content/pages/${slug}: "/${slug}/" is already a route on the site; rename the page.`,
      );
      continue;
    }

    createPage({
      path: `/${slug}/`,
      component: pageTemplate,
      context: { slug },
    });
  }

  // /yoga: its copy and the ebook it offers are read here rather than
  // imported, so the site still builds while content/ has neither.
  const copy = loadYogaCopy(CONTENT);
  const ebooks = loadEbooks(CONTENT, (msg) => reporter.warn(msg));
  const active = copy && ebooks.find((ebook) => ebook.slug === copy.ebook);
  if (copy && copy.ebook && !active) {
    reporter.warn(
      `content/site/yoga.json: ebook "${copy.ebook}" not found; /yoga will show no signup form.`,
    );
  }

  createPage({
    path: "/yoga/",
    component: path.resolve("src/templates/yoga.js"),
    context: {
      copy: copy ? { en: copy.en || {}, pt: copy.pt || {} } : { en: {}, pt: {} },
      // Title and cover only; the PDF's address is handed out by
      // /api/subscribe once an email is in.
      ebook: active
        ? {
            slug: active.slug,
            title: active.title,
            description: active.description,
            language: active.language,
            coverUrl: publicPaths(active).coverUrl,
          }
        : null,
    },
  });
};

const activeEbook = () => (loadYogaCopy(CONTENT) || {}).ebook;

exports.onPostBuild = ({ reporter }) => {
  publishEbooks(
    loadEbooks(CONTENT, (msg) => reporter.warn(msg)),
    activeEbook(),
    path.join(__dirname, "public"),
  );
};

// gatsby develop serves public/ too, so publish there on start; restart
// develop to pick up an ebook added or swapped while it runs.
exports.onCreateDevServer = ({ reporter }) => {
  publishEbooks(
    loadEbooks(CONTENT, (msg) => reporter.warn(msg)),
    activeEbook(),
    path.join(__dirname, "public"),
  );
};
