// Every string here is taken from wencetongol.vercel.app or from the brief.
// Edit this file to change on-screen copy; timings live in src/timing.ts.

export const PERSON = {
  name: 'Wence Tongol',
  title: 'Full-Stack Developer',
  location: 'Pampanga, Philippines',
  url: 'wencetongol.vercel.app',
};

// Supplied in the brief.
export const POSITIONING =
  'Next.js and React interfaces, the APIs behind them, and the automation that connects both to AI tools.';
// Words from POSITIONING drawn in the accent colour.
// Line breaks used on screen (same words).
export const POSITIONING_LINES =
  'Next.js and React interfaces,\nthe APIs behind them,\nand the automation that connects\nboth to AI tools.';
export const POSITIONING_ACCENT = ['AI', 'tools.'];

export const STACK_HEADING = 'Technical stack';
export const STACK_SUB =
  'The languages, platforms, and practices I work with day to day.';

export type Project = {
  name: string;
  subtitle: string;
  meta: string; // year or "Capstone project"
  category: string;
  tech: string[];
  device: 'browser' | 'phone';
  url?: string;
  shots: { src: string; alt: string }[];
};

export const PROJECTS: Project[] = [
  {
    name: 'TechSelect',
    subtitle: 'Job Board for Software, Web and Automation Work',
    meta: '2026',
    category: 'Full-stack web development',
    tech: ['Next.js 16', 'TypeScript', 'Supabase', 'pgvector', 'Drizzle ORM'],
    device: 'browser',
    url: 'techselect.vercel.app',
    shots: [
      { src: 'shots/TS1.webp', alt: 'The TechSelect landing page, with an example match' },
      { src: 'shots/TS2.webp', alt: 'Browsing jobs, with search and filters' },
      { src: 'shots/TS5.webp', alt: 'The developer dashboard and its match feed' },
    ],
  },
  {
    name: 'BarberHouse',
    subtitle: 'Barbershop Booking Website',
    meta: '2026',
    category: 'Full-stack web development',
    tech: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'REST API'],
    device: 'browser',
    url: 'barberhouseph.vercel.app',
    shots: [
      { src: 'shots/BH1.webp', alt: 'BarberHouse landing page' },
      { src: 'shots/BH3.webp', alt: 'Booking step one: barber and service' },
      { src: 'shots/BH4.webp', alt: 'Booking step two: calendar and open slots' },
    ],
  },
  {
    name: 'VistaVR',
    subtitle: 'Virtual Reality Eye Testing Application',
    meta: 'Capstone project',
    category: 'Undergraduate capstone',
    tech: ['Unity', 'C#'],
    device: 'phone',
    shots: [
      { src: 'shots/VR1.webp', alt: 'VistaVR title screen' },
      { src: 'shots/VR2.webp', alt: 'Visual acuity chart rendered in the VR headset view' },
      { src: 'shots/VR3.webp', alt: 'Screening test running in the virtual room' },
    ],
  },
];
