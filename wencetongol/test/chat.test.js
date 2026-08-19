// Contract tests for api/chat.js. Gemini is stubbed, so these assert what the
// endpoint refuses, what it puts on the wire, and what it says when the upstream
// is unhappy -- never that an answer was any good.
//
// Env has to be set before the import: the module reads process.env at load.
import { test } from "node:test";
import assert from "node:assert/strict";

process.env.GEMINI_API_KEY = "test_key";
// No Redis here on purpose, so the limiter cannot colour these results.
delete process.env.KV_REST_API_URL;
delete process.env.KV_REST_API_TOKEN;
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.UPSTASH_REDIS_REST_TOKEN;

const { default: handler, readTurns } = await import("../api/chat.js");

let lastRequest = null;
let geminiStatus = 200;
let geminiPayload = {
  candidates: [{ content: { parts: [{ text: "He automates Zoho CRM." }] } }],
};

globalThis.fetch = async (url, init) => {
  lastRequest = { url: String(url), body: JSON.parse(init.body) };
  return {
    ok: geminiStatus < 400,
    status: geminiStatus,
    json: async () => geminiPayload,
    text: async () => "stubbed error body",
  };
};

const call = async (body, method = "POST") => {
  lastRequest = null;
  const captured = { status: 0, payload: null };
  const res = {
    setHeader() {},
    status(code) {
      captured.status = code;
      return this;
    },
    json(payload) {
      captured.payload = payload;
      return this;
    },
  };
  await handler({ method, body, headers: {} }, res);
  return captured;
};

const ask = (text) => ({ messages: [{ role: "user", content: text }] });

test("answers a question and passes the thread upstream", async () => {
  geminiStatus = 200;
  const result = await call(ask("What does he do at Manentia?"));

  assert.equal(result.status, 200);
  assert.equal(result.payload.answer, "He automates Zoho CRM.");
  assert.equal(lastRequest.body.contents.length, 1);
  assert.equal(lastRequest.body.contents[0].role, "user");
});

test("grounds the model in the corpus and caps its output", async () => {
  await call(ask("What are his skills?"));

  const system = lastRequest.body.systemInstruction.parts[0].text;
  assert.match(system, /Answer only from the brief/);
  assert.match(system, /Pampanga State University/, "corpus is in the prompt");
  assert.equal(lastRequest.body.generationConfig.maxOutputTokens, 700);
});

test("keeps the key out of the body, on the query string only", async () => {
  await call(ask("Hello"));
  assert.match(lastRequest.url, /key=test_key/);
  assert.doesNotMatch(JSON.stringify(lastRequest.body), /test_key/);
});

test("maps assistant turns to the role Gemini expects", () => {
  const { turns } = readTurns({
    messages: [
      { role: "user", content: "Hi" },
      { role: "assistant", content: "Hello" },
      { role: "user", content: "More?" },
    ],
  });
  assert.deepEqual(
    turns.map((turn) => turn.role),
    ["user", "model", "user"],
  );
});

test("refuses an empty question, an over-long one, and a long thread", () => {
  assert.match(readTurns({ messages: [] }).error, /Ask a question/);
  assert.match(readTurns({}).error, /Ask a question/);
  assert.match(
    readTurns({ messages: [{ role: "user", content: "x".repeat(501) }] }).error,
    /under 500 characters/,
  );
  const long = Array.from({ length: 13 }, () => ({ role: "user", content: "hi" }));
  assert.match(readTurns({ messages: long }).error, /long/);
});

test("refuses anything but POST", async () => {
  const result = await call(ask("Hi"), "GET");
  assert.equal(result.status, 405);
});

test("names the free tier's own quota separately from a server fault", async () => {
  geminiStatus = 429;
  const limited = await call(ask("Hi"));
  assert.equal(limited.status, 429);
  assert.equal(limited.payload.reason, "quota");

  geminiStatus = 500;
  const broken = await call(ask("Hi"));
  assert.equal(broken.status, 502);
  assert.equal(broken.payload.reason, "upstream");
});

test("reports an empty candidate rather than returning a blank answer", async () => {
  geminiStatus = 200;
  geminiPayload = { candidates: [{ finishReason: "SAFETY", content: {} }] };
  const result = await call(ask("Hi"));

  assert.equal(result.status, 502);
  assert.equal(result.payload.reason, "empty");
  assert.equal(result.payload.answer, undefined);
});
