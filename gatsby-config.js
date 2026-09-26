/**
 * @type {import('gatsby').GatsbyConfig}
 *
 * Notes, pages and site copy come from the private git submodule at
 * ./content (github.com/micazev/micazev-content), edited through Sveltia CMS
 * at /admin. Run:
 *   git submodule update --init --remote
 * before develop/build. CI needs read access to that private repo.
 */
module.exports = {
  siteMetadata: {
    title: "Michelle Azevedo",
    description:
      "Michelle Azevedo — product engineer based in Ho Chi Minh City, Vietnam.",
    siteUrl: "https://micazev.com",
  },
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "notes",
        path: `${__dirname}/content/notes`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: `${__dirname}/content/pages`,
      },
    },
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            // Images uploaded in the CMS land next to the entry
            // (notes/images/x.jpg) and are written as images/x.jpg.
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 1280,
              linkImagesToOriginal: false,
              backgroundColor: "transparent",
              withWebp: true,
            },
          },
        ],
      },
    },
  ],
};
