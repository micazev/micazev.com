const { test } = require("node:test");
const assert = require("node:assert/strict");
const { redirectUrl } = require("./link-redirects.cjs");

test("redirectUrl sends leilaonomapa.com, with or without www, to Railway", () => {
  const to = "https://leilaonomapa-production.up.railway.app/";
  assert.equal(redirectUrl("https://leilaonomapa.com/"), to);
  assert.equal(redirectUrl("http://leilaonomapa.com"), to);
  assert.equal(redirectUrl("https://www.leilaonomapa.com/"), to);
  assert.equal(
    redirectUrl("https://leilaonomapa.com/mapa?uf=SP#x"),
    "https://leilaonomapa-production.up.railway.app/mapa?uf=SP#x",
  );
});

test("redirectUrl leaves other links alone", () => {
  for (const url of [
    "https://www.linkedin.com/company/leilao-no-mapa/",
    "https://railway.com/",
    "/notes/x",
    "#section",
    "mailto:ola@leilaonomapa.com",
  ]) {
    assert.equal(redirectUrl(url), url);
  }
});
