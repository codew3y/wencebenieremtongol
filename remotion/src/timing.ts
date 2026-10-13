// All timings in frames at 30 fps. Total 1200 frames = 40 s.
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const SCENES = {
  intro: { from: 0, duration: 150 }, // 0–5 s
  positioning: { from: 150, duration: 120 }, // 5–9 s
  stack: { from: 270, duration: 180 }, // 9–15 s
  projects: { from: 450, duration: 600 }, // 15–35 s (3 × 200)
  cta: { from: 1050, duration: 150 }, // 35–40 s
};

export const PROJECT_DURATION = 200;
export const EXIT_FRAMES = 12; // every scene leaves with a 0.4 s rise + fade
export const TOTAL_FRAMES = 1200;
