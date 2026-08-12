// Page-view counter backed by Upstash Redis over its REST API.
// POST increments the total and returns it; GET reads without incrementing.
// The Upstash integration on Vercel injects the URL/token pair under either
// the KV_* or the UPSTASH_* names depending on how the store was added.

const REDIS_URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN =
  process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

const KEY = "pageviews:site";

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

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (!REDIS_URL || !REDIS_TOKEN) {
    return res.status(503).json({ error: "Counter storage is not configured" });
  }

  try {
    const views =
      req.method === "POST" ? await redis(`incr/${KEY}`) : await redis(`get/${KEY}`);
    return res.status(200).json({ views });
  } catch {
    return res.status(502).json({ error: "Counter unavailable" });
  }
}
