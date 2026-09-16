const { test } = require("node:test");
const assert = require("node:assert/strict");
const { htmlForLang } = require("./note-html.cjs");

test("returns the matching lang block when both are present", () => {
  const html = `<!--lang:en-->
<p>Hello</p>
<!--lang:pt-->
<p>Olá</p>`;

  assert.equal(htmlForLang(html, "en"), "<p>Hello</p>");
  assert.equal(htmlForLang(html, "pt"), "<p>Olá</p>");
});

test("returns full html when markers are missing", () => {
  const html = "<p>Hello</p>";
  assert.equal(htmlForLang(html, "pt"), "<p>Hello</p>");
});

test("falls back to the other block if the requested lang is missing", () => {
  const html = `<!--lang:en-->
<p>Hello</p>`;

  assert.equal(htmlForLang(html, "pt"), "<p>Hello</p>");
});
