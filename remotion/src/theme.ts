// Colour tokens taken from wencetongol.vercel.app (src/index.css, :root and .dark).
// Only the canvas changes: pure #ffffff / #000000 so the video blends into the
// hero overlay without a visible edge. Every text pair is checked in
// scripts/contrast.mjs (WCAG AA, 4.5:1 minimum).

export type ThemeName = 'light' | 'dark';

export type Tokens = {
  bg: string;
  fg: string;
  muted: string;
  faint: string;
  line: string;
  lineStrong: string;
  surface: string;
  surface2: string;
  accent: string;
  accentFg: string;
  accentSoft: string;
  frame: string; // device chrome
  frameBar: string;
  dot: string;
  shadow: string;
};

export const THEMES: Record<ThemeName, Tokens> = {
  light: {
    bg: '#ffffff',
    fg: '#18181b',
    muted: '#52525b',
    faint: '#63636d',
    line: '#e4e4e7',
    lineStrong: '#c7c7cc',
    surface: '#fafafa',
    surface2: '#f4f4f5',
    accent: '#1d4ed8',
    accentFg: '#ffffff',
    accentSoft: 'rgba(29, 78, 216, 0.08)',
    frame: '#ffffff',
    frameBar: '#f4f4f5',
    dot: '#d4d4d8',
    shadow: '0 2px 4px rgba(24,24,27,0.05), 0 24px 48px -16px rgba(24,24,27,0.18)',
  },
  dark: {
    bg: '#000000',
    fg: '#eaeaef',
    muted: '#a1a1aa',
    faint: '#85858f',
    line: 'rgba(255, 255, 255, 0.12)',
    lineStrong: 'rgba(255, 255, 255, 0.22)',
    surface: '#0b0b0d',
    surface2: '#141417',
    accent: '#60a5fa',
    accentFg: '#07203f',
    accentSoft: 'rgba(96, 165, 250, 0.14)',
    frame: '#0b0b0d',
    frameBar: '#141417',
    dot: '#3f3f46',
    shadow: '0 2px 6px rgba(0,0,0,0.5), 0 24px 48px -16px rgba(0,0,0,0.7)',
  },
};

export const FONT_SANS = '"Geist Variable", Geist, system-ui, sans-serif';
export const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';
