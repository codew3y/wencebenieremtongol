# Digital craft — landing-page motion film

A completely rebuilt 30-second Remotion film for Wence Tongol’s portfolio.
Both themes share the same 900-frame timeline, with colours drawn from the
site’s Geist / JetBrains Mono / zinc / electric-blue visual system.

## Preview locally

```bash
cd remotion
npm ci
npm run studio
```

Select `HeroAd-light` or `HeroAd-dark`. The composition is 1920×1080 at 30 fps,
silent, with matching first and last frames for a seamless loop.

| Time | Scene |
| --- | --- |
| 0–4 s | Wence Tongol and a rotating orbital wire cube |
| 4–8 s | Idea → interface → API → data |
| 8–13 s | TechSelect, with a themed UI preview |
| 13–18 s | BarberHouse, with a themed UI preview |
| 18–23 s | AI assistant → MCP connector → enterprise APIs |
| 23–26 s | VistaVR in an aligned headset-style viewport |
| 26–30 s | Invitation to build, returning to the opening identity |

The enterprise diagram describes the portfolio’s Azure / Entra ID / Microsoft
Graph / Purview / Bexio connector work. It uses an abstract diagram rather than
invented client screens. No stock images, audio, or external assets are fetched
while rendering.

TechSelect and BarberHouse use React-drawn UI studies based on their public
product interfaces, with aligned browser frames. Every app/device preview stays level with no rotation or perspective tilt.
The film has a clean background with no grid or progress/loading bars.
Both previews follow the film’s theme; the BarberHouse light treatment is specific to this film. VistaVR
retains its original VR screenshot.

## Render and install

```bash
npm run render        # both themes
npm run render:light  # light only
npm run render:dark   # dark only
```

Each command renders a 1080p master into `out/<theme>/`, encodes 1280×720
H.264 MP4 and VP9 WebM, renders the opening-frame poster, then installs all three
delivery files with filenames containing their content hash into `../wencetongol/public/videos/<theme>/`.
After encoding, the script updates `src/lib/reel-version.js` in the site from
the delivered video bytes and filenames so a new render replaces cached older cuts. The player also
remounts its media elements when that version changes.
FFmpeg is provided by Remotion; a separate system install is unnecessary.
You can override it with `FFMPEG=/path/to/ffmpeg`. Remotion downloads its
headless browser on first use. Use `REMOTION_BROWSER=/path/to/chrome` to select
a custom browser in either the CLI or the render scripts.

Review the integrated page with:

```bash
cd ../wencetongol
npm run dev
```

The film appears on desktop and mobile, warms both lightweight cuts near the
viewport, pauses offscreen and in background tabs, and offers a pause/play
button. Theme changes immediately show the requested palette, then fade in
the matching video once it has sought to the same point in the film. Reduced-motion
preferences show a themed static poster and fetch no video. The player and
poster are non-selectable and non-draggable.

## Edit and check

| File | Purpose |
| --- | --- |
| `src/scenes.tsx` | Scene layouts, narrative copy and animation |
| `src/ProjectUI.tsx` | Theme-aware TechSelect and BarberHouse previews |
| `src/primitives.tsx` | Motion helpers and projected wire cube |
| `src/content.ts` | Product names, URLs and screenshot references |
| `src/theme.ts` | Light and dark colours |
| `src/timing.ts` | Scene timing and composition dimensions |
| `scripts/render.mjs` | Render and encode delivery files |
| `scripts/install.mjs` | Install immutable assets and update the player version |
| `scripts/preview.mjs` | Render representative review frames in both themes |

```bash
npm run typecheck
npm run contrast
npm run preview       # PNGs in out/review/
```

Browser checks: autoplay, pause/resume, toggle themes while playing and paused,
scroll away and back, resize to mobile, and enable reduced motion. Both cuts
should show the same scene after a theme switch. The source’s frame 0 and
frame 899 should match exactly.
