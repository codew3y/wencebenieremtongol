// Real portfolio projects used in the product showcases. Narrative copy and
// layouts live in scenes.tsx; these are the actual project screenshots.
export type Project = {
  name: string;
  url: string;
  /** The landing page, shown inside the browser frame in its scene. */
  landing: { src: string; alt: string };
  /** The dark cut of the same page, where the site has one. BarberHouse is
   *  dark only, so it reuses its single shot in both films. */
  landingDark?: { src: string; alt: string };
  shots: { src: string; alt: string }[];
};
export const PROJECTS: Project[] = [
  {
    name: "TechSelect",
    url: "techselect.vercel.app",
    landing: { src: "shots/TS1.webp", alt: "The TechSelect landing page" },
    landingDark: {
      src: "shots/TS1-dark.webp",
      alt: "The TechSelect landing page, dark theme",
    },
    shots: [
      { src: "shots/TS1.webp", alt: "TechSelect landing page" },
      { src: "shots/TS2.webp", alt: "How matching works, end to end" },
    ],
  },
  {
    name: "BarberHouse",
    url: "barberhouseph.vercel.app",
    landing: { src: "shots/BH1.webp", alt: "The BarberHouse landing page" },
    shots: [
      { src: "shots/BH1.webp", alt: "BarberHouse landing page" },
      { src: "shots/BH3.webp", alt: "The three barbers, each bookable directly" },
    ],
  },
];
