// Drift guard. The assistant answers only from api/_corpus.js, which is a hand
// written copy of what the sections say -- so the failure mode is silent: a
// project ships, the corpus does not follow, and the bot tells a recruiter the
// work does not exist. These read the components and assert the corpus kept up.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const { CORPUS } = await import("../api/_corpus.js");

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("every project on the site is in the corpus", () => {
  const source = read("../src/components/Projects.jsx");
  const names = [...source.matchAll(/^\s{4}name: "([^"]+)"/gm)].map((m) => m[1]);

  assert.ok(names.length >= 6, `expected the project list, found ${names.length}`);
  for (const name of names) {
    assert.ok(CORPUS.includes(name), `"${name}" is missing from api/_corpus.js`);
  }
});

test("every role on the timeline is in the corpus", () => {
  const source = read("../src/components/Experience.jsx");
  const roles = [...source.matchAll(/title: "([^"]+)"/g)].map((m) => m[1]);

  assert.ok(roles.length >= 2, `expected the roles, found ${roles.length}`);
  for (const role of roles) {
    // The corpus writes the intern role in its short form, so match the stem.
    const stem = role.replace(/ \(On-the-Job Training\)/, "");
    assert.ok(CORPUS.includes(stem), `"${stem}" is missing from api/_corpus.js`);
  }
});

test("the corpus carries the contact route and no credentials", () => {
  assert.match(CORPUS, /tongolwey@gmail\.com/);

  // Credential shapes, not the word "secret" -- the projects legitimately talk
  // about Key Vault secret management and zero long-lived secrets.
  const CREDENTIAL_SHAPES = [
    /AIza[0-9A-Za-z_-]{10,}/, // Google API key
    /\bsk-[A-Za-z0-9]{10,}/, // OpenAI-style
    /\bre_[A-Za-z0-9]{10,}/, // Resend
    /Bearer\s+[A-Za-z0-9._-]{12,}/i,
  ];
  for (const shape of CREDENTIAL_SHAPES) {
    assert.doesNotMatch(CORPUS, shape, `corpus looks like it contains ${shape}`);
  }
});
