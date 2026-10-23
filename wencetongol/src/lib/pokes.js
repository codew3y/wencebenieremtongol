/**
 * The shared poke tally behind the rail's "pokes this month" line.
 *
 * One counter in Redis for everybody. There is deliberately no local copy of
 * the number: keeping one meant the rail rendered this browser's old tally
 * first and the real figure a moment later, so the same page showed 0 in a
 * private window and 71 in a normal one. A count that is shared cannot also be
 * remembered per device.
 *
 * Presses are batched, because clicking is meant to be spammable and a round
 * trip per press is both laggy and a command per press against the store's
 * quota.
 *
 * The batching is a debounce -- the timer restarts on every press -- and not
 * the fixed interval it used to be. An interval kept firing *during* a burst,
 * so a second POST went out while the first was still in flight. Both answer
 * with the tally as it stood when they ran, both responses set the number
 * directly, and they do not come back in the order they were sent: a slower
 * earlier reply would land last and move the rail *backwards*. Spamming the
 * button therefore pinned the rail around fifty while the counter behind it
 * was already past two hundred.
 *
 * So: one request at a time, a flush only once the pressing stops, and an
 * immediate flush on reaching the cap so a long burst still reports as it
 * goes rather than all at the end.
 */

/** How long a pause in pressing ends a burst. */
const IDLE_MS = 700;
/** The API caps a single increment at 50. Reaching it sends at once. */
const MAX_PER_FLUSH = 50;

let pending = 0;
let timer = null;
let inFlight = false;
let report = null;

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

const clearTimer = () => {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
};

const flush = async () => {
  clearTimer();
  // Never a second request alongside the first. The one in flight reschedules
  // whatever has piled up behind it when it lands.
  if (inFlight || pending === 0) return;

  const sending = Math.min(pending, MAX_PER_FLUSH);
  pending -= sending;
  inFlight = true;
  const total = await call("POST", { by: sending });
  inFlight = false;

  // `pending` is read after the round trip on purpose: presses made while it
  // was in flight are not in the tally the server just reported, so they are
  // added back on rather than being dropped.
  if (total !== null && report) report(total + pending);

  if (pending > 0) schedule();
};

const schedule = () => {
  clearTimer();
  timer = setTimeout(flush, IDLE_MS);
};

/**
 * Register one press. `onTotal` is called with the authoritative total once a
 * flush lands; the caller is expected to have moved its own number already.
 */
export const pokeOnce = (onTotal) => {
  report = onTotal;
  pending += 1;
  // A burst long enough to reach the cap reports as it goes; anything shorter
  // waits for the pressing to stop.
  if (pending >= MAX_PER_FLUSH && !inFlight) flush();
  else schedule();
};

/** Send anything still pending when the page goes away. */
export const flushPokes = () => {
  clearTimer();
  if (pending === 0) return;
  const body = JSON.stringify({ by: Math.min(pending, MAX_PER_FLUSH) });
  pending = 0;
  try {
    // keepalive survives the page being closed where a normal fetch would not.
    navigator.sendBeacon?.(
      "/api/pokes",
      new Blob([body], { type: "application/json" }),
    ) ||
      fetch("/api/pokes", {
        method: "POST",
        body,
        keepalive: true,
        headers: { "Content-Type": "application/json" },
      });
  } catch {
    // A poke lost on the way out is not worth reporting.
  }
};
