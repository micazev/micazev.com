const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  htmlForLang,
  availableLangs,
  noteLang,
} = require("./note-html.cjs");

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

test("availableLangs lists only blocks that actually have content", () => {
  const both = `<!--lang:en-->
<p>Hello</p>
<!--lang:pt-->
<p>Olá</p>`;
  assert.deepEqual(availableLangs(both), ["en", "pt"]);

  // The real shape of our notes: a pt marker with nothing after it.
  const enOnly = `<!--lang:en-->
<p>Hello</p>
<!--lang:pt-->`;
  assert.deepEqual(availableLangs(enOnly), ["en"]);

  const ptOnly = `<!--lang:pt-->
<p>Olá</p>
<!--lang:en-->`;
  assert.deepEqual(availableLangs(ptOnly), ["pt"]);

  assert.deepEqual(availableLangs("<p>Hello</p>"), []);
  assert.deepEqual(availableLangs(""), []);
});

test("noteLang keeps the reader's language when that body exists", () => {
  assert.equal(noteLang(["en", "pt"], "pt"), "pt");
  assert.equal(noteLang(["en", "pt"], "en"), "en");
});

test("noteLang falls back to the language the note is actually written in", () => {
  assert.equal(noteLang(["en"], "pt"), "en");
  assert.equal(noteLang(["pt"], "en"), "pt");
});

test("noteLang leaves an unmarked note on the reader's language", () => {
  assert.equal(noteLang([], "pt"), "pt");
  assert.equal(noteLang(undefined, "pt"), "pt");
});

test("title and body never disagree for an untranslated note", () => {
  const html = `<!--lang:en-->
<p>Hello</p>
<!--lang:pt-->`;
  const shown = noteLang(availableLangs(html), "pt");

  assert.equal(shown, "en");
  assert.equal(htmlForLang(html, shown), "<p>Hello</p>");
});
