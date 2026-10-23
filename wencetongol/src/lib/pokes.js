/**
 * The shared poke tally behind the rail's "pokes this month" line.
 *
 * One counter in Redis for everybody. There is deliberately no local copy of
 * the number any more: keeping one meant the rail rendered this browser's old
 * tally first and the real figure a moment later, so the same page showed 0 in
 * a private window, 71 in a normal one and 57 once the request landed. A count
 * that is shared cannot also be remembered per device.
 *
 * Presses are batched. Clicking is meant to be spammable, and a round trip per
 * press is both visibly laggy and a command per press against the store's
 * quota, so presses accumulate for a moment and go up as one increment.
 */

const FLUSH_MS = 350;
/** The API caps a single increment at 50; stay inside it. */
const MAX_PER_FLUSH = 50;

let pending = 0;
let timer = null;
let inFlight = null;

const call = async (method, body) => {
  try {
    const response = await fetch("/api/pokes", {
      method,
      cache: "no-store",
      headers: body
        ? { "Content-Type": "application/json", Accept: "application/json" }
        : { Accept: "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    // 429 still carries the live total, so it is read rather than discarded.
    if (!response.ok && response.status !== 429) return null;
    const data = await response.json();
    return data.configured && typeof data.count === "number" ? data.count : null;
  } catch {
    // Offline, blocked, or no store behind the endpoint.
    return null;
  }
};

/** The shared total, or null when there is nothing behind the endpoint. */
export const fetchPokes = () => call("GET");

/**
 * Register one press. `onTotal` is called with the authoritative total once a
 * flush lands; the caller is expected to have moved its own number already.
 */
export const pokeOnce = (onTotal) => {
  pending += 1;
  if (timer !== null) return;

  timer = setTimeout(async function flush() {
    timer = null;
    if (pending === 0) return;
    const sending = Math.min(pending, MAX_PER_FLUSH);
    pending -= sending;

    inFlight = call("POST", { by: sending });
    const total = await inFlight;
    inFlight = null;
    // Anything pressed while that was in flight is not in the total yet, so it
    // is added back on rather than being lost to a stale figure.
    if (total !== null) onTotal(total + pending);

    // More arrived during the round trip: send them too.
    if (pending > 0 && timer === null) timer = setTimeout(flush, FLUSH_MS);
  }, FLUSH_MS);
};

/** Send anything still pending when the page goes away. */
export const flushPokes = () => {
  if (pending === 0) return;
  const body = JSON.stringify({ by: Math.min(pending, MAX_PER_FLUSH) });
  pending = 0;
  try {
    // keepalive survives the page being closed where a normal fetch would not.
    navigator.sendBeacon?.("/api/pokes", new Blob([body], { type: "application/json" })) ||
      fetch("/api/pokes", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } });
  } catch {
    // A poke lost on the way out is not worth reporting.
  }
};
