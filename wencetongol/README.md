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

## Structure

```
api/
  contact.js           serverless contact endpoint (Resend)
src/
  App.jsx              page shell, section order, background layers
  index.css            theme tokens, fonts, grid/glow backdrop
  components/
    Section.jsx        shared section header (index label + title + intro)
    ThemeToggle.jsx    light/dark switch
    Navbar.jsx         fixed nav with active-section highlighting
    Home.jsx           landing screen
    About.jsx  Skills.jsx  Experience.jsx
    Projects.jsx  Education.jsx  Contact.jsx  Footer.jsx
  assets/
    CV/                résumé PDF served by the download button
    img/               profile photo and project imagery
```

## Content

Section content is plain data at the top of each component (`roles`, `groups`,
`professional`, `certifications`, …), so updates are edits to those arrays rather
than to markup. The résumé PDF in `src/assets/CV/` backs the résumé viewer —
when it is replaced, the import lives in `src/components/ResumeModal.jsx`.
