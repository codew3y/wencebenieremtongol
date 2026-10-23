// The shared poke tally behind the rail's "pokes this month" line.
//
// One counter in Upstash Redis for everybody, so the number a visitor sees is
// the number every other visitor sees. GET reads it, POST adds one. The same
// store and the same env vars the contact form's rate limiter already uses --
// KV_REST_API_* when the Vercel KV integration sets them, UPSTASH_* when the
// store is connected directly.
//
// Without a store configured the endpoint reports `configured: false` rather
// than failing, and the client falls back to counting locally. That keeps the
// button working on a deploy with no Redis behind it; it just is not shared.

// Found by shape rather than by one hard-coded name. Vercel's Upstash
// integration names these differently depending on how the store was
// connected -- KV_REST_API_URL, UPSTASH_REDIS_REST_URL, or whatever a custom
// environment-variable prefix produces -- and a store that is connected but
// named unexpectedly looks exactly like no store at all, which is a bad hour
// to spend. Anything ending in the right suffix is accepted, with the
// documented names preferred when several are present.
const findEnv = (suffixes, preferred) => {
  for (const name of preferred) if (process.env[name]) return process.env[name];
  for (const [name, value] of Object.entries(process.env)) {
    if (value && suffixes.some((suffix) => name.endsWith(suffix))) return value;
  }
  return undefined;
};

const REDIS_URL = findEnv(
  ["_REST_API_URL", "_REDIS_REST_URL", "_KV_REST_API_URL"],
  ["KV_REST_API_URL", "UPSTASH_REDIS_REST_URL"],
);
const REDIS_TOKEN = findEnv(
  ["_REST_API_TOKEN", "_REDIS_REST_TOKEN", "_KV_REST_API_TOKEN"],
  ["KV_REST_API_TOKEN", "UPSTASH_REDIS_REST_TOKEN"],
);

// Keyed by month, matching the label. A count from September is not this
// month's, so it starts again rather than quietly becoming an all-time total.
// 70 days of TTL leaves the previous month readable for a while and then lets
// it go, so the store does not grow a row per month forever.
const KEY_TTL_SECONDS = 70 * 24 * 60 * 60;

// A poke is one click, and somebody hammering the button is the feature, not
// abuse -- so the ceiling is set where a hand cannot reach it. 60 a minute was
// about one a second, which a determined visitor passes in seconds and then
// watches the number stop, which reads as broken.
//
// 1,200 a minute is twenty a second sustained for a full minute. A person with
// a mouse will not get there; a script will, and that is the only thing this
// is still here to catch, since every write costs a command against the store's
// quota.
const WINDOW_SECONDS = 60;
const MAX_PER_WINDOW = 1200;

const monthKey = () => `pokes:${new Date().toISOString().slice(0, 7)}`;

async function redis(command) {
  const response = await fetch(`${REDIS_URL}/${command}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Upstash responded ${response.status}`);
  }

  const { result } = await response.json();
  return Number(result) || 0;
}

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers["x-real-ip"] ?? "unknown";
}

async function overRateLimit(req) {
  const key = encodeURIComponent(`poke-rate:${clientIp(req)}`);
  try {
    const hits = await redis(`incr/${key}`);
    if (hits === 1) await redis(`expire/${key}/${WINDOW_SECONDS}`);
    return hits > MAX_PER_WINDOW;
  } catch {
    // A limiter having a bad day should not take the counter down.
    return false;
  }
}

export default async function handler(req, res) {
  // The count is public and changes constantly, so it is never cached: a CDN
  // copy would hand different visitors different numbers, which is the exact
  // thing this endpoint exists to stop.
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!REDIS_URL || !REDIS_TOKEN) {
    return res.status(200).json({ configured: false, count: null });
  }

  const key = encodeURIComponent(monthKey());

  try {
    if (req.method === "GET") {
      const count = await redis(`get/${key}`);
      return res.status(200).json({ configured: true, count });
    }

    if (await overRateLimit(req)) {
      // Still answer with the live total so the rail keeps showing the real
      // number rather than freezing on whatever it had.
      const count = await redis(`get/${key}`);
      return res.status(429).json({ configured: true, count, limited: true });
    }

    const count = await redis(`incr/${key}`);
    // Only the first write of the month needs the expiry; setting it on every
    // poke would push the window out and keep the key alive indefinitely.
    if (count === 1) await redis(`expire/${key}/${KEY_TTL_SECONDS}`);
    return res.status(200).json({ configured: true, count });
  } catch {
    // The store is unreachable. Say so rather than reporting a wrong number --
    // the client falls back to its own tally.
    return res.status(200).json({ configured: false, count: null });
  }
}
