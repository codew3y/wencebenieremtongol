// The shared poke counter, in its own process so it gets its own module-level
// env. The cases that matter are the two degradations: a deploy with no store
// configured, and a store that is unreachable. Both have to report
// `configured: false` rather than a wrong number, because the client treats any
// number it gets back as the shared truth and overwrites its own tally with it.
import { test } from "node:test";
import assert from "node:assert/strict";

process.env.KV_REST_API_URL = "https://redis.test";
process.env.KV_REST_API_TOKEN = "token";

const { default: handler } = await import("../api/pokes.js");

const store = new Map();
let redisDown = false;

globalThis.fetch = async (url) => {
  if (redisDown) throw new Error("upstash unreachable");

  const [command, key, arg] = String(url)
    .replace("https://redis.test/", "")
    .split("/");

  if (command === "incr") {
    const next = (store.get(key) ?? 0) + 1;
    store.set(key, next);
    return { ok: true, json: async () => ({ result: next }) };
  }
  if (command === "incrby") {
    const next = (store.get(key) ?? 0) + Number(arg);
    store.set(key, next);
    return { ok: true, json: async () => ({ result: next }) };
  }
  if (command === "get") {
    return { ok: true, json: async () => ({ result: store.get(key) ?? 0 }) };
  }
  if (command === "expire") {
    return { ok: true, json: async () => ({ result: Number(arg) > 0 ? 1 : 0 }) };
  }
  return { ok: true, json: async () => ({ result: 0 }) };
};

const call = async (method, ip = "198.51.100.7", body = undefined) => {
  const captured = { status: 0, body: null };
  const res = {
    setHeader() {},
    status(code) {
      captured.status = code;
      return this;
    },
    json(body) {
      captured.body = body;
      return this;
    },
  };
  await handler({ method, headers: { "x-forwarded-for": ip }, body }, res);
  return captured;
};

test("GET reports the current count", async () => {
  const result = await call("GET");
  assert.equal(result.status, 200);
  assert.deepEqual(result.body, { configured: true, count: 0 });
});

test("POST increments, and every caller sees the same number", async () => {
  const first = await call("POST", "203.0.113.1");
  assert.equal(first.body.count, 1);

  // A different visitor entirely -- the count is shared, not per client.
  const second = await call("POST", "203.0.113.2");
  assert.equal(second.body.count, 2);

  const read = await call("GET", "203.0.113.9");
  assert.equal(read.body.count, 2);
});

test("a flood from one address is capped without losing the count", async () => {
  // The ceiling is 1,200 a minute: high enough that a visitor hammering the
  // button is always counted, low enough that a script is not. The test has to
  // actually clear it, so it sends 1,201.
  const ip = "203.0.113.50";
  let last = null;
  for (let i = 0; i < 1201; i += 1) last = await call("POST", ip);

  assert.equal(last.status, 429);
  // Still reports the real tally rather than an error or a zero, and says why
  // so the client can tell "that one did not count" from "the counter broke".
  assert.equal(last.body.configured, true);
  assert.equal(last.body.limited, true);
  assert.equal(typeof last.body.count, "number");
});

test("an unreachable store reports unconfigured rather than a wrong number", async () => {
  redisDown = true;
  const result = await call("GET");
  redisDown = false;

  assert.equal(result.status, 200);
  assert.deepEqual(result.body, { configured: false, count: null });
});

test("anything but GET or POST is refused", async () => {
  const result = await call("DELETE");
  assert.equal(result.status, 405);
});

test("a fast human burst is never refused", async () => {
  // Thirty clicks in a few seconds is a plausible spam session by hand, and it
  // was the exact case that used to stop the count.
  const ip = "203.0.113.77";
  for (let i = 0; i < 30; i += 1) {
    const r = await call("POST", ip);
    assert.equal(r.status, 200, `click ${i + 1} was refused`);
    assert.equal(r.body.limited, undefined);
  }
});

test("a burst of presses can be sent as one increment", async () => {
  // The client batches presses so spamming the button is not a request per
  // press. Twelve clicks must land as twelve, in one call.
  const before = (await call("GET", "198.51.100.1")).body.count;
  const r = await call("POST", "198.51.100.1", { by: 12 });
  assert.equal(r.status, 200);
  assert.equal(r.body.count, before + 12);
});

test("a batch is capped, and a missing or junk count means one", async () => {
  const start = (await call("GET", "198.51.100.2")).body.count;
  // Over the cap is clamped rather than trusted.
  const big = await call("POST", "198.51.100.2", { by: 5000 });
  assert.equal(big.body.count, start + 50);
  // No body at all is a single press, which is what a plain POST means.
  const bare = await call("POST", "198.51.100.2");
  assert.equal(bare.body.count, start + 51);
  // So is nonsense.
  const junk = await call("POST", "198.51.100.2", { by: "banana" });
  assert.equal(junk.body.count, start + 52);
  // And so is a negative, which must never walk the counter backwards.
  const neg = await call("POST", "198.51.100.2", { by: -40 });
  assert.equal(neg.body.count, start + 53);
});

test("a text body is accepted, as sendBeacon delivers it", async () => {
  const start = (await call("GET", "198.51.100.3")).body.count;
  const r = await call("POST", "198.51.100.3", JSON.stringify({ by: 4 }));
  assert.equal(r.body.count, start + 4);
});
