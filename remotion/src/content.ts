// Real portfolio projects used in the product showcases. Narrative copy and
// layouts live in scenes.tsx; these are the actual project screenshots.
export type Project = {
  name: string;
  url: string;
  shots: { src: string; alt: string }[];
};
export const PROJECTS: Project[] = [
  {
    name: "TechSelect",
    url: "techselect.vercel.app",
    shots: [
      { src: "shots/TS1.webp", alt: "TechSelect landing page" },
      { src: "shots/TS2.webp", alt: "How matching works, end to end" },
    ],
  },
  {
    name: "BarberHouse",
    url: "barberhouseph.vercel.app",
    shots: [
      { src: "shots/BH1.webp", alt: "BarberHouse landing page" },
      { src: "shots/BH3.webp", alt: "The three barbers, each bookable directly" },
    ],
  },
];
