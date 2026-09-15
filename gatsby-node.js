const path = require("path");

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
