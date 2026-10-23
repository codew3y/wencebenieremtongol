// The batching client, in its own process so it gets its own module-level
// state. The case that matters is a spam burst: presses have to be delivered
// in full, and the number on screen must never go backwards while they are in
// flight. It used to do both wrongly -- a fixed interval fired a second POST
// alongside the first, the replies came back out of order, and each one set the
// rail directly, so hammering the button pinned it around fifty while the
// counter behind it was already past two hundred.
import { test } from "node:test";
import assert from "node:assert/strict";

const nextTick = () => new Promise((resolve) => setImmediate(resolve));
/** Let every pending timer and promise settle. */
const settle = async (ms) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
  await nextTick();
};

/** A server holding one shared counter, answering after a chosen delay. */
const makeServer = ({ delays = [] } = {}) => {
  const server = { count: 0, requests: 0, sent: [] };
  let nth = 0;
  globalThis.fetch = async (url, options = {}) => {
    const method = options.method ?? "GET";
    if (method === "GET") {
      return { ok: true, status: 200, json: async () => ({ configured: true, count: server.count }) };
    }
    server.requests += 1;
    const by = Math.min(Math.max(Number(JSON.parse(options.body).by) || 1, 1), 50);
    server.sent.push(by);
    // The tally is taken at the moment the write lands, as Redis would.
    server.count += by;
    const snapshot = server.count;
    const wait = delays[nth++] ?? 0;
    if (wait) await new Promise((resolve) => setTimeout(resolve, wait));
    return { ok: true, status: 200, json: async () => ({ configured: true, count: snapshot }) };
  };
  return server;
};

test("a spam burst is delivered in full and never reads backwards", async () => {
  // Every reply is slower than the gap between presses, so a request is always
  // still outstanding when the next batch is ready -- which is the whole of the
  // bug: a fixed interval sent the next one anyway, and the replies came back
  // in whatever order they finished.
  // The first reply is held far longer than the ones behind it, so a later
  // request overtakes it and lands first. Equal delays would come back in the
  // order they were sent and hide the whole problem.
  const server = makeServer({ delays: [1500, ...Array(20).fill(80)] });
  const { pokeOnce } = await import("../src/lib/pokes.js?burst");

  // Exactly what the library reports, unsmoothed. The rail clamps these to
  // never decrease, but that clamp is a second line of defence: the figures
  // handed to it should already be sane, or a visitor who stops pressing is
  // left looking at whichever reply happened to land last.
  const reported = [];
  // Pressed over three seconds rather than all in one tick, because that is
  // what spamming a button actually looks like and it is the only way a press
  // lands while a request is in flight.
  for (let i = 0; i < 120; i += 1) {
    pokeOnce((total) => reported.push(total));
    await settle(25);
  }
  await settle(4000);

  assert.equal(server.count, 120, "every press reached the counter");
  assert.ok(reported.length > 0, "the rail was told something");
  assert.ok(
    reported.every((value, i) => i === 0 || value >= reported[i - 1]),
    `reported totals never decrease: ${reported.join(" -> ")}`,
  );
  assert.equal(
    reported[reported.length - 1],
    120,
    "the last word is the real total",
  );
});

test("only one request is ever in flight", async () => {
  const server = makeServer({ delays: [900, 900, 900, 900] });
  const { pokeOnce } = await import("../src/lib/pokes.js?serial");

  let live = 0;
  let worst = 0;
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (...args) => {
    const method = args[1]?.method ?? "GET";
    if (method !== "POST") return realFetch(...args);
    live += 1;
    worst = Math.max(worst, live);
    try {
      return await realFetch(...args);
    } finally {
      live -= 1;
    }
  };

  for (let i = 0; i < 140; i += 1) {
    pokeOnce(() => {});
    await settle(25);
  }
  await settle(5000);

  assert.equal(worst, 1, `at most one POST at a time, saw ${worst}`);
  assert.equal(server.count, 140, "no presses lost to the serialising");
});

test("a short burst waits for the pressing to stop, then sends once", async () => {
  const server = makeServer();
  const { pokeOnce } = await import("../src/lib/pokes.js?idle");

  for (let i = 0; i < 8; i += 1) pokeOnce(() => {});
  // Still mid-burst: nothing should have gone yet.
  await settle(100);
  assert.equal(server.requests, 0, "held while the visitor is still pressing");

  await settle(1200);
  assert.equal(server.requests, 1, "one request for the whole burst");
  assert.deepEqual(server.sent, [8]);
});
