// The CMS writes an uploaded file's name URL-encoded, so
// "Screenshot 2026-10-02 at 13.59.09.png" becomes images/Screenshot%202026….
// gatsby-remark-images looks the file up by that path as written and never
// finds it, leaving a broken <img>. Decode relative image URLs first.

const isRelative = (url) => !/^([a-z][a-z0-9+.-]*:|\/\/|\/)/i.test(url);

const decode = (url) => {
  try {
    return decodeURI(url);
  } catch {
    return url;
  }
};

const walk = (node) => {
  if (node.type === "image" && node.url && isRelative(node.url)) {
    node.url = decode(node.url);
  }
  (node.children || []).forEach(walk);
};

module.exports = ({ markdownAST }) => {
  walk(markdownAST);
  return markdownAST;
};

module.exports.isRelative = isRelative;
module.exports.decode = decode;
