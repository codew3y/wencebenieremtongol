// Contact-form endpoint. Validates the message, drops bot submissions, rate
// limits by IP in the same Upstash store the view counter uses, then hands the
// mail to Resend's REST API — one fetch, no SDK, same shape as api/views.js.

const REDIS_URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN =
  process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

const RESEND_KEY = process.env.RESEND_API_KEY;
// Resend only sends from an address you control. onboarding@resend.dev needs no
// domain of your own; swap CONTACT_FROM once a real domain is verified.
const FROM = process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>";
const TO = process.env.CONTACT_TO;

const WINDOW_SECONDS = 3600;
const MAX_PER_WINDOW = 5;
const MAX_LENGTH = { name: 100, email: 200, subject: 150, message: 5000 };
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

// Never let the limiter itself take the form down: no store, or a store that is
// having a bad day, means the message goes through.
async function overRateLimit(req) {
  if (!REDIS_URL || !REDIS_TOKEN) return false;

  const key = encodeURIComponent(`contact:${clientIp(req)}`);
  try {
    const hits = await redis(`incr/${key}`);
    if (hits === 1) await redis(`expire/${key}/${WINDOW_SECONDS}`);
    return hits > MAX_PER_WINDOW;
  } catch {
    return false;
  }
}

function readFields(body) {
  const value = (key) => String(body[key] ?? "").trim();
  const fields = {
    name: value("name"),
    email: value("email"),
    subject: value("subject"),
    message: value("message"),
  };

  if (!fields.name || !fields.email || !fields.message) {
    return { error: "Name, email, and message are all required." };
  }
  if (!EMAIL_SHAPE.test(fields.email)) {
    return { error: "That email address doesn't look right." };
  }
  const tooLong = Object.keys(MAX_LENGTH).find(
    (key) => fields[key].length > MAX_LENGTH[key]
  );
  if (tooLong) {
    return { error: `Your ${tooLong} is longer than ${MAX_LENGTH[tooLong]} characters.` };
  }

  return { fields };
}

// The visitor's text lands in my inbox as markup, so it gets escaped first.
const escapeHtml = (text) =>
  text.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char]
  );

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!RESEND_KEY || !TO) {
    return res.status(503).json({ error: "The contact form is not configured yet." });
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body ?? {});
  } catch {
    return res.status(400).json({ error: "Could not read that submission." });
  }

  // Honeypot: a field no human sees, so anything in it is a bot. Answering 200
  // keeps it from learning that the submission was thrown away.
  if (String(body.website ?? "").length > 0) {
    return res.status(200).json({ ok: true });
  }

  const { error, fields } = readFields(body);
  if (error) return res.status(400).json({ error });

  if (await overRateLimit(req)) {
    return res
      .status(429)
      .json({ error: "That's a few messages in a row — try again in an hour." });
  }

  const subject = fields.subject
    ? `Portfolio — ${fields.subject}`
    : `Portfolio message from ${fields.name}`;
  const lines = [
    `From: ${fields.name} <${fields.email}>`,
    fields.subject ? `Subject: ${fields.subject}` : null,
    "",
    fields.message,
  ].filter((line) => line !== null);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: TO,
        // Snake case: this is the REST field name, not the SDK's replyTo.
        // Hitting reply in the inbox then answers the visitor directly.
        reply_to: fields.email,
        subject,
        text: lines.join("\n"),
        html: `<p><strong>${escapeHtml(fields.name)}</strong> &lt;${escapeHtml(
          fields.email
        )}&gt;</p>${
          fields.subject ? `<p><em>${escapeHtml(fields.subject)}</em></p>` : ""
        }<p style="white-space:pre-wrap">${escapeHtml(fields.message)}</p>`,
      }),
    });

    if (!response.ok) {
      console.error("Resend responded", response.status, await response.text());
      return res.status(502).json({ error: "The message could not be sent." });
    }
  } catch (cause) {
    console.error("Resend request failed", cause);
    return res.status(502).json({ error: "The message could not be sent." });
  }

  return res.status(200).json({ ok: true });
}
