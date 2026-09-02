# Handover — contact endpoint

Context for picking this up on another device. The code is committed and pushed;
what remains is infrastructure setup that can only be done in the Vercel
dashboard.

The footer view counter this document used to describe has been removed — the
endpoint, the component, and the Redis key are all gone.

## Setup on the new device

```bash
git clone https://github.com/codew3y/wencebenieremtongol.git
cd wencebenieremtongol/wencetongol
npm install
npm run dev
```

The site runs, but **the contact form will not send under `npm run dev`** — Vite
serves no serverless functions, so `/api/contact` 404s. This is expected, not a
bug. To exercise the endpoint locally:

```bash
npm i -g vercel
vercel link          # link to the existing project
vercel env pull      # pulls the credentials into .env.local
vercel dev           # serves the site AND /api/contact
```

## Connect Resend so the contact form can send

`api/contact.js` posts to Resend's REST API. Until its variables exist the
endpoint returns **503** and the form reports that it isn't configured yet.

1. Sign up at [resend.com](https://resend.com) and create an **API key**.
2. In Vercel → Settings → **Environment Variables**, add:
   - `RESEND_API_KEY` — the key from step 1
   - `CONTACT_TO` — the inbox that receives messages (e.g. `tongolwey@gmail.com`)
   - `CONTACT_FROM` — *optional*. Defaults to `Portfolio <onboarding@resend.dev>`,
     which needs no domain of your own. Set this only once a domain is verified
     in Resend.
3. **Redeploy** — env vars only reach a deployment built after they exist.
4. Send yourself a test message and confirm it arrives; hitting reply should
   address the visitor, not you, because the request sets `reply_to`.

On the free plan Resend allows 3,000 emails a month, 100 a day. Note that
without a verified domain it may only deliver to your own account address —
fine for a contact form, but that's the thing to check first if a test message
never shows up.

## Spam handling

It lives in the function, not in a third-party service:

- a honeypot field named `website`, hidden from people — anything in it gets a
  200 and goes in the bin, so bots learn nothing
- five submissions per IP per hour, counted in Upstash Redis under `contact:<ip>`

If Upstash is missing or erroring the limiter fails **open** — a storage outage
must not take the contact form down with it. That also means the limit does
nothing until the store is connected: **Vercel → Storage → Create Database →
Upstash Redis**, connected to this project, then redeploy. `api/contact.js`
reads either `KV_REST_API_URL` / `KV_REST_API_TOKEN` or
`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`, whichever the integration
provides. Until then the honeypot is the only spam control in force.

## Check this before debugging anything else

`api/` sits **inside** `wencetongol/`, not at the repo root. That is correct only
if the Vercel project's **Root Directory** is set to `wencetongol` (Settings →
General → Root Directory). Given the repo's only top-level folder is
`wencetongol`, it almost certainly is — but confirm it before chasing a 404 on
`/api/contact`. If the root directory is the repo root instead, move the `api/`
folder up one level.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| Form says it isn't configured | `RESEND_API_KEY` or `CONTACT_TO` missing, or not redeployed since adding them. The 503 body names which one is absent. |
| `/api/contact` returns 404 | Vercel Root Directory isn't `wencetongol` (see above). |
| `/api/contact` returns 502 | Resend rejected the call — check the key is still valid in the Vercel env vars. |
| Form does nothing under `npm run dev` | Expected. Use `vercel dev`. |
| Message sends but never arrives | Check spam, then whether Resend's free tier will deliver to that address without a verified domain. |
| Rate limit never triggers | Upstash isn't connected; the limiter fails open by design. |

## Tests

`npm test` runs 17 tests over `api/contact.js` with Node's built-in runner
(`node --test`) — validation, the honeypot, HTML escaping, the `reply_to` field
name, and the limiter's fail-open behaviour, with Resend and Upstash stubbed.
CI runs lint, test, and build on every push.

---

Drafted by Claude (Claude Code) on 2026-08-12 for Wence Tongol, rewritten
2026-08-25 when the view counter was removed. Review before relying on it.
