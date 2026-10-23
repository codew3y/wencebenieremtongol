# wencetongol

Source for my portfolio, live at **[wencetongol.vercel.app](https://wencetongol.vercel.app/)**.

A single-page React site covering my background, skills, experience and
projects, with a short motion film in the hero, a working contact form and a
shared poke counter. Deployed on Vercel.

## Structure

```
frontend/    the site: React 19, Vite, Tailwind CSS 4
backend/     serverless handlers for the contact form and poke counter, with tests
api/         Vercel routes; each file re-exports its handler from backend/
remotion/    source for the hero film, rendered with Remotion
```

`api/` exists because Vercel only discovers serverless functions in a
top-level `api/` folder. It holds no logic of its own.

## Stack

| Area      | Used                                              |
| --------- | ------------------------------------------------- |
| Framework | React 19, Vite (rolldown-vite)                    |
| Styling   | Tailwind CSS 4, CSS custom properties for theming |
| Motion    | framer-motion; the hero film is built in Remotion |
| Backend   | Vercel serverless functions                       |
| Mail      | Resend                                            |
| Storage   | Upstash Redis (rate limiting, poke counter)       |
| Testing   | `node:test`, run in GitHub Actions                |

## Running it

```bash
npm install                     # backend lint tooling
npm install --prefix frontend   # the site
npm run dev                     # dev server at localhost:5173
npm test                        # backend and frontend tests
npm run lint
npm run build                   # production build to frontend/dist
```

`npm run dev` serves the site only. Vite has no serverless runtime, so
`/api/*` returns 404 locally. To run the functions as well, use the Vercel
CLI: `vercel link`, `vercel env pull`, then `vercel dev`.

## Configuration

Credentials live in Vercel's environment variables, never in the repository.

| Variable                                   | Purpose                                            |
| ------------------------------------------ | -------------------------------------------------- |
| `RESEND_API_KEY`                           | Sends contact form messages                        |
| `CONTACT_TO`                               | The inbox that receives them                       |
| `CONTACT_FROM`                             | Optional sender; defaults to Resend's onboarding address |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN`     | Upstash Redis, for rate limiting and the poke counter |

The Upstash pair may instead be named `UPSTASH_REDIS_REST_URL` and
`UPSTASH_REDIS_REST_TOKEN`, depending on how the store was connected; both are
accepted.

Nothing is required for the site to run. Without credentials the contact form
answers 503 and names the variable that is missing, the rate limiter fails
open, and the poke counter stops being shared between visitors.

## The hero film

The film is a 30-second Remotion composition with a light and a dark cut that
cross-fade when the theme changes.

```bash
cd remotion
npm ci
npm run studio        # preview in the browser
npm run render        # render both cuts and install them into the site
```

A render encodes H.264 and VP9 at 1280×720 plus WebP posters, writes them to
`frontend/public/videos/` under content-hashed names, and updates
`frontend/src/lib/reel-version.js`, so a new cut never collides with a cached
old one.

## Notes

Screenshots of client projects are withheld. That work belongs to my employer
and carries their data, so those cards use architecture diagrams instead.

## Credits

Fonts are Geist by Vercel and JetBrains Mono by JetBrains, both under the SIL
Open Font License 1.1. Brand icons come from Simple Icons. The film is built
with Remotion and encoded with FFmpeg.
