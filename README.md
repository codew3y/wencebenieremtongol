# wencebenieremtongol

Source for my personal portfolio, live at
**[wencetongol.vercel.app](https://wencetongol.vercel.app/)**.

A single-page React site covering my background, skills, work history and
projects, with a working contact form behind a serverless endpoint. Deployed on
Vercel.

## Layout

```
wencetongol/           the site (React 19 + Vite)
  api/contact.js       serverless contact endpoint
  src/                 components, theme tokens, assets
  test/                unit tests for the endpoint and its config
.github/workflows/     CI: lint, test, build on every push
HANDOVER.md            notes on how the pieces fit together
```

## Stack

| Area      | Used                                             |
| --------- | ------------------------------------------------ |
| Framework | React 19, Vite (rolldown-vite)                    |
| Styling   | Tailwind CSS 4, CSS custom properties for theming |
| Motion    | framer-motion                                     |
| Mail      | Resend, via `api/contact.js`                      |
| Testing   | `node:test`, run in GitHub Actions                |
| Hosting   | Vercel                                            |

## Running it

```bash
cd wencetongol
npm install
npm run dev      # dev server with HMR
npm run build    # production build to dist/
npm test         # unit tests
npm run lint     # eslint
```

The contact endpoint needs `RESEND_API_KEY`, `CONTACT_TO` and `CONTACT_FROM` in
the environment. Without them the form returns a 503 naming what is missing;
everything else on the site runs fine without any configuration.

`wencetongol/README.md` goes into more detail on the theming and the component
layout.

## Notes

The screenshots for the client projects are withheld — that work belongs to my
employer and carries their data, so those cards use generated architecture
diagrams instead.
