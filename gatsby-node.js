const path = require("path");
const { availableLangs } = require("./src/components/note-html.cjs");

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
          id
          frontmatter {
            slug
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild("Error loading notes", result.errors);
    return;
  }

  const template = path.resolve("src/templates/note.js");

  for (const node of result.data.allMarkdownRemark.nodes) {
    const slug = node.frontmatter?.slug;
    if (!slug) {
      reporter.warn(`Note ${node.id} is missing frontmatter.slug`);
      continue;
    }

    createPage({
      path: `/notes/${slug}/`,
      component: template,
      context: { id: node.id, slug },
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
};

// Which translations a note actually ships, read from the body at build time
// so a newly written translation is picked up without touching frontmatter.
exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    MarkdownRemark: {
      langs: {
        type: "[String!]!",
        resolve: (source) => {
          const found = availableLangs(source.rawMarkdownBody);
          if (found.length > 0) return found;

          // No markers at all: the whole file is its original language.
          return [source.frontmatter?.originalLang === "pt" ? "pt" : "en"];
        },
      },
    },
  });
};
