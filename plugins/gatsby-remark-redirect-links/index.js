// Points markdown links at a site's temporary address while its domain is not
// live (src/lib/link-redirects.cjs), so notes can keep the real domain.

const { redirectUrl } = require("../../src/lib/link-redirects.cjs");

const walk = (node) => {
  if ((node.type === "link" || node.type === "definition") && node.url) {
    node.url = redirectUrl(node.url);
  }
  (node.children || []).forEach(walk);
};

module.exports = ({ markdownAST }) => {
  walk(markdownAST);
  return markdownAST;
};
