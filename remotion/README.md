# Hero reel: Remotion source

*Drafted by Claude for Wey.*

This is the source for the 40-second promo reel that plays over the hero card on wencetongol.vercel.app. One component, `HeroAd`, takes a `theme` prop (`"light"` or `"dark"`). The two composition IDs, `HeroAd-light` and `HeroAd-dark`, are the same component with different default props.

Specs: 1920×1080, 30 fps, 1200 frames, no audio. The first and last frames are the bare canvas (#ffffff or #000000), so the loop has no visible seam.

## Setup

```bash
npm install
```

Needs Node 18 or later and ffmpeg on your PATH for the encode step. Remotion downloads its own headless Chrome the first time you render. To use a browser you already have, set `REMOTION_BROWSER=/path/to/chrome-headless-shell`.

## Preview and edit

```bash
npm run studio
```

| What to change | File |
|---|---|
| On-screen copy, projects, screenshots | `src/content.ts` |
| Scene start times and lengths | `src/timing.ts` |
| Colours, per theme (taken from the site's `index.css`) | `src/theme.ts` |
| Stack icons (generated from simple-icons) | `src/icons.ts` |
| Scene layouts | `src/scenes.tsx` |
| Shared motion: typewriter, word reveal, device frames | `src/primitives.tsx` |

Screenshots live in `public/shots/`. They are copied from the portfolio repo (`src/assets/img/projectsimg/`).

## Render each theme

```bash
# dark
npm run render:dark          # out/dark/master.mp4 (high-quality master, CRF 10)
scripts/encode.sh dark       # out/dark/ads.mp4 (H.264) + out/dark/ads.webm (VP9)
npm run poster:dark          # out/dark/poster.png (frame 100, the name card)

# light
npm run render:light
scripts/encode.sh light
npm run poster:light
```

Or render with a prop directly:

```bash
npx remotion render src/index.ts HeroAd-dark out/x.mp4 --props='{"theme":"light"}'
```

Shipped sizes: about 4.0 MB per MP4 and 2.5 MB per WebM. The 10 MB budget leaves room, so you can lower the CRF in `scripts/encode.sh` if you want sharper output.

## Checks

```bash
npm run contrast   # WCAG contrast for every text/background pair; exits 1 on any failure
npx tsc -p .       # type-check
```

## Using it on the site

1. Copy `light/` and `dark/` (each with `ads.mp4`, `ads.webm`, `poster.png`) into `public/videos/`.
2. Wrap the hero card in `HeroVideo` (see `HeroVideo.tsx` next to this folder).
