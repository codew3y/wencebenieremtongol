// Contract tests for api/contact.js, run with Node's built-in test runner.
// Resend is stubbed, so these assert what the endpoint refuses and what it puts
// on the wire -- never that mail was delivered.
//
// Env has to be set before the import: the module reads process.env at load.
import { test } from "node:test";
import assert from "node:assert/strict";

process.env.RESEND_API_KEY = "re_test_key";
process.env.CONTACT_TO = "inbox@example.com";
// No Redis here on purpose, so the rate limiter cannot colour these results.
// ratelimit.test.js covers it in its own process.
delete process.env.KV_REST_API_URL;
delete process.env.KV_REST_API_TOKEN;
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.UPSTASH_REDIS_REST_TOKEN;

const { default: handler } = await import("../api/contact.js");

let lastRequest = null;
let resendStatus = 200;

globalThis.fetch = async (url, init) => {
  lastRequest = { url: String(url), init, body: JSON.parse(init.body) };
  return {
    ok: resendStatus < 400,
    status: resendStatus,
    text: async () => "stubbed error body",
  };
};

const call = async (method, body, headers = {}) => {
  lastRequest = null;
  const captured = { status: 0, payload: null, headers: {} };
  const res = {
    setHeader(key, value) {
      captured.headers[key] = value;
    },
    status(code) {
      captured.status = code;
      return this;
    },
    json(payload) {
      captured.payload = payload;
      return this;
    },
  };

  await handler({ method, body, headers }, res);
  return { ...captured, sent: lastRequest };
};

const valid = { name: "Jane Cruz", email: "jane@acme.com", message: "Hello" };

test("rejects anything but POST", async () => {
  const result = await call("GET", {});
  assert.equal(result.status, 405);
  assert.equal(result.headers.Allow, "POST");
});

test("requires name, email, and message", async () => {
  for (const missing of ["name", "email", "message"]) {
    const body = { ...valid, [missing]: "" };
    const result = await call("POST", body);
    assert.equal(result.status, 400, `${missing} should be required`);
    assert.equal(result.sent, null, "nothing should be sent");
  }
});

test("rejects a malformed email", async () => {
  const result = await call("POST", { ...valid, email: "not-an-email" });
  assert.equal(result.status, 400);
  assert.match(result.payload.error, /email/i);
});

test("rejects a message past the length limit", async () => {
  const result = await call("POST", { ...valid, message: "x".repeat(5001) });
  assert.equal(result.status, 400);
  assert.equal(result.sent, null);
});

test("answers the honeypot with 200 but sends nothing", async () => {
  // A bot that fills the hidden field must not learn it was filtered.
  const result = await call("POST", { ...valid, website: "http://spam.example" });
  assert.equal(result.status, 200);
  assert.equal(result.sent, null);
});

test("posts a valid message to Resend", async () => {
  const result = await call("POST", valid);
  assert.equal(result.status, 200);
  assert.equal(result.sent.url, "https://api.resend.com/emails");
  assert.equal(result.sent.init.headers.Authorization, "Bearer re_test_key");
  assert.equal(result.sent.body.to, "inbox@example.com");
});

test("sets reply_to to the visitor so replies reach them", async () => {
  // snake_case: the REST field, not the SDK's replyTo. Silently drops if wrong,
  // which makes replies go to the sender instead -- hence the explicit check.
  const result = await call("POST", valid);
  assert.equal(result.sent.body.reply_to, "jane@acme.com");
  assert.ok(!("replyTo" in result.sent.body));
});

test("trims surrounding whitespace off the fields", async () => {
  const result = await call("POST", { ...valid, name: "   Jane Cruz   " });
  assert.match(result.sent.body.text, /Jane Cruz <jane@acme\.com>/);
});

test("uses the subject when given and falls back when not", async () => {
  const withSubject = await call("POST", { ...valid, subject: "Role" });
  assert.equal(withSubject.sent.body.subject, "Portfolio — Role");

  const without = await call("POST", valid);
  assert.equal(without.sent.body.subject, "Portfolio message from Jane Cruz");
});

test("escapes markup from the visitor before it becomes an email", async () => {
  const result = await call("POST", {
    ...valid,
    message: "<script>alert(1)</script>",
  });
  assert.match(result.sent.body.html, /&lt;script&gt;/);
  assert.ok(!result.sent.body.html.includes("<script>"));
});

test("surfaces a Resend failure as 502 without leaking its response", async () => {
  resendStatus = 401;
  try {
    const result = await call("POST", valid);
    assert.equal(result.status, 502);
    assert.ok(!JSON.stringify(result.payload).includes("stubbed error body"));
  } finally {
    resendStatus = 200;
  }
});

test("returns 400 for a body that is not JSON", async () => {
  const result = await call("POST", "{not json");
  assert.equal(result.status, 400);
  assert.equal(result.sent, null);
});
