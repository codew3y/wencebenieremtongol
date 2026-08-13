# Handover — footer view counter

Context for picking this up on another device. The code is committed and pushed;
what remains is one piece of infrastructure setup that can only be done in the
Vercel dashboard.

## Where things stand

The footer now reads:

```
© 2026 Wence Benierem Tongol · 1,247 views          Built with React, Tailwind CSS & Vite
```

The counting logic is written, linted, and builds clean. **It is not live yet** —
there is no database behind it, so the endpoint returns 503 and the footer
currently renders just the copyright line. Connecting the store (below) is the
only thing standing between here and a working counter.

## How it works

1. Every page load, `ViewCounter.jsx` fires `POST /api/views`.
2. `api/views.js` runs as a Vercel serverless function. It sends `INCR` to a
   single Redis key (`pageviews:site`) on Upstash over the REST API, and returns
   the new total as `{ "views": 1247 }`.
3. The component renders that number. On **any** failure it renders nothing —
   no error, no zero — so a broken counter degrades to the plain copyright line
   rather than showing a number that isn't real.

It counts **total page views**: refreshes and repeat visits each add one. That
was the deliberate choice over unique-per-browser.

### Files

| File | What it is |
| --- | --- |
| `wencetongol/api/views.js` | Serverless function. `POST` increments and returns; `GET` reads without incrementing. |
| `wencetongol/src/components/ViewCounter.jsx` | Footer text. One fetch per load, silent on failure. |
| `wencetongol/src/components/Footer.jsx` | Wraps copyright + counter in a flex group so the `·` separator sits between them. |
| `wencetongol/eslint.config.js` | Added a block declaring `api/**` as Node, so `process` isn't flagged `no-undef`. |
| `wencetongol/README.md` | "View counter" section + structure tree. |

## Setup on the new device

```bash
git clone https://github.com/codew3y/wencebenieremtongol.git
cd wencebenieremtongol/wencetongol
npm install
npm run dev
```

The site will run, but **the counter will not appear in `npm run dev`** — Vite
serves no serverless functions, so `/api/views` 404s and the component hides
itself. This is expected, not a bug. To exercise the endpoint locally:

```bash
npm i -g vercel
vercel link          # link to the existing project
vercel env pull      # pulls the Upstash credentials into .env.local
vercel dev           # serves the site AND /api/views
```

## The remaining step: connect Upstash Redis

This is the only outstanding work, and it must be done in the Vercel dashboard.

1. Open the project on [vercel.com](https://vercel.com) → **Storage** tab.
2. **Create Database → Upstash Redis** (free tier is plenty — this is one
   integer). Pick a region near your visitors.
3. Connect it to the `wencetongol` project. Vercel injects the
   credentials as environment variables automatically; you do not need to copy
   anything by hand.
4. **Redeploy** — env vars only reach a deployment built after they exist. A
   deploy from the dashboard is enough; no code change needed.
5. Load the live site, refresh once, and confirm the number climbs.

`api/views.js` accepts either credential naming scheme, since the integration
uses different names depending on how the store was created:

- `KV_REST_API_URL` + `KV_REST_API_TOKEN`, or
- `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`

If neither pair is present the function returns **503** and the footer stays
bare — that's the signal that step 3 or 4 hasn't taken effect.

## Check this before debugging anything else

`api/` sits **inside** `wencetongol/`, not at the repo root. That is correct only
if the Vercel project's **Root Directory** is set to `wencetongol` (Settings →
General → Root Directory). Given the repo's only top-level folder is
`wencetongol`, it almost certainly is — but confirm it before chasing a 404 on
`/api/views`. If the root directory is the repo root instead, move the `api/`
folder up one level.

## If you want a non-zero starting number

The count starts at 0, not at the site's existing traffic. To seed it, run this
once in the Upstash console (Data Browser → CLI):

```
SET pageviews:site 500
```

Verify: `GET pageviews:site`. Leaving it at 0 is the honest option.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| No number in the footer, live site | Upstash not connected, or not redeployed since connecting. Check `/api/views` directly in the browser — 503 means no credentials. |
| `/api/views` returns 404 | Vercel Root Directory isn't `wencetongol` (see above). |
| `/api/views` returns 502 | Credentials exist but Upstash rejected the call — check the token is still valid in the Vercel env vars. |
| No number in `npm run dev` | Expected. Use `vercel dev`. |
| Number jumps by 2 per visit | React StrictMode double-effect. There is a `useRef` guard for this in `ViewCounter.jsx`; if it reappears, that guard is the place to look. |

## Verified before pushing

- `npm run lint` — clean.
- `npm run build` — succeeds.
- Handler tested against a stubbed Upstash: `POST` returned `{views: 42}` after
  incrementing, `GET` returned 42 without incrementing, and an Upstash 500
  degraded to a 502 rather than throwing.

Not verified: the live path against real Upstash credentials, which is exactly
what the setup step above closes.

---

Drafted by Claude (Claude Code) on 2026-08-12 for Wence Tongol. Review before
relying on it.
