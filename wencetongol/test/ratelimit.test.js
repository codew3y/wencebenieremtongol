// The rate limiter, in its own process so it gets its own module-level env.
// The case that matters most is the last one: a limiter that fails closed would
// take the contact form down every time Upstash has a bad minute.
import { test } from "node:test";
import assert from "node:assert/strict";

process.env.RESEND_API_KEY = "re_test_key";
process.env.CONTACT_TO = "inbox@example.com";
process.env.KV_REST_API_URL = "https://redis.test";
process.env.KV_REST_API_TOKEN = "token";

const { default: handler } = await import("../api/contact.js");

const counters = new Map();
let redisDown = false;
let sends = 0;

globalThis.fetch = async (url) => {
  const target = String(url);

  if (target.startsWith("https://api.resend.com")) {
    sends += 1;
    return { ok: true, status: 200, text: async () => "" };
  }

  if (redisDown) throw new Error("upstash unreachable");

  const [command, key] = target.replace("https://redis.test/", "").split("/");
  if (command === "incr") {
    const next = (counters.get(key) ?? 0) + 1;
    counters.set(key, next);
    return { ok: true, json: async () => ({ result: next }) };
  }
  return { ok: true, json: async () => ({ result: 1 }) };
};

const send = async (ip) => {
  const captured = { status: 0 };
  const res = {
    setHeader() {},
    status(code) {
      captured.status = code;
      return this;
    },
    json() {
      return this;
    },
  };

  await handler(
    {
      method: "POST",
      body: { name: "Jane", email: "jane@acme.com", message: "Hello" },
      // Vercel puts the client first and the proxy hops after it.
      headers: { "x-forwarded-for": `${ip}, 10.0.0.1` },
    },
    res
  );
  return captured.status;
};

test("allows five messages an hour from one address, then holds", async () => {
  const codes = [];
  for (let attempt = 0; attempt < 7; attempt += 1) {
    codes.push(await send("203.0.113.7"));
  }

  assert.deepEqual(codes, [200, 200, 200, 200, 200, 429, 429]);
  assert.equal(sends, 5, "only the accepted messages should be sent");
});

test("counts against the client address, not the proxy hop", async () => {
  assert.ok(counters.has(encodeURIComponent("contact:203.0.113.7")));
  assert.ok(!counters.has(encodeURIComponent("contact:10.0.0.1")));
});

test("limits each address separately", async () => {
  assert.equal(await send("198.51.100.9"), 200);
});

test("fails open when the store is unreachable", async () => {
  redisDown = true;
  try {
    // This address is already past its limit, so a closed failure would 429.
    assert.equal(await send("203.0.113.7"), 200);
  } finally {
    redisDown = false;
  }
});
