/**
 * @type {import('gatsby').GatsbyConfig}
 *
 * Notes Markdown comes from the private git submodule at ./content
 * (github.com/micazev/micazev-content). Run:
 *   git submodule update --init --recursive
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
    "gatsby-transformer-remark",
  ],
};
