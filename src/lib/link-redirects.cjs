// Sites whose own domain is not live yet. A link to one of these hosts, in a
// note, page or project, is sent to where the site runs for now, keeping the
// path. Drop the entry once the domain points at the site.
const REDIRECTS = {
  "leilaonomapa.com": "https://leilaonomapa-production.up.railway.app",
};

function redirectUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }
  if (!/^https?:$/.test(parsed.protocol)) return url;
  const target = REDIRECTS[parsed.hostname.replace(/^www\./, "")];
  if (!target) return url;
  return target + parsed.pathname + parsed.search + parsed.hash;
}

module.exports = { redirectUrl };
