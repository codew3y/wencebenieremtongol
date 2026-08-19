# Personal Portfolio — Wence Benierem Tongol

Single-page portfolio site presenting my technical skills, project work, and
professional background. Live at
[wencetongol.vercel.app](https://wencetongol.vercel.app/).

## Stack

- **React 19** + **Vite** (rolldown-vite)
- **Tailwind CSS 4** for styling
- **framer-motion** for scroll and entrance animations
- **react-icons** for iconography
- **Formspree** for the contact form

## Getting started

```bash
npm install
npm run dev      # dev server with HMR
npm run build    # production build to dist/
npm run preview  # serve the production build
npm run lint     # eslint
```

## Theming

The site ships a light and a dark theme.

- The palette lives in `src/index.css` as CSS custom properties: `:root` holds the
  light values, `.dark` overrides them. `@theme inline` re-exports them to Tailwind,
  so utilities such as `bg-surface`, `text-muted`, and `border-line` follow the active
  theme without any `dark:` variants in the components.
- Tailwind 4 defaults to `prefers-color-scheme`, so `@custom-variant dark` in
  `src/index.css` switches it to class-based (`.dark` on `<html>`).
- `src/components/ThemeToggle.jsx` owns the toggle. It stores an explicit choice in
  `localStorage` under `theme`, and keeps following the OS setting until the visitor
  picks a side.
- An inline script in `index.html` applies the stored or system theme before first
  paint, so there is no flash of the wrong theme.

To adjust colours, edit the custom properties in `src/index.css` — nothing else needs
to change.

## View counter

The footer shows a total page-view count. Every page load POSTs to `/api/views`,
a Vercel serverless function that increments one Redis key (`pageviews:site`) on
Upstash and returns the new total. The count is total views, so refreshes and
repeat visits each add one.

Setup is one step in the Vercel dashboard: **Storage → Create Database → Upstash
Redis**, connected to this project. That injects the credentials as environment
variables — `api/views.js` reads either `KV_REST_API_URL` / `KV_REST_API_TOKEN`
or `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`, whichever the
integration provides.

Until the store exists the endpoint returns 503, and `ViewCounter.jsx` renders
nothing on any failure — so the footer degrades to just the copyright line
instead of showing a wrong number. The same applies to `npm run dev`, which
serves no serverless functions; use `vercel dev` to exercise the endpoint
locally.

## Ask-about-my-work assistant

The hero's **Ask about my work** button opens a dialog backed by `/api/chat`,
which answers questions from `api/_corpus.js` and nothing else. The corpus is a
prose copy of what the sections already say, so the assistant cannot invent an
employer, a date, or a credential — anything outside it gets "that isn't
covered here, use the contact form".

Setup is one environment variable: `GEMINI_API_KEY`, from
[Google AI Studio](https://aistudio.google.com/apikey) — the free tier needs no
card. `GEMINI_MODEL` optionally overrides the default `gemini-2.5-flash-lite`,
which carries the highest free daily request allowance of the 2.5 line.

The free tier is metered in requests per minute and per day rather than in
dollars, so the state to design for is a visitor meeting a limit, not a bill.
Every failure — this endpoint's own per-IP limit, Google's daily quota, a
missing key, an upstream fault — returns a `reason` that the dialog turns into a
sentence pointing at the résumé and the contact form. Unlike the contact form's
limiter, this one fails *closed*: a Redis outage stops the endpoint rather than
leaving a metered quota open to a loop.

`test/corpus.test.js` fails if a project reaches `Projects.jsx` without reaching
the corpus, which is the drift that would otherwise go unnoticed.

## Structure

```
api/
  chat.js              grounded Q&A endpoint (Gemini free tier)
  _corpus.js           the only facts the assistant may answer from
  views.js             serverless view counter (Upstash Redis)
src/
  App.jsx              page shell, section order, background layers
  index.css            theme tokens, fonts, grid/glow backdrop
  components/
    Section.jsx        shared section header (index label + title + intro)
    ThemeToggle.jsx    light/dark switch
    Navbar.jsx         fixed nav with active-section highlighting
    Hero.jsx           intro + terminal-style profile card
    About.jsx  Skills.jsx  Experience.jsx
    Projects.jsx  Education.jsx  Contact.jsx  Footer.jsx
    ViewCounter.jsx    footer view count, fed by /api/views
  assets/
    CV/                résumé PDF served by the download button
    img/               profile photo and project imagery
```

## Content

Section content is plain data at the top of each component (`roles`, `groups`,
`professional`, `certifications`, …), so updates are edits to those arrays rather
than to markup. The résumé PDF in `src/assets/CV/` backs the Hero download button —
when it is replaced, update the import in `src/components/Hero.jsx`.
